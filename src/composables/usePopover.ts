import { elementContains } from '../utils/helpers';
import type { PopoverEventsOptions } from '~/options';

function dispatchEvent(name: string, options: CustomEventInit) {
  document?.dispatchEvent(new CustomEvent(name, options));
}

export function definePopoverEvents(opts: PopoverEventsOptions) {
  const { visibility } = opts;

  const useClick = visibility === 'click';
  const useHover = visibility === 'hover' || visibility === 'hover-focus';
  const useFocus = visibility === 'focus' || visibility === 'hover-focus';
  opts.autoHide = !useClick;

  let hovered = false;
  let focused = false;

  return {
    click(ev: MouseEvent) {
      if (useClick) {
        opts.ref = ev.target;
        dispatchEvent('toggle-popover', { detail: opts });
        ev.stopPropagation();
      }
    },

    mousemove(ev: MouseEvent) {
      if (useHover && !hovered) {
        hovered = true;
        opts.ref = ev.currentTarget;
        dispatchEvent('show-popover', { detail: opts });
      }
    },
    mouseleave(ev: MouseEvent) {
      if (useHover && hovered) {
        hovered = false;
        if (!useFocus || !focused) {
          opts.ref = ev.target;
          dispatchEvent('hide-popover', { detail: opts });
        }
      }
    },

    focusin(ev: FocusEvent) {
      if (useFocus && !focused) {
        focused = true;
        opts.ref = ev.currentTarget;
        dispatchEvent('show-popover', { detail: opts });
      }
    },
    focusout(ev: FocusEvent) {
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
          opts.ref = ev.currentTarget;
          dispatchEvent('hide-popover', { detail: opts });
        }
      }
    },
  };
}
