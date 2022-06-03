<script setup lang="ts">
import { computed, defineEmits, defineProps, h } from 'vue';
import {
  hFor,
  hIf,
  serializeWeeknumbersOptions,
  useCommons,
  useSlots,
} from '@/composables';
import type { Day, WeeknumbersVisibility } from '@/composables';

export interface CalendarPageOptions {
  days: Day[];
  showWeeknumbers?: boolean | WeeknumbersVisibility;
  showIsoWeeknumbers?: boolean | WeeknumbersVisibility;
}

defineProps<CalendarPageOptions>();
defineEmits(['weeknumberclick']);
const { callSlot } = useSlots();

// get the weekday labels based on locale
const { locale, masks } = useCommons();
const weekdayLabels = computed(() => {
  return locale
    .getWeekdayDates()
    .map(date => locale.format(date, masks.weekdays));
});
</script>

<script>
export default {
  render() {
    const daysInWeek = locale.daysInWeek;
    const weeknumbers = this.showWeeknumbers ?? this.showIsoWeeknumbers;
    const weeknumbersKey = this.showWeeknumbers
      ? 'weeknumber'
      : 'isoWeeknumber';

    // make easier to use the `showWeeknumbers` prop
    const opts = serializeWeeknumbersOptions(weeknumbers);
    const showLeft = opts.show && opts.left;
    const showRight = opts.show && !opts.left;

    // class applied to the week number cells
    const weeknumberCls =
      'is-' + //
      (opts.left ? 'left' : 'right') +
      (opts.inside ? '' : '-outside');

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

    // class applied to the weeks container
    const weekCls = opts.show
      ? ['vc-weeks', 'vc-show-weeknumbers', opts.left ? 'is-left' : 'is-right']
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
