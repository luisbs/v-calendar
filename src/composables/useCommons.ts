import { inject } from 'vue';
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

  const pageFromDate = (date: Date) => {
    return state.locale.getDateParts(state.locale.normalizeDate(date));
  };

  const format = (date: Date, mask: SimpleMasks) => {
    return state.locale.format(date, state.masks[mask]);
  };

  return { ...state, format, pageFromDate };
}
