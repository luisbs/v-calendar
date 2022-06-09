/* eslint-disable @typescript-eslint/no-explicit-any */
import { Day, MonthPage, PanelValue } from './data';

export { MonthPage, PanelValue };

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

// * Used on: `src/composables/usePopover.ts`
export interface PopoverEventsOptions {
  id: string;
  data: any;
  placement?: PopoverPosition;
  visibility?: PopoverVisibility;

  ref?: EventTarget | null;
  autoHide?: boolean;
  modifiers?: Array<{ name: string; options: any }>;

  /** TODO: no se para que funciona esto */
  isInteractive?: boolean;
}

// * Used on: `src/components/CalendarPage/CalendarPage.vue`
export interface CalendarPageOptions {
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

// * Used on: `src/components/PopoverPanels/PopoverPanel.vue`
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

// * Used on: `src/components/PopoverPanels/MonthPanel.vue`
// * Used on: `src/components/PopoverPanels/MonthYearPanel.vue`
// * Used on: `src/components/PopoverPanels/YearPanel.vue`
export interface InputPanelOptions {
  modelValue: PanelValue;
  validator?: (value: PanelValue) => boolean;
}
