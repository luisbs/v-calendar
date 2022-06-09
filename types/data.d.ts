import type { Ref } from 'vue';

export interface PanelItem {
  id: string;
  value: PanelValue;
  label: string;
  ariaLabel?: string;

  isActive?: boolean;
  isCurrent?: boolean;
  isEnabled?: boolean;
}

export type PanelValue = Record<'year' | 'month', number>;

export interface SharedState {
  navPopoverId: string;
  dayPopoverId: string;

  masks: LocaleMasks;
  theme: Theme;
  locale: Locale;
}

export interface Theme {
  color: string;
  isDark: boolean;
  highlight: SelectionStyle;
  content: SelectionStyle;
  dot: SelectionStyle;
  bar: SelectionStyle;
}

export interface Locale {
  id: 'en-US';

  daysInWeek: number;
  firstDayOfWeek: number;
  amPm: string[]; // ? ['am', 'pm'];

  dayNames: string[]; // ?        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  dayNamesShort: string[]; // ?   ['Sun',    'Mon',    'Tue',     'Wed',       'Thu',      'Fri',    'Sat'];
  dayNamesShorter: string[]; // ? ['Su',     'Mo',     'Tu',      'We',        'Th',       'Fr',     'Sa'];
  dayNamesNarrow: string[]; // ?  ['S',      'M',      'T',       'W',         'T',        'F',      'S'];

  monthNames: string[]; // ?      ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  monthNamesShort: string[]; // ? ['Jan',     'Feb',      'Mar',   'Apr',   'May', 'Jun',  'Jul',  'Aug',    'Sep',       'Oct',     'Nov',      'Dec'];

  masks: LocaleMasks;
  monthData: Record<string, Month>;

  format: (date: Date, mask: string) => string;
  normalizeDate: (date: Date) => Date;
  getDateParts: (date: Date) => MonthPage;
  getMonthDates: () => Date[];
  getWeekdayDates: () => Date[];
}

export interface LocaleMasks {
  model: string; // ?     'iso'
  iso: string; // ?       'YYYY-MM-DDTHH:mm:ss.SSSZ'
  L: string; // ?         'MM/DD/YYYY'
  title: string; // ?     'MMMM YYYY'
  weekdays: string; // ?  'W'
  navMonths: string; // ? 'MMM'
  dayPopover: string; // ? 'WWW, MMM D, YYYY';

  data: string[]; // ?              ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'];
  input: string[]; // ?             ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'];
  inputDateTime: string[]; // ?     ['L h:mm A', 'YYYY-MM-DD h:mm A', 'YYYY/MM/DD h:mm A'];
  inputDateTime24hr: string[]; // ? ['L HH:mm', 'YYYY-MM-DD HH:mm', 'YYYY/MM/DD HH:mm'];
  inputTime: string[]; // ?         ['h:mm A'];
  inputTime24hr: string[]; // ?     ['HH:mm'];
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

  attributes: DayAttribute[];
  attributesMap: Record<string, DayAttribute>;
  classes: Array<string | Record<string, boolean>>;
}

export interface DayAttribute {
  key: string;
  order: number;

  popover?: Record<string, unknown>;
  highlight?: SelectionStyle;
  content?: SelectionStyle;
  dot?: SelectionStyle;
  bar?: SelectionStyle;

  customData: unknown;
  targetDate: DayAttributeTarget;
}

export interface DayAttributeTarget {
  isDate: boolean;
  isComplex: boolean;
  startTime: Date;
  endTime: Date;
}

export type SelectionStyle = Record<'base' | 'start' | 'end', OptionStyle>;

export interface OptionStyle {
  class: string;
  style: string;

  contentClass: string;
  contentStyle: string;

  fillMode?: 'light' | 'solid';
}
