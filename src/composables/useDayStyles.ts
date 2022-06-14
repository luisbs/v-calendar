import type { Day, DayAttribute, SelectionStyle } from '~/data';
import type { PopoverEventsOptions } from '~/options';

type AttrInfo = Record<'isDate' | 'isComplex' | 'onStart' | 'onEnd', boolean>;

interface ElementStyle {
  key: string;
  wrapperClass?: string;
  class: string | string[];
  style: string;
}

function appendPopoverEvents(
  attribute: DayAttribute,
  events: Partial<PopoverEventsOptions>[],
) {
  const { key, customData, popover } = attribute;
  if (!popover) return;

  const params = [
    {
      key,
      attribute,
      // TODO: Check this parameter
      // ? Should't be named data instead?
      customData,
    },
    popover,
    {
      placement: 'bottom',
      visibility: popover.label ? 'hover' : 'click',
      isInteractive: !popover.label,
    },
  ];

  events.unshift(
    params.reduce(
      (prev, current) => ({ ...current, ...prev }),
      {} as Partial<PopoverEventsOptions>,
    ),
  );
}

function appendContentStyles(
  { key, highlight }: DayAttribute,
  { isDate, isComplex, onStart, onEnd }: AttrInfo,
  styles: ElementStyle[],
) {
  if (!highlight) return;
  const { base, start, end } = highlight;

  if (isDate || isComplex || onStart) {
    styles.push({
      key: `${key}-content`,
      class: start.contentClass,
      style: start.contentStyle,
    });
  } else if (onEnd) {
    styles.push({
      key: `${key}-content`,
      class: end.contentClass,
      style: end.contentStyle,
    });
  } else {
    styles.push({
      key: `${key}-content`,
      class: base.contentClass,
      style: base.contentStyle,
    });
  }
}

function appendBackgroundStyles(
  { key, highlight }: DayAttribute,
  { isDate, isComplex, onStart, onEnd }: AttrInfo,
  styles: ElementStyle[],
) {
  if (!highlight) return;
  const { base, start, end } = highlight;

  if (isDate || isComplex || (onStart && onEnd)) {
    styles.push({
      key,
      wrapperClass: 'vc-day-layer vc-day-box-center-center',
      class: ['vc-highlight', start.class],
      style: start.style,
    });
  } else if (onStart) {
    styles.push({
      key,
      wrapperClass: 'vc-day-layer vc-day-box-right-center',
      class: ['vc-highlight vc-highlight-base-start', base.class],
      style: base.style,
    });
    styles.push({
      key,
      wrapperClass: 'vc-day-layer vc-day-box-center-center',
      class: ['vc-highlight', start.class],
      style: start.style,
    });
  } else if (onEnd) {
    styles.push({
      key: `${key}-base`,
      wrapperClass: 'vc-day-layer vc-day-box-left-center',
      class: ['vc-highlight vc-highlight-base-end', base.class],
      style: base.style,
    });
    styles.push({
      key,
      wrapperClass: 'vc-day-layer vc-day-box-center-center',
      class: ['vc-highlight', end.class],
      style: end.style,
    });
  } else {
    styles.push({
      key: `${key}-middle`,
      wrapperClass: 'vc-day-layer vc-day-box-center-center',
      class: ['vc-highlight vc-highlight-base-middle', base.class],
      style: base.style,
    });
  }
}

function appendStyles(
  attr: DayAttribute,
  item: 'content' | 'dot' | 'bar',
  { isDate, onStart, onEnd }: AttrInfo,
  styles: ElementStyle[],
) {
  if (!attr[item]) return;
  const { key } = attr;
  const className = `vc-${item}`;
  const { base, start, end } = attr[item] as SelectionStyle;

  if (isDate || onStart) {
    styles.push({
      key,
      class: [className, start.class],
      style: start.style,
    });
  } else if (onEnd) {
    styles.push({
      key,
      class: [className, end.class],
      style: end.style,
    });
  } else {
    styles.push({
      key,
      class: [className, base.class],
      style: base.style,
    });
  }
}

export function serializeDayStyles(day: Day) {
  const options = {
    popovers: [] as Partial<PopoverEventsOptions>[],
    backgrounds: [] as ElementStyle[],
    content: [] as ElementStyle[],
    dots: [] as ElementStyle[],
    bars: [] as ElementStyle[],
  };

  day.attributes.forEach(attr => {
    const { isDate, isComplex, startTime, endTime } = attr.targetDate;
    const info: AttrInfo = {
      isDate,
      isComplex,
      onStart: day.range.start <= startTime,
      onEnd: day.range.end >= endTime,
    };

    // append styles
    appendBackgroundStyles(attr, info, options.backgrounds);
    appendContentStyles(attr, info, options.content);
    appendStyles(attr, 'content', info, options.content);
    appendStyles(attr, 'dot', info, options.dots);
    appendStyles(attr, 'bar', info, options.bars);

    // append events
    appendPopoverEvents(attr, options.popovers);
  });

  return options;
}
