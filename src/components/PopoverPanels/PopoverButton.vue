<script setup lang="ts">
import { defineEmits, defineProps, withDefaults } from 'vue';
import { onSpaceOrEnter } from '@/utils/helpers';

export interface PopoverButtonOptions {
  enabled?: boolean;
}

const emit = defineEmits(['push']);
const props = withDefaults(defineProps<PopoverButtonOptions>(), {
  enabled: true,
});

const handler = (ev: Event) => emit('push', ev);
</script>

<template>
  <span
    role="button"
    :class="[!props.enabled && 'is-disabled']"
    :tabindex="props.enabled ? 0 : undefined"
    @click="handler"
    @keydown="ev => onSpaceOrEnter(ev, handler)"
  >
    <slot />
  </span>
</template>
