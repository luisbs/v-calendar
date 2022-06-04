export interface Day {
  id: string;
  date: Date;
  range: Record<'start' | 'end', Date>;
  label: string;
  ariaLabel: string;

  year: number;
  month: number;
  day: number;
  dayFromEnd: number;

  week: number;
  weekFromEnd: number;
  weeknumber: number;
  isoWeeknumber: number;

  weekday: number;
  weekdayPosition: number;
  weekdayPositionFromEnd: number;
  weekdayOrdinal: number;
  weekdayOrdinalFromEnd: number;

  inMonth: boolean;
  inPrevMonth: boolean;
  inNextMonth: boolean;

  onTop: boolean;
  onLeft: boolean;
  onRight: boolean;
  onBottom: boolean;

  isToday: boolean;
  isDisabled: boolean;
  isFocusable: boolean;
  isFirstDay: boolean;
  isLastDay: boolean;

  shouldRefresh: boolean;

  attributes: unknown[];
  attributesMap: Record<string, unknown>;
  classes: Array<string | Record<string, boolean>>;
}

export interface Month {
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

export interface MonthPage {
  key: string;
  year: number;
  month: number;
  weeks: number;

  days: Day[];
  monthComps: Month;
  prevMonthComps: Month;
  nextMonthComps: Month;

  title: string;
  yearLabel: string;
  monthLabel: string;
  shortYearLabel: string;
  shortMonthLabel: string;
}

export interface StateLocale {
  daysInWeek: number;

  format: (date: Date, mask: string) => string;
  normalizeDate: (date: Date) => Date;
  getDateParts: (date: Date) => MonthPage;
  getMonthDates: () => Date[];
  getWeekdayDates: () => Date[];
}

export interface SharedState {
  masks: Record<'weekdays' | 'navMonths', string>;
  theme: string;
  locale: StateLocale;
  navPopoverId: string;
  dayPopoverId: string;
}

export type PanelValue = Record<'year' | 'month', number>;

export interface PanelItem {
  id: string;
  value: PanelValue;
  label: string;
  ariaLabel?: string;

  isActive?: boolean;
  isCurrent?: boolean;
  isEnabled?: boolean;
}
