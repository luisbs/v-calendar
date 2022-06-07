<script lang="ts">
import { computed, defineComponent, h, PropType } from 'vue';
import { useCommons } from '../../composables/useCommons';
import { hFor, hIf, useSlots } from '../../composables/useVue';
import type { Day } from '~/data';

interface WeeknumberOptions {
  /** Defines if the weeknumbers should be showned */
  side: false | 'left' | 'right';
  /** Defines if the weeknumbers should be showned outside */
  outside: boolean;
  /** Defines if the ISO weeknumbers should be used */
  iso: boolean;
}

export default defineComponent({
  emits: ['weeknumberclick'],
  props: {
    days: { type: Array as PropType<Day[]>, required: true },
    weeknumbers: {
      type: Object as PropType<WeeknumberOptions>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { callSlot } = useSlots();
    const { locale, masks } = useCommons();

    const daysInWeek = computed(() => locale.daysInWeek);
    const weeknumbersKey = computed(() => {
      return props.weeknumbers.iso ? 'isoWeeknumber' : 'weeknumber';
    });

    // get the weekday labels based on locale
    const weekdayLabels = computed(() => {
      return locale
        .getWeekdayDates()
        .map(date => locale.format(date, masks.weekdays));
    });

    // emit weeknumber click
    const onClick = (weeknumber: number, ev: MouseEvent) => {
      const days = props.days.filter(day => {
        return day[weeknumbersKey.value] === weeknumber;
      });
      emit('weeknumberclick', { weeknumber, days }, ev);
    };

    return { callSlot, daysInWeek, onClick, weekdayLabels, weeknumbersKey };
  },
  render() {
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
          onClick: (ev: MouseEvent) => this.onClick(weeknumber, ev),
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
      // ...hFor(weekdayLabels, key => {
      ...hFor(this.weekdayLabels, key => {
        return h('div', { key, class: 'vc-weekday' }, key);
      }),
      hIf(showRight, 'div'),

      // CalendarPage Days
      ...hFor(this.days, (day, i) => {
        const mod = i % this.daysInWeek;
        return [
          // weeknumber cell on left side
          showLeft && mod === 0
            ? renderWeeknumberCell(day[this.weeknumbersKey])
            : undefined,

          // weekday
          this.callSlot('week-day', day, day.label),

          // weeknumber cell on right side
          showRight && mod === this.daysInWeek - 1
            ? renderWeeknumberCell(day[this.weeknumbersKey])
            : undefined,
        ];
      }),
    ]);
  },
});
</script>
