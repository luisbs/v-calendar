/* eslint-disable @typescript-eslint/no-explicit-any */

import { Plugin, DefineComponent } from 'vue';
import {
  CalendarPanelOptions,
  InputPanelOptions,
  PopoverPanelOptions,
} from './options';

declare const VCalendarLibrary: Exclude<Plugin['install'], undefined>;
export default VCalendarLibrary;

export const Calendar: DefineComponent<any>;

export const Popover: DefineComponent<any>;

export const PopoverRow: DefineComponent<any>;

export const DatePicker: DefineComponent<any>;

export const CalendarPanel: DefineComponent<CalendarPanelOptions>;

export const PopoverPanel: DefineComponent<PopoverPanelOptions>;

export const MonthPanel: DefineComponent<InputPanelOptions>;

export const MonthYearPanel: DefineComponent<InputPanelOptions>;

export const YearPanel: DefineComponent<InputPanelOptions>;
