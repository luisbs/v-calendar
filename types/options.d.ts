import { Day, MonthPage, PanelValue } from './data';

export { PanelValue };

export type PopoverVisibility = 'click' | 'hover' | 'hover-focus' | 'focus';

export type PopoverPosition =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end';

export type WeeknumbersVisibility =
  | 'left'
  | 'left-outside'
  | 'right'
  | 'right-outside';

export interface CalendarPanelOptions {
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

export interface WeeknumbersOptions {
  /** Defines if the weeknumbers should be showned */
  side: false | 'left' | 'right';
  /** Defines if the weeknumbers should be showned outside */
  outside: boolean;
  /** Defines if the ISO weeknumbers should be used */
  iso: boolean;
}

export interface CalendarPanelWeeksOptions {
  days: Day[];
  weeknumbers: WeeknumbersOptions;
}

export interface PopoverPanelOptions {
  /**
   * Items to show on the panel
   */
  items: PanelItem[];
  /**
   * Enable the previous panel button
   */
  enablePrev?: boolean;
  /**
   * Enable the next panel button
   */
  enableNext?: boolean;
  /**
   * When is set to `true` the first item will be focused,
   * then this component will set the prop back to `false`
   *
   * @example
   * ```vue
   * <PopoverPanel v-model:focusFirst="value" />
   * ```
   */
  focusFirst?: boolean;
}

export interface InputPanelOptions {
  modelValue: PanelValue;
  validator?: (value: PanelValue) => boolean;
}
