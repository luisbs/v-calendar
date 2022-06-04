<script setup lang="ts">
import { computed, defineEmits, defineProps, h } from 'vue';
import { useCommons } from '../../composables/useCommons';
import { hFor, hIf, useSlots } from '../../composables/useVue';

import type { Day } from '~/data';

export interface CalendarPanelWeeksOptions {
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

defineEmits(['weeknumberclick']);
defineProps<CalendarPanelWeeksOptions>();
const { callSlot } = useSlots();

// get the weekday labels based on locale
const { locale, masks } = useCommons();
const weekdayLabels = computed(() => {
  return locale
    .getWeekdayDates()
    .map(date => locale.format(date, masks.weekdays));
});
</script>

<script lang="ts">
export default {
  render() {
    const daysInWeek = locale.daysInWeek;
    const weeknumbersKey = this.weeknumbers.iso
      ? 'isoWeeknumber'
      : 'weeknumber';

    // class applied to the week number cells
    const weeknumberCls =
      'is-' + //
      (this.weeknumbers.side ?? 'left') +
      (this.weeknumbers.outside ? '-outside' : '');

    // render week number cell
    const renderWeeknumberCell = (weeknumber: number) => {
      return h(
        'span',
        {
          class: ['vc-weeknumber-content', weeknumberCls],
          onClick: (ev: MouseEvent) => {
            const days = this.days.filter(
              day => day[weeknumbersKey] === weeknumber,
            );
            this.$emit('weeknumberclick', { weeknumber, days }, ev);
          },
        },
        weeknumber,
      );
    };

    // make easier to use the `showWeeknumbers` prop
    const showLeft = this.weeknumbers.side === 'left';
    const showRight = this.weeknumbers.side === 'right';

    // class applied to the weeks container
    const weekCls = this.weeknumbers.side //
      ? ['vc-weeks', 'vc-show-weeknumbers', `is-${this.weeknumbers.side}`]
      : ['vc-weeks'];

    // rendered content
    return h('div', { class: weekCls }, [
      // CalendarPage Weekday Labels
      hIf(showLeft, 'div'),
      ...hFor(weekdayLabels, key => {
        return h('div', { key, class: 'vc-weekday' }, key);
      }),
      hIf(showRight, 'div'),

      // CalendarPage Days
      ...hFor(this.days, (day, i) => {
        const mod = i % daysInWeek;
        return [
          // weeknumber cell on left side
          showLeft && mod === 0
            ? renderWeeknumberCell(day[weeknumbersKey])
            : undefined,

          // weekday
          callSlot('week-day', day, day.label),

          // weeknumber cell on right side
          showRight && mod === daysInWeek - 1
            ? renderWeeknumberCell(day[weeknumbersKey])
            : undefined,
        ];
      }),
    ]);
  },
};
</script>
