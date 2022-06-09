/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, toRef } from 'vue';
import type { SharedState } from '~/data';

type SimpleMasks =
  | 'model'
  | 'iso'
  | 'L'
  | 'title'
  | 'weekdays'
  | 'navMonths'
  | 'dayPopover';

export function useCommons() {
  const state = inject('sharedState') as SharedState;
  const navPopoverId = toRef(state, 'navPopoverId');
  const dayPopoverId = toRef(state, 'dayPopoverId');

  const format = (date: Date, mask: SimpleMasks) => {
    return state.locale.format(date, state.masks[mask]);
  };

  const pageFromDate = (date: Date) => {
    return state.locale.getDateParts(state.locale.normalizeDate(date));
  };

  return {
    ...state,
    navPopoverId,
    dayPopoverId,

    format,
    pageFromDate,
  };
}

export function serializeListeners(...sources: any[]) {
  return sources.reduce((result, source) => {
    for (const [k, cb] of Object.entries(source)) {
      // serialize the listener name
      const key = k.startsWith('on')
        ? k
        : 'on' + (k.at(0)?.toUpperCase() || '') + k.substring(1);

      // ensure the listener is an array
      if (!Array.isArray(result)) result[key] = [];

      // append the listener
      result[key].push(cb);
    }

    return result;
  }, {}) as Record<string, EventListener[]>;
}
