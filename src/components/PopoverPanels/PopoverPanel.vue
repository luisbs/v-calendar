<script setup lang="ts">
import { defineEmits, defineProps, nextTick, ref, watch } from 'vue';
import PopoverButton from './PopoverButton.vue';
import SvgIcon from '../SvgIcon/SvgIcon.vue';
import type { PanelItem } from '~/data';

export interface PopoverPanelOptions {
  /**
   * Items to show on the panel
   */
  items: PanelItem[];
  /**
   * Enable the previous panel button
   */
  enablePrev?: boolean;
  /**
   * Enable the next panel button
   */
  enableNext?: boolean;
  /**
   * When is set to `true` the first item will be focused,
   * then this component will set the prop back to `false`
   *
   * @example
   * ```vue
   * <PopoverPanel v-model:focusFirst="value" />
   * ```
   */
  focusFirst?: boolean;
}

const emit = defineEmits([
  'input',
  'changePanel',
  'clickTitle',
  'update:focusFirst',
]);
const props = defineProps<PopoverPanelOptions>();

const navContainer = ref<HTMLDivElement | null>(null);

// when `focusFirst` is set to `true`
// focus the first item and reset to `false`
watch(props, async n => {
  if (n.focusFirst !== true) return;

  await nextTick();
  const el = navContainer.value //
    ?.querySelector<HTMLElement>('.vc-nav-item:not(.is-disabled)');
  el?.focus?.();

  emit('update:focusFirst', false);
});

// bubbles the click on prev\next buttons to the parent
// so the parent can update the list of items
const changePanel = (count: number) => {
  if (count === 0) return;
  if (count < 0 && !props.enablePrev) return;
  if (count > 0 && !props.enableNext) return;
  emit('changePanel', count);
};
</script>

<template>
  <!-- Popover Panel -->
  <div class="vc-nav-container" ref="navContainer">
    <!-- Panel Header -->
    <div class="vc-nav-header">
      <!-- Panel Prev Button -->
      <PopoverButton
        class="vc-nav-arrow is-left"
        :enabled="props.enablePrev"
        @push="() => changePanel(-1)"
      >
        <slot name="nav-left-button">
          <SvgIcon name="left-arrow" width="20px" height="24px" />
        </slot>
      </PopoverButton>

      <!-- Panel Title -->
      <PopoverButton
        class="vc-nav-title vc-grid-focus"
        style="white-space: 'nowrap'"
        @push="ev => emit('clickTitle', ev)"
      >
        <slot name="nav-title" />
      </PopoverButton>

      <!-- Panel Next Button -->
      <PopoverButton
        class="vc-nav-arrow is-right"
        :enabled="props.enableNext"
        @push="() => changePanel(+1)"
      >
        <slot name="nav-right-button">
          <SvgIcon name="right-arrow" width="20px" height="24px" />
        </slot>
      </PopoverButton>
    </div>

    <!-- Panel Items -->
    <div class="vc-nav-items">
      <slot name="nav-items" v-bind="{ items }">
        <PopoverButton
          v-for="item in items"
          :key="item.id"
          class="vc-nav-item"
          :class="[
            item.isActive && 'is-active',
            item.isCurrent && 'is-current',
          ]"
          :enabled="item.isEnabled"
          :aria-label="item.ariaLabel"
          @push="() => emit('input', item.value)"
        >
          {{ item.label }}
        </PopoverButton>
      </slot>
    </div>
  </div>
</template>
