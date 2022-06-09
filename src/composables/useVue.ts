/* eslint-disable @typescript-eslint/no-explicit-any */
import { h, isRef, Ref, ref, UnwrapRef, useSlots as baseUseSlots } from 'vue';

/**
 * Emulates a `v-if`
 */
export function hIf(cond: unknown, ...args: any) {
  if (cond) {
    // @ts-expect-error un-orthodox call
    return h(...args);
  }
  return undefined;
}

/**
 * Emulates a `v-for`
 */
export function hFor<T, R>(
  arr: T[] | Ref<T[]>,
  cb: (value: T, index: number, array: T[]) => R,
): R[] {
  if (isRef(arr) && Array.isArray(arr.value)) {
    return arr.value.map(cb);
  }

  if (Array.isArray(arr)) {
    return arr.map(cb);
  }

  return [];
}

/**
 * Make easier to use the slots on a component
 */
export function useSlots() {
  const slots = baseUseSlots();

  const hasSlot = (name: string) => {
    return typeof slots[name] === 'function';
  };

  const callSlot = (name: string, args?: any, fallback?: any) => {
    return hasSlot(name) ? slots[name]?.(args) : fallback;
  };

  const createSlot = (name: string, args?: any, fallback?: any) => {
    if (hasSlot(name)) {
      return () => slots[name]?.(args);
    }
    return () => fallback;
  };

  return {
    slots,
    hasSlot,
    callSlot,
    createSlot,
  };
}

/**
 * Generates a reactive value and a setter function
 * that uses the handler if is defined
 */
export function useRef<T>(
  initial: T,
  handler?: (newValue: T, oldValue: T) => T,
) {
  const currentValue = ref<T>(initial);
  return [
    currentValue,
    (newValue?: T) => {
      currentValue.value = (
        handler ? handler(newValue as T, currentValue.value as T) : newValue
      ) as UnwrapRef<T>;
    },
  ] as [Ref<T>, (newValue?: T) => void];
}
