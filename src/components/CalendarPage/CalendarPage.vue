<script setup lang="ts">
import { computed } from 'vue';
import { getDefault } from '../../utils/defaults';
import { useCommons } from '../../composables/useCommons';
import { definePopoverEvents } from '../../composables/usePopover';
import { useSlots } from '../../composables/useVue';
import type { Day } from '~/data';
import type {
  MonthPage,
  PopoverPosition,
  PopoverVisibility,
  WeeknumbersVisibility,
} from '~/options';

interface CalendarPage {
  page: MonthPage;
  position: number;
  titlePosition: PopoverPosition;
  navVisibility?: PopoverVisibility;

  row: number;
  rowFromEnd: number;
  column: number;
  columnFromEnd: number;

  showWeeknumbers: boolean | WeeknumbersVisibility;
  showIsoWeeknumbers: boolean | WeeknumbersVisibility;
}

const props = withDefaults(defineProps<CalendarPage>(), {
  navVisibility: () => getDefault('navVisibility'),
});

const { callSlot } = useSlots();
const { navPopoverId } = useCommons();

// serialize the `show-weeknumbers` props
const options = computed(() => {
  let side = false as false | 'left' | 'right';
  let outside = false;

  const showNumbers = props.showWeeknumbers ?? props.showIsoWeeknumbers;
  if (typeof showNumbers !== 'string') {
    side = showNumbers ? 'left' : false;
  } else {
    side = showNumbers.startsWith('right') ? 'right' : 'left';
    if (showNumbers.endsWith('outside')) {
      outside =
        (side === 'left' && props.column === 1) ||
        (side === 'right' && props.columnFromEnd === 1);
    }
  }

  return { side, outside, iso: Boolean(props.showWeeknumbers) };
});

// calculate the position for the popover
const navPlacement = computed(() => {
  if (props.titlePosition === 'left') return 'bottom-start';
  if (props.titlePosition === 'right') return 'bottom-end';
  return 'bottom';
});

// keep the events in sync
const navEvents = computed(() => {
  const { page, position } = props;
  return definePopoverEvents({
    id: navPopoverId.value,
    // TODO: puede haber mejor manera de pasar la informacion
    data: { page, position },
    placement: navPlacement.value,
    visibility: props.navVisibility,
    modifiers: [{ name: 'flip', options: { fallbackPlacements: ['bottom'] } }],
    isInteractive: true,
  });
});

defineExpose({ callSlot, navEvents, options });
</script>

<script lang="ts">
import { h } from 'vue';
import CalendarPageDay from './CalendarPageDay.vue';
import CalendarPageWeeks from './CalendarPageWeeks.vue';

export default {
  inheritAttrs: false,
  render() {
    // * CalendarPage Header Title
    const title = h(
      'div',
      { class: 'vc-title', on: this.navEvents },
      this.callSlot('header-title', this.page, this.page.title),
    );

    // * CalendarPage Header
    const header =
      this.callSlot('header', { page: this.page }) ||
      // Default CalendarPage Header
      h('div', { class: ['vc-header', `align-${props.titlePosition}`] }, title);

    // * CalendarPage Content (Weeks)
    const content = h(
      CalendarPageWeeks,
      { days: this.page.days, weeknumbers: this.options },
      ((day: Day) => {
        return h(CalendarPageDay, { ...this.$attrs, day }, this.$slots);
      }) as never,
    );

    // * CalendarPage
    return h(
      'div',
      {
        class: [
          'vc-pane',
          `row-from-end-${this.rowFromEnd}`,
          `column-from-end-${this.columnFromEnd}`,
        ],
      },
      [header, content],
    );
  },
};
</script>
