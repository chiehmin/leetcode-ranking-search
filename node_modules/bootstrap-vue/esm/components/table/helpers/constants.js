function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Constants used by table helpers
export var FIELD_KEY_CELL_VARIANT = '_cellVariants';
export var FIELD_KEY_ROW_VARIANT = '_rowVariant';
export var FIELD_KEY_SHOW_DETAILS = '_showDetails'; // Object of item keys that should be ignored for headers and
// stringification and filter events

export var IGNORED_FIELD_KEYS = [FIELD_KEY_CELL_VARIANT, FIELD_KEY_ROW_VARIANT, FIELD_KEY_SHOW_DETAILS].reduce(function (result, key) {
  return _objectSpread(_objectSpread({}, result), {}, _defineProperty({}, key, true));
}, {}); // Filter CSS selector for click/dblclick/etc. events
// If any of these selectors match the clicked element, we ignore the event

export var EVENT_FILTER = ['a', 'a *', // Include content inside links
'button', 'button *', // Include content inside buttons
'input:not(.disabled):not([disabled])', 'select:not(.disabled):not([disabled])', 'textarea:not(.disabled):not([disabled])', '[role="link"]', '[role="link"] *', '[role="button"]', '[role="button"] *', '[tabindex]:not(.disabled):not([disabled])'].join(',');