function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// Date utility functions
import { CALENDAR_GREGORY } from '../constants/date';
import { RX_DATE, RX_DATE_SPLIT } from '../constants/regex';
import { concat } from './array';
import { identity } from './identity';
import { isDate, isString } from './inspect';
import { toInteger } from './number'; // --- Date utility methods ---
// Create or clone a date (`new Date(...)` shortcut)

export var createDate = function createDate() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _construct(Date, args);
}; // Parse a date sting, or Date object, into a Date object (with no time information)

export var parseYMD = function parseYMD(date) {
  if (isString(date) && RX_DATE.test(date.trim())) {
    var _date$split$map = date.split(RX_DATE_SPLIT).map(function (v) {
      return toInteger(v, 1);
    }),
        _date$split$map2 = _slicedToArray(_date$split$map, 3),
        year = _date$split$map2[0],
        month = _date$split$map2[1],
        day = _date$split$map2[2];

    return createDate(year, month - 1, day);
  } else if (isDate(date)) {
    return createDate(date.getFullYear(), date.getMonth(), date.getDate());
  }

  return null;
}; // Format a date object as `YYYY-MM-DD` format

export var formatYMD = function formatYMD(date) {
  date = parseYMD(date);

  if (!date) {
    return null;
  }

  var year = date.getFullYear();
  var month = "0".concat(date.getMonth() + 1).slice(-2);
  var day = "0".concat(date.getDate()).slice(-2);
  return "".concat(year, "-").concat(month, "-").concat(day);
}; // Given a locale (or locales), resolve the browser available locale

export var resolveLocale = function resolveLocale(locales)
/* istanbul ignore next */
{
  var calendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : CALENDAR_GREGORY;
  locales = concat(locales).filter(identity);
  var fmt = new Intl.DateTimeFormat(locales, {
    calendar: calendar
  });
  return fmt.resolvedOptions().locale;
}; // Create a `Intl.DateTimeFormat` formatter function

export var createDateFormatter = function createDateFormatter(locale, options)
/* istanbul ignore next */
{
  var dtf = new Intl.DateTimeFormat(locale, options);
  return dtf.format;
}; // Determine if two dates are the same date (ignoring time portion)

export var datesEqual = function datesEqual(date1, date2) {
  // Returns true of the date portion of two date objects are equal
  // We don't compare the time portion
  return formatYMD(date1) === formatYMD(date2);
}; // --- Date "math" utility methods (for BCalendar component mainly) ---

export var firstDateOfMonth = function firstDateOfMonth(date) {
  date = createDate(date);
  date.setDate(1);
  return date;
};
export var lastDateOfMonth = function lastDateOfMonth(date) {
  date = createDate(date);
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  return date;
};
export var addYears = function addYears(date, numberOfYears) {
  date = createDate(date);
  var month = date.getMonth();
  date.setFullYear(date.getFullYear() + numberOfYears); // Handle Feb 29th for leap years

  if (date.getMonth() !== month) {
    date.setDate(0);
  }

  return date;
};
export var oneMonthAgo = function oneMonthAgo(date) {
  date = createDate(date);
  var month = date.getMonth();
  date.setMonth(month - 1); // Handle when days in month are different

  if (date.getMonth() === month) {
    date.setDate(0);
  }

  return date;
};
export var oneMonthAhead = function oneMonthAhead(date) {
  date = createDate(date);
  var month = date.getMonth();
  date.setMonth(month + 1); // Handle when days in month are different

  if (date.getMonth() === (month + 2) % 12) {
    date.setDate(0);
  }

  return date;
};
export var oneYearAgo = function oneYearAgo(date) {
  return addYears(date, -1);
};
export var oneYearAhead = function oneYearAhead(date) {
  return addYears(date, 1);
};
export var oneDecadeAgo = function oneDecadeAgo(date) {
  return addYears(date, -10);
};
export var oneDecadeAhead = function oneDecadeAhead(date) {
  return addYears(date, 10);
}; // Helper function to constrain a date between two values
// Always returns a `Date` object or `null` if no date passed

export var constrainDate = function constrainDate(date) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  // Ensure values are `Date` objects (or `null`)
  date = parseYMD(date);
  min = parseYMD(min) || date;
  max = parseYMD(max) || date; // Return a new `Date` object (or `null`)

  return date ? date < min ? min : date > max ? max : date : null;
};