<script setup lang="ts">
import { onMounted, reactive, ref, toRef, toRefs, watch } from 'vue';
import { useCommons } from '../../composables/useCommons';
import { serializeDayStyles } from '../../composables/useDayStyles';
import { definePopoverEvents } from '../../composables/usePopover';
import { useSlots } from '../../composables/useVue';
import { mergeEvents } from '../../utils/helpers';
import { updatePopover } from '../../utils/popovers';
import type { Day } from '~/data';
import type { PopoverEventsOptions } from '~/options';

type CalendarPageDayOptions = { day: Day };
type EventsEnum =
  | 'dayclick'
  | 'daymouseenter'
  | 'daymouseleave'
  | 'dayfocusin'
  | 'dayfocusout'
  | 'daykeydown';

const props = defineProps<CalendarPageDayOptions>();
const emit = defineEmits([
  'dayclick',
  'daymouseenter',
  'daymouseleave',
  'dayfocusin',
  'dayfocusout',
  'daykeydown',
]);

const { hasSlot, callSlot } = useSlots();
const { dayPopoverId, theme } = useCommons();

const dayContent = ref<Element>();
const dayEvents = ref<Record<string, any>>();
const options = reactive<Partial<ReturnType<typeof serializeDayStyles>>>({});

// generate events for user interaction
const newEvent = (name: EventsEnum) => (ev: Event) => {
  const params = {
    day: props.day,
    el: dayContent.value,
    popovers: options.popovers,
  };
  emit(name, params, ev);
};

// events for the component
const baseEvents = {
  click: newEvent('dayclick'),
  keydown: newEvent('daykeydown'),
  focusin: newEvent('dayfocusin'),
  focusout: newEvent('dayfocusout'),
  mouseenter: newEvent('daymouseenter'),
  mouseleave: newEvent('daymouseleave'),
};

// refresh the component styles
const refresh = () => {
  if (!props.day.shouldRefresh) return;
  props.day.shouldRefresh = false;

  props.day.attributes = Object.values(props.day.attributesMap || {}) //
    .sort((a, b) => a.order - b.order);

  Object.assign(options, serializeDayStyles(props.day));
};

// refresh the events
const refreshEvents = () => {
  if (!options.popovers?.length) {
    dayEvents.value = baseEvents;
    return;
  }

  const popoverParams = options.popovers.reduce(
    (prev, current) => ({ ...current, ...prev }),
    { id: dayPopoverId.value, data: props.day },
  ) as PopoverEventsOptions;

  const popoverEvents = definePopoverEvents(popoverParams);
  dayEvents.value = mergeEvents(baseEvents, popoverEvents);

  updatePopover({ id: dayPopoverId.value, data: props.day });
};

// reactivity
watch([toRef(props.day, 'shouldRefresh'), theme], refresh);
watch(toRef(options, 'popovers'), refreshEvents);
onMounted(() => {
  refresh();
  refreshEvents();
});

// exposed values
defineExpose({
  ...toRefs(options),
  hasSlot,
  callSlot,

  dayContent,
  dayEvents,
});
</script>

<script lang="ts">
import { h } from 'vue';

export default {
  inheritAttrs: false,
  render() {
    // props applied to the day content component
    const dayContentProps: Record<string, unknown> = {
      role: 'button',
      'aria-label': this.day.ariaLabel,
      'aria-disabled': String(this.day.isDisabled),
    };

    if (this.day.isFocusable) {
      dayContentProps.tabindex = '0';
    } else if (this.day.inMonth) {
      dayContentProps.tabindex = '-1';
    }

    // classes applied to the root component
    const dayClass = [
      'vc-day',
      ...this.day.classes,
      !this.hasSlot('day-content') && 'vc-day-box-center-center',
      !this.day.inMonth && 'is-not-in-month',
    ];

    //
    // ---------------------------------------------------------
    //

    const layers = [];

    // * Backgrounds Layer
    if (this.backgrounds?.length) {
      const backgrounds = this.backgrounds.map(
        ({ key, class: backgroundClass, wrapperClass, style }) => {
          return h('div', { key, class: wrapperClass }, [
            h('div', { class: backgroundClass, style }),
          ]);
        },
      );

      layers.push(
        h('div', { class: 'vc-highlights vc-day-layer' }, backgrounds),
      );
    }

    // * Content Layer
    if (this.hasSlot('day-content')) {
      layers.push(
        this.callSlot('day-content', {
          day: this.day,
          props: dayContentProps,
          events: this.dayEvents,
        }),
      );
    }
    // Default Content
    else {
      const dayContent = this.content?.at(-1);
      const dayContentClass = [
        'vc-day-content vc-focusable',
        this.day.isDisabled && 'is-disabled',
        dayContent?.class || '',
      ];

      const params = {
        ...dayContentProps,
        class: dayContentClass,
        style: dayContent?.style,
        on: this.dayEvents,
        ref: this.dayContent,
      } as never;

      layers.push(h('span', params, this.day.label));
    }

    // * Dots Layer
    if (this.dots?.length) {
      const dots = this.dots.map(({ wrapperClass, ...args }) => {
        return h('span', args);
      });

      layers.push(
        h(
          'div',
          { class: 'vc-day-layer vc-day-box-center-bottom' },
          h('div', { class: 'vc-dots' }, dots),
        ),
      );
    }

    // * Bars Layer
    if (this.bars?.length) {
      const bars = this.bars.map(({ wrapperClass, ...args }) => {
        return h('span', args);
      });

      layers.push(
        h(
          'div',
          { class: 'vc-day-layer vc-day-box-center-bottom' },
          h('div', { class: 'vc-bars' }, bars),
        ),
      );
    }

    // * Root Layer
    return h('div', { class: dayClass }, layers);
  },
};
</script>
