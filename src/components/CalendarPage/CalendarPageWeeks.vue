<script setup lang="ts">
import { computed } from 'vue';
import { useWeekdays } from '../../composables/useDateFns';
import { useSlots } from '../../composables/useVue';
import type { Day } from '~/data';

interface CalendarPageWeeksOptions {
  days: Day[];
  weeknumbers: {
    /** Defines if the weeknumbers should be showned */
    side: false | 'left' | 'right';
    /** Defines if the weeknumbers should be showned outside */
    outside: boolean;
    /** Defines if the ISO weeknumbers should be used */
    iso: boolean;
  };
}

const emit = defineEmits(['weeknumberclick']);
const props = defineProps<CalendarPageWeeksOptions>();

const { callSlot } = useSlots();
const { daysInWeek, weekdayLabels } = useWeekdays();

// weeknumber to use
const weeknumbersKey = computed(() => {
  return props.weeknumbers.iso ? 'isoWeeknumber' : 'weeknumber';
});

// emit weeknumber click
const onClick = (ev: MouseEvent, weeknumber: number) => {
  const days = props.days.filter(day => {
    return day[weeknumbersKey.value] === weeknumber;
  });
  emit('weeknumberclick', { weeknumber, days }, ev);
};

defineExpose({ callSlot, onClick, daysInWeek, weekdayLabels, weeknumbersKey });
</script>

<script lang="ts">
import { h } from 'vue';

export default {
  inheritAttrs: false,
  render() {
    const showLeft = this.weeknumbers.side === 'left';
    const showRight = this.weeknumbers.side === 'right';

    // class applied to the weeks container
    const weekClass = this.weeknumbers.side //
      ? ['vc-weeks', 'vc-show-weeknumbers', `is-${this.weeknumbers.side}`]
      : ['vc-weeks'];

    // class applied to the week number cells
    const weeknumberClass = [
      'vc-weeknumber-content',
      'is-' + //
        (this.weeknumbers.side ?? 'left') +
        (this.weeknumbers.outside ? '-outside' : ''),
    ];

    // * Render weeknumber cell
    const renderWeeknumberCell = (weeknumber: number) => {
      const onClick = (ev: MouseEvent) => this.onClick(ev, weeknumber);
      return h('span', { class: weeknumberClass, onClick }, weeknumber);
    };

    //
    // ---------------------------------------------------------------
    //

    const content = [];

    // * CalendarPage Weekday Labels
    if (showLeft) content.push(h('div'));
    for (const key of this.weekdayLabels) {
      content.push(h('div', { key, class: 'vc-weekday' }, key));
    }
    if (showRight) content.push(h('div'));

    // * CalendarPage Days
    for (const [i, day] of this.days.entries()) {
      const mod = i % this.daysInWeek;

      // left weeknumber
      if (showLeft && mod === 0) {
        content.push(renderWeeknumberCell(day[this.weeknumbersKey]));
      }

      // weekday
      content.push(this.callSlot('default', day, day.label));

      // right weeknumber
      if (showRight && mod === this.daysInWeek - 1) {
        content.push(renderWeeknumberCell(day[this.weeknumbersKey]));
      }
    }

    // * CalendarPage Weeks
    return h('div', { class: weekClass }, content);
  },
};
</script>
