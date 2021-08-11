import { isFunction } from './inspect'; // --- Static ---

export var from = function from() {
  return Array.from.apply(Array, arguments);
}; // --- Instance ---

export var arrayIncludes = function arrayIncludes(array, value) {
  return array.indexOf(value) !== -1;
};
export var concat = function concat() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return Array.prototype.concat.apply([], args);
}; // --- Utilities ---

export var createArray = function createArray(length, fillFn) {
  var mapFn = isFunction(fillFn) ? fillFn : function () {
    return fillFn;
  };
  return Array.apply(null, {
    length: length
  }).map(mapFn);
};
export var flatten = function flatten(array) {
  return array.reduce(function (result, item) {
    return concat(result, item);
  }, []);
};
export var flattenDeep = function flattenDeep(array) {
  return array.reduce(function (result, item) {
    return concat(result, Array.isArray(item) ? flattenDeep(item) : item);
  }, []);
};