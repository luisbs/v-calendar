import { Ref, ref, UnwrapRef, useSlots as baseUseSlots } from 'vue';

export function useSlots() {
  const slots = baseUseSlots();

  // eslint-disable-next-line
  const callSlot = (name: string, args?: any, fallback?: any) => {
    return typeof slots[name] === 'function' ? slots[name]?.(args) : fallback;
  };

  // eslint-disable-next-line
  const createSlot = (name: string, args?: any, fallback?: any) => {
    if (typeof slots[name] === 'function') {
      return () => slots[name]?.(args);
    }
    return () => fallback;
  };

  return {
    slots,
    callSlot,
    createSlot,
  };
}

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
