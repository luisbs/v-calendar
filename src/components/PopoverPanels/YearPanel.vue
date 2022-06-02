<script setup lang="ts">
import {
  computed,
  defineEmits,
  defineProps,
  onMounted,
  watch,
  withDefaults,
} from 'vue';
import {
  PanelValue,
  useActivePanel,
  useRef,
  useSlots,
  useYearsFilter,
} from '@/composables';

export interface YearPanelOptions {
  modelValue: PanelValue;
  validator?: (value: Record<'year' | 'month', number>) => boolean;
}

const { createSlot } = useSlots();
const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<YearPanelOptions>(), {
  validator: () => true,
});

const year = computed(() => props.modelValue.year || 0);
const month = computed(() => props.modelValue.month || 0);

// handle year of the active panel
const [focused, focusFirst] = useRef(false);
const [yearIndex, changePanel] = useRef(year.value, (n, o) => o + n);

// react to parent updates
onMounted(() => focusFirst(true));
watch(props.modelValue, n => {
  yearIndex.value = n.year;
  focusFirst(true);
});

// filters
const getYearItems = useYearsFilter(year, month, props.validator);

// handle the active panel state
const {
  activeItems, //
  hasPrevPanel,
  hasNextPanel,
} = useActivePanel(yearIndex, getYearItems);

// handle when a year is selected
const handleYearInput = (value: PanelValue) => {
  if (props.validator(value)) {
    emit('update:modelValue', value);
    focusFirst(true);
  }
};
</script>

<script>
import { h } from 'vue';
import PopoverPanel from './PopoverPanel.vue';

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
          input: handleYearInput,
          changePanel: changePanel,
          'update:focusFirst': focusFirst,
        },
      },
      {
        ...this.$slots,
        'nav-title': createSlot(
          'year-panel-title',
          { year: yearIndex.value, items: activeItems },
          () => {
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
