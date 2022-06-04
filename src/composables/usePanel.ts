import { computed, Ref } from 'vue';
import { useCommons } from './useCommons';

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

/**
 * Handle the active panel
 */
export function useActivePanel<T>(
  currentYear: Ref<number>,
  filter: (year: number) => PanelItem[],
) {
  return {
    /**
     * Items collection on the active panel
     */
    activeItems: computed(() => filter(currentYear.value)),
    /**
     * Found valid values on the previous panel
     */
    hasPrevPanel: computed(() => {
      return filter(currentYear.value - 1).some(i => i.isEnabled);
    }),
    /**
     * Found valid values on the next panel
     */
    hasNextPanel: computed(() => {
      return filter(currentYear.value + 1).some(i => i.isEnabled);
    }),
  };
}

/**
 * Get a function to filter years
 */
export function useYearsFilter(
  yearRef: Ref<number>,
  monthRef: Ref<number>,
  validator: (value: PanelValue) => boolean,
  groupCount = 12,
) {
  const { pageFromDate } = useCommons();
  return (year: number) => {
    const now = pageFromDate(new Date());

    const first = year * groupCount;
    const last = first + groupCount;

    const items = [] as PanelItem[];
    for (let year = first; year < last; year++) {
      let enabled = false;

      for (let month = 1; month < 12; month++) {
        enabled = validator({ year, month });
        if (enabled) break;
      }

      const str = year.toString();
      items.push({
        id: str,
        label: str,
        ariaLabel: str,

        value: { year, month: monthRef.value },
        isActive: year === yearRef.value,
        isCurrent: year === now.year,
        isEnabled: enabled,
      });
    }

    return items;
  };
}

/**
 * Get a function to filter years/months
 */
export function useMonthsFilter(
  yearRef: Ref<number>,
  monthRef: Ref<number>,
  validator: (value: PanelValue) => boolean,
) {
  const { locale, masks, pageFromDate } = useCommons();
  return (year: number) => {
    const current = pageFromDate(new Date());

    return locale.getMonthDates().map((date, month) => {
      month++;
      return {
        id: `${year}.${month < 10 ? '0' : ''}${month}`,
        label: locale.format(date, masks.navMonths),
        ariaLabel: locale.format(date, 'MMMM YYYY'),

        value: { year, month },
        isActive: year === yearRef.value && month === monthRef.value,
        isCurrent: year === current.year && month === current.month,
        isEnabled: validator({ year, month }),
      } as PanelItem;
    });
  };
}
