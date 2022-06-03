export type WeeknumbersVisibility =
  | 'left'
  | 'left-outside'
  | 'right'
  | 'right-outside';

/**
 * Calculates the configuration for the side week numbers
 */
export function serializeWeeknumbersOptions(
  showNumbers?: boolean | WeeknumbersVisibility,
) {
  const opts = { show: false, left: true, inside: true };

  if (typeof showNumbers !== 'string') {
    return showNumbers === true ? { ...opts, show: true } : opts;
  }

  if (showNumbers.startsWith('right')) opts.left = false;
  if (showNumbers.endsWith('outside')) opts.inside = false;

  return opts;
}
