// String utilities
import { RX_HYPHENATE, RX_LOWER_UPPER, RX_REGEXP_REPLACE, RX_START_SPACE_WORD, RX_TRIM_LEFT, RX_TRIM_RIGHT, RX_UNDERSCORE, RX_UN_KEBAB } from '../constants/regex';
import { isArray, isPlainObject, isString, isUndefinedOrNull } from './inspect'; // --- Utilities ---
// Converts PascalCase or camelCase to kebab-case

export var kebabCase = function kebabCase(str) {
  return str.replace(RX_HYPHENATE, '-$1').toLowerCase();
}; // Converts a kebab-case or camelCase string to PascalCase

export var pascalCase = function pascalCase(str) {
  str = kebabCase(str).replace(RX_UN_KEBAB, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
  return str.charAt(0).toUpperCase() + str.slice(1);
}; // Converts a string, including strings in camelCase or snake_case, into Start Case
// It keeps original single quote and hyphen in the word
// https://github.com/UrbanCompass/to-start-case

export var startCase = function startCase(str) {
  return str.replace(RX_UNDERSCORE, ' ').replace(RX_LOWER_UPPER, function (str, $1, $2) {
    return $1 + ' ' + $2;
  }).replace(RX_START_SPACE_WORD, function (str, $1, $2) {
    return $1 + $2.toUpperCase();
  });
}; // Lowercases the first letter of a string and returns a new string

export var lowerFirst = function lowerFirst(str) {
  str = isString(str) ? str.trim() : String(str);
  return str.charAt(0).toLowerCase() + str.slice(1);
}; // Uppercases the first letter of a string and returns a new string

export var upperFirst = function upperFirst(str) {
  str = isString(str) ? str.trim() : String(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
}; // Escape characters to be used in building a regular expression

export var escapeRegExp = function escapeRegExp(str) {
  return str.replace(RX_REGEXP_REPLACE, '\\$&');
}; // Convert a value to a string that can be rendered
// `undefined`/`null` will be converted to `''`
// Plain objects and arrays will be JSON stringified

export var toString = function toString(val) {
  var spaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  return isUndefinedOrNull(val) ? '' : isArray(val) || isPlainObject(val) && val.toString === Object.prototype.toString ? JSON.stringify(val, null, spaces) : String(val);
}; // Remove leading white space from a string

export var trimLeft = function trimLeft(str) {
  return toString(str).replace(RX_TRIM_LEFT, '');
}; // Remove Trailing white space from a string

export var trimRight = function trimRight(str) {
  return toString(str).replace(RX_TRIM_RIGHT, '');
}; // Remove leading and trailing white space from a string

export var trim = function trim(str) {
  return toString(str).trim();
}; // Lower case a string

export var lowerCase = function lowerCase(str) {
  return toString(str).toLowerCase();
}; // Upper case a string

export var upperCase = function upperCase(str) {
  return toString(str).toUpperCase();
};