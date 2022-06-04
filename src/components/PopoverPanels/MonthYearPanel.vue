<script setup lang="ts">
import { computed, h, onMounted, watch } from 'vue';
import {
  useActivePanel,
  useMonthsFilter,
  useYearsFilter,
} from '../../composables/usePanel';
import { useRef, useSlots } from '../../composables/useVue';
import PopoverPanel from './PopoverPanel.vue';
import type { PanelValue } from '~/options';

export interface InputPanelOptions {
  modelValue: PanelValue;
  validator?: (value: PanelValue) => boolean;
}

const { createSlot } = useSlots();
const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<InputPanelOptions>(), {
  validator: () => true,
});

const year = computed(() => props.modelValue.year || 0);
const month = computed(() => props.modelValue.month || 0);

// control the active panel
const [focused, focusFirst] = useRef(false);
const [monthMode, toggleMode] = useRef(true, (_, o) => !o);
const [yearIndex, changePanel] = useRef(year.value, (n, o) => o + n);

// react to parent updates
onMounted(() => focusFirst(true));
watch(props.modelValue, n => {
  yearIndex.value = n.year;
  focusFirst(true);
});

// filters
const getYearItems = useYearsFilter(year, month, props.validator);
const getMonthItems = useMonthsFilter(year, month, props.validator);

// handle the active panel state
const {
  activeItems, //
  hasPrevPanel,
  hasNextPanel,
} = useActivePanel<PanelValue | number>(yearIndex, (year: number) => {
  return monthMode.value ? getMonthItems(year) : getYearItems(year);
});

// handle when a year/month is selected
const handleInput = (value: PanelValue) => {
  if (!monthMode.value) {
    yearIndex.value = value.year;
    toggleMode();
    focusFirst(true);
    return;
  }

  if (props.validator(value)) {
    emit('update:modelValue', value);
  }
};
</script>

<script lang="ts">
export default {
  render() {
    return h(
      PopoverPanel,
      {
        items: activeItems.value,
        focusFirst: focused.value,
        enablePrev: hasPrevPanel.value,
        enableNext: hasNextPanel.value,
        on: {
          input: handleInput,
          changePanel: changePanel,
          clickTitle: toggleMode,
          'update:focusFirst': focusFirst,
        },
      },
      {
        ...this.$slots,
        'nav-title': createSlot(
          'year-panel-title',
          { year: yearIndex.value, items: activeItems.value },
          () => {
            if (monthMode.value) {
              return yearIndex.value;
            }

            const sorted = activeItems.value
              .map(item => item.value.year)
              .sort((a, b) => a - b);
            return `${sorted.at(0)} - ${sorted.at(-1)}`;
          },
        ),
      },
    );
  },
};
</script>
