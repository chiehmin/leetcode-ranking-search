function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import { RX_NUMBER } from '../constants/regex';
import { File } from '../constants/safe-types'; // --- Convenience inspection utilities ---

export var toType = function toType(value) {
  return _typeof(value);
};
export var toRawType = function toRawType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
};
export var toRawTypeLC = function toRawTypeLC(value) {
  return toRawType(value).toLowerCase();
};
export var isUndefined = function isUndefined(value) {
  return value === undefined;
};
export var isNull = function isNull(value) {
  return value === null;
};
export var isEmptyString = function isEmptyString(value) {
  return value === '';
};
export var isUndefinedOrNull = function isUndefinedOrNull(value) {
  return isUndefined(value) || isNull(value);
};
export var isUndefinedOrNullOrEmpty = function isUndefinedOrNullOrEmpty(value) {
  return isUndefinedOrNull(value) || isEmptyString(value);
};
export var isFunction = function isFunction(value) {
  return toType(value) === 'function';
};
export var isBoolean = function isBoolean(value) {
  return toType(value) === 'boolean';
};
export var isString = function isString(value) {
  return toType(value) === 'string';
};
export var isNumber = function isNumber(value) {
  return toType(value) === 'number';
};
export var isNumeric = function isNumeric(value) {
  return RX_NUMBER.test(String(value));
};
export var isPrimitive = function isPrimitive(value) {
  return isBoolean(value) || isString(value) || isNumber(value);
};
export var isArray = function isArray(value) {
  return Array.isArray(value);
}; // Quick object check
// This is primarily used to tell Objects from primitive values
// when we know the value is a JSON-compliant type
// Note object could be a complex type like array, Date, etc.

export var isObject = function isObject(obj) {
  return obj !== null && _typeof(obj) === 'object';
}; // Strict object type check
// Only returns true for plain JavaScript objects

export var isPlainObject = function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
export var isDate = function isDate(value) {
  return value instanceof Date;
};
export var isEvent = function isEvent(value) {
  return value instanceof Event;
};
export var isFile = function isFile(value) {
  return value instanceof File;
};
export var isRegExp = function isRegExp(value) {
  return toRawType(value) === 'RegExp';
};
export var isPromise = function isPromise(value) {
  return !isUndefinedOrNull(value) && isFunction(value.then) && isFunction(value.catch);
};