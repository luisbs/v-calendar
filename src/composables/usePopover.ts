import { elementContains } from '../utils/helpers';
import type { PopoverEventsOptions } from '~/options';

function dispatchEvent(name: string, options: CustomEventInit) {
  document?.dispatchEvent(new CustomEvent(name, options));
}

export function serializePopoverEvents(opts: PopoverEventsOptions) {
  const { visibility } = opts;

  const useClick = visibility === 'click';
  const useHover = visibility === 'hover' || visibility === 'hover-focus';
  const useFocus = visibility === 'focus' || visibility === 'hover-focus';
  opts.autoHide = !useClick;

  let lastPopover = '';
  let hovered = false;
  let focused = false;

  // prepare the popover options
  const preparePopoverOptions = (
    target: EventTarget | null,
    forceUpdate = false,
  ) => {
    const popover = (target as HTMLElement)?.dataset.popover || '';
    const sameItem = lastPopover === popover;
    lastPopover = popover;

    opts.ref = target;
    opts.data = { ...opts.data, popover };

    if (!forceUpdate || sameItem) return;

    dispatchEvent('hide-popover', { detail: opts });
  };

  return {
    onClick(ev: MouseEvent) {
      if (useClick) {
        preparePopoverOptions(ev.target, true);
        dispatchEvent('toggle-popover', { detail: opts });
        ev.stopPropagation();
      }
    },

    onMousemove(ev: MouseEvent) {
      if (useHover && !hovered) {
        hovered = true;
        preparePopoverOptions(ev.currentTarget);
        dispatchEvent('show-popover', { detail: opts });
      }
    },
    onMouseleave(ev: MouseEvent) {
      if (useHover && hovered) {
        hovered = false;
        if (!useFocus || !focused) {
          preparePopoverOptions(ev.target);
          dispatchEvent('hide-popover', { detail: opts });
        }
      }
    },

    onFocusin(ev: FocusEvent) {
      if (useFocus && !focused) {
        focused = true;
        preparePopoverOptions(ev.currentTarget);
        dispatchEvent('show-popover', { detail: opts });
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
          preparePopoverOptions(ev.currentTarget);
          dispatchEvent('hide-popover', { detail: opts });
        }
      }
    },
  };
}
