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
