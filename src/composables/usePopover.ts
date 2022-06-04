import { elementContains } from '../utils/helpers';
import { PopoverPosition, PopoverVisibility } from '#/options';

function dispatchEvent(name: string, options: CustomEventInit) {
  document?.dispatchEvent(new CustomEvent(name, options));
}

export interface PopoverEventsOptions {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  placement: PopoverPosition;
  visibility: PopoverVisibility;

  ref?: EventTarget | null;
  autoHide?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modifiers: Array<{ name: string; options: any }>;

  /** TODO: no se para que funciona esto */
  isInteractive?: boolean;
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
