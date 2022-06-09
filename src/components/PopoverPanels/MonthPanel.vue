<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useActivePanel, useMonthsFilter } from '../../composables/usePanel';
import { useRef, useSlots } from '../../composables/useVue';
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

// handle year of the active panel
const [yearIndex, changePanel] = useRef(year.value, (n, o) => o + n);
const [focusFirstItem, focusFirst] = useRef(false, n => n ?? false);

// react to parent updates
onMounted(() => focusFirst(true));
watch(props.modelValue, n => {
  yearIndex.value = n.year;
  focusFirst(true);
});

// filters
const getMonthItems = useMonthsFilter(year, month, props.validator);

// handle the active panel state
const {
  activeItems, //
  hasPrevPanel,
  hasNextPanel,
} = useActivePanel(yearIndex, getMonthItems);

// handle when a month is selected
const handleInput = (value: PanelValue) => {
  if (props.validator(value)) {
    emit('update:modelValue', value);
    focusFirst(true);
  }
};

defineExpose({
  createSlot,
  yearIndex,
  activeItems,
  hasPrevPanel,
  hasNextPanel,
  focusFirstItem,
  events: { input: handleInput, focused: focusFirst, panelchange: changePanel },
});
</script>

<script lang="ts">
import { h } from 'vue';
import PopoverPanel from './PopoverPanel.vue';

export default {
  render() {
    return h(
      PopoverPanel,
      {
        items: this.activeItems,
        enablePrev: this.hasPrevPanel,
        enableNext: this.hasNextPanel,
        focusFirstItem: this.focusFirstItem,
        on: this.events,
      },
      {
        ...this.$slots,
        'nav-title': this.createSlot(
          'month-panel-title',
          { items: this.activeItems, year: this.yearIndex },
          this.yearIndex,
        ),
      },
    );
  },
};
</script>
