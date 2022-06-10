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

  let lastItem = '';
  let hovered = false;
  let focused = false;

  const preparePopover = (target: EventTarget | null, forceUpdate = false) => {
    const current = (target as HTMLElement)?.dataset.popover || '';
    const sameItem = lastItem === current;
    opts.data.popover = lastItem = current;
    opts.ref = target;

    if (forceUpdate && !sameItem) {
      dispatchEvent('hide-popover', { detail: opts });
      return;
    }
  };

  return {
    onClick(ev: MouseEvent) {
      if (useClick) {
        preparePopover(ev.target, true);
        dispatchEvent('toggle-popover', { detail: opts });
        ev.stopPropagation();
      }
    },

    onMousemove(ev: MouseEvent) {
      if (useHover && !hovered) {
        hovered = true;
        preparePopover(ev.currentTarget);
        dispatchEvent('show-popover', { detail: opts });
      }
    },
    onMouseleave(ev: MouseEvent) {
      if (useHover && hovered) {
        hovered = false;
        if (!useFocus || !focused) {
          preparePopover(ev.target);
          dispatchEvent('hide-popover', { detail: opts });
        }
      }
    },

    onFocusin(ev: FocusEvent) {
      if (useFocus && !focused) {
        focused = true;
        preparePopover(ev.currentTarget);
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
          preparePopover(ev.currentTarget);
          dispatchEvent('hide-popover', { detail: opts });
        }
      }
    },
  };
}
