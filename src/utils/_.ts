/* eslint-disable @typescript-eslint/no-explicit-any */

// Type utils
export { default as isBoolean } from 'lodash-es/isBoolean';
export { default as isNumber } from 'lodash-es/isNumber';
export { default as isString } from 'lodash-es/isString';
export { default as isArray } from 'lodash-es/isArrayLikeObject';
export { default as isFunction } from 'lodash-es/isFunction';
export { default as isUndefined } from 'lodash-es/isUndefined';
import _isDate from 'lodash-es/isDate';

// Number utils
export { default as clamp } from 'lodash-es/clamp';

// Object utils
export { default as get } from 'lodash-es/get';
export { default as set } from 'lodash-es/set';
export { default as mapValues } from 'lodash-es/mapValues';
export { default as toPairs } from 'lodash-es/toPairs';
export { default as defaults } from 'lodash-es/defaults';
export { default as defaultsDeep } from 'lodash-es/defaultsDeep';
export { default as pick } from 'lodash-es/pick';
export { default as omit } from 'lodash-es/omit';
import _has from 'lodash-es/has';

// Collection utils
export { default as map } from 'lodash-es/map';
export { default as head } from 'lodash-es/head';
export { default as last } from 'lodash-es/last';
import _some from 'lodash-es/some';

// Type checkers
export const getType = (value: any) =>
  Object.prototype.toString.call(value).slice(8, -1);
export const isDate = (value: any) => _isDate(value) && !isNaN(value.getTime());
export const isObject = (value: any) => getType(value) === 'Object';
// Object utils
export const has = _has;
export const hasAny = (obj: object, props: [string]) =>
  _some(props, p => _has(obj, p));
// Collection utils
export const some = _some;
