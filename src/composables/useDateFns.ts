import { computed } from 'vue';
import { useCommons } from './useCommons';

export function useWeekdays() {
  const { format, locale } = useCommons();

  const daysInWeek = computed(() => locale.daysInWeek);

  const weekdayLabels = computed(() => {
    return locale //
      .getWeekdayDates()
      .map(date => format(date, 'weekdays'));
  });

  return { daysInWeek, weekdayLabels };
}
