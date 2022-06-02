import { computed, inject } from 'vue';

export interface MonthPage {
  year: number;
  month: number;
  weeks: number;
  days: number;

  inLeapYear: boolean;
  firstWeekday: number;
  firstDayOfWeek: number;

  weeknumbers: number[];
  isoWeeknumbers: number[];
}

export interface StateLocale {
  format: (date: Date, mask: string) => string;
  normalizeDate: (date: Date) => Date;
  getDateParts: (date: Date) => MonthPage;
  getMonthDates: () => Date[];
}

export interface SharedState {
  masks: Record<'navMonths', string>;
  theme: string;
  locale: StateLocale;
  dayPopoverId: string;
}

export default function useCommons() {
  const state = inject('sharedState') as SharedState;

  const pageFromDate = (date: Date) => {
    return state.locale.getDateParts(state.locale.normalizeDate(date));
  };

  return { ...state, pageFromDate };
}
