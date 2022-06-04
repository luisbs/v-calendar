import { DefineComponent } from 'vue';
import {
  CalendarPanelOptions,
  InputPanelOptions,
  PopoverPanelOptions,
} from './options';

export const CalendarPanel: DefineComponent<CalendarPanelOptions>;

export const PopoverPanel: DefineComponent<PopoverPanelOptions>;

export const MonthPanel: DefineComponent<InputPanelOptions>;

export const MonthYearPanel: DefineComponent<InputPanelOptions>;

export const YearPanel: DefineComponent<InputPanelOptions>;
