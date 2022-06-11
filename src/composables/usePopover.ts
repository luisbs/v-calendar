import { ref } from 'vue';
import { elementContains } from '../utils/helpers';
import type { PopoverEventsOptions } from '~/options';

function dispatchEvent(name: string, options: CustomEventInit) {
  document?.dispatchEvent(new CustomEvent(name, options));
}

export function usePopover(defaults: Partial<PopoverEventsOptions>) {
  // merge Popover Options
  function prepareOptions(opts: Partial<PopoverEventsOptions>) {
    const options = { ...defaults, ...opts };
    const { visibility } = options;

    const useClick = visibility === 'click';
    const useHover = visibility === 'hover' || visibility === 'hover-focus';
    const useFocus = visibility === 'focus' || visibility === 'hover-focus';

    options.autoHide = !useClick;

    return { options: ref(options), useClick, useHover, useFocus };
  }

  // initialize Popover Events
  return (opts: Partial<PopoverEventsOptions>) => {
    const { options, useClick, useHover, useFocus } = prepareOptions(opts);

    let lastItem = '';
    let hovered = false;
    let focused = false;

    const preparePopover = (
      target: EventTarget | null,
      forceUpdate = false,
    ) => {
      const current = (target as HTMLElement)?.dataset.popover || '';
      const sameItem = lastItem === current;
      lastItem = current;

      options.value.data.popover = current;
      options.value.ref = target;

      if (!forceUpdate || sameItem) return;

      dispatchEvent('hide-popover', { detail: options.value });
    };

    return {
      onClick(ev: MouseEvent) {
        if (useClick) {
          preparePopover(ev.target, true);
          dispatchEvent('toggle-popover', { detail: options.value });
          ev.stopPropagation();
        }
      },

      onMousemove(ev: MouseEvent) {
        if (useHover && !hovered) {
          hovered = true;
          preparePopover(ev.currentTarget);
          dispatchEvent('show-popover', { detail: options.value });
        }
      },
      onMouseleave(ev: MouseEvent) {
        if (useHover && hovered) {
          hovered = false;
          if (!useFocus || !focused) {
            preparePopover(ev.target);
            dispatchEvent('hide-popover', { detail: options.value });
          }
        }
      },

      onFocusin(ev: FocusEvent) {
        if (useFocus && !focused) {
          focused = true;
          preparePopover(ev.currentTarget);
          dispatchEvent('show-popover', { detail: options.value });
        }
      },
      onFocusout(ev: FocusEvent) {
        if (
          useFocus &&
          focused &&
          !elementContains(
            ev.currentTarget as Element,
            ev.relatedTarget as Element,
          )
        ) {
          focused = false;
          if (!useHover || !hovered) {
            preparePopover(ev.currentTarget);
            dispatchEvent('hide-popover', { detail: options.value });
          }
        }
      },
    };
  };
}
