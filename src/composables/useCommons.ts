import { inject } from 'vue';
import type { SharedState } from '~/data';

export function useCommons() {
  const state = inject('sharedState') as SharedState;

  const pageFromDate = (date: Date) => {
    return state.locale.getDateParts(state.locale.normalizeDate(date));
  };

  return { ...state, pageFromDate };
}
