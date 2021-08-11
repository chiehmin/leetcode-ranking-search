import { get } from '../../../utils/get';
import { isDate, isFunction, isNumber, isNumeric, isUndefinedOrNull } from '../../../utils/inspect';
import { toFloat } from '../../../utils/number';
import { stringifyObjectValues } from '../../../utils/stringify-object-values';

var normalizeValue = function normalizeValue(value) {
  if (isUndefinedOrNull(value)) {
    return '';
  }

  if (isNumeric(value)) {
    return toFloat(value, value);
  }

  return value;
}; // Default sort compare routine
//
// TODO:
//   Add option to sort by multiple columns (tri-state per column,
//   plus order of columns in sort) where `sortBy` could be an array
//   of objects `[ {key: 'foo', sortDir: 'asc'}, {key:'bar', sortDir: 'desc'} ...]`
//   or an array of arrays `[ ['foo','asc'], ['bar','desc'] ]`
//   Multisort will most likely be handled in `mixin-sort.js` by
//   calling this method for each sortBy


export var defaultSortCompare = function defaultSortCompare(a, b) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$sortBy = _ref.sortBy,
      sortBy = _ref$sortBy === void 0 ? null : _ref$sortBy,
      _ref$formatter = _ref.formatter,
      formatter = _ref$formatter === void 0 ? null : _ref$formatter,
      _ref$locale = _ref.locale,
      locale = _ref$locale === void 0 ? undefined : _ref$locale,
      _ref$localeOptions = _ref.localeOptions,
      localeOptions = _ref$localeOptions === void 0 ? {} : _ref$localeOptions,
      _ref$nullLast = _ref.nullLast,
      nullLast = _ref$nullLast === void 0 ? false : _ref$nullLast;

  // Get the value by `sortBy`
  var aa = get(a, sortBy, null);
  var bb = get(b, sortBy, null); // Apply user-provided formatter

  if (isFunction(formatter)) {
    aa = formatter(aa, sortBy, a);
    bb = formatter(bb, sortBy, b);
  } // Internally normalize value
  // `null` / `undefined` => ''
  // `'0'` => `0`


  aa = normalizeValue(aa);
  bb = normalizeValue(bb);

  if (isDate(aa) && isDate(bb) || isNumber(aa) && isNumber(bb)) {
    // Special case for comparing dates and numbers
    // Internally dates are compared via their epoch number values
    return aa < bb ? -1 : aa > bb ? 1 : 0;
  } else if (nullLast && aa === '' && bb !== '') {
    // Special case when sorting `null` / `undefined` / '' last
    return 1;
  } else if (nullLast && aa !== '' && bb === '') {
    // Special case when sorting `null` / `undefined` / '' last
    return -1;
  } // Do localized string comparison


  return stringifyObjectValues(aa).localeCompare(stringifyObjectValues(bb), locale, localeOptions);
};