function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { mergeData } from '../../vue';
import { NAME_COL } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_BOOLEAN_NUMBER_STRING, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { RX_COL_CLASS } from '../../constants/regex';
import { arrayIncludes } from '../../utils/array';
import { getBreakpointsUpCached } from '../../utils/config';
import { identity } from '../../utils/identity';
import { isUndefinedOrNull } from '../../utils/inspect';
import { memoize } from '../../utils/memoize';
import { assign, create, keys, sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable, suffixPropName } from '../../utils/props';
import { lowerCase } from '../../utils/string'; // --- Constants ---

var ALIGN_SELF_VALUES = ['auto', 'start', 'end', 'center', 'baseline', 'stretch']; // --- Helper methods ---
// Compute a breakpoint class name

var computeBreakpoint = function computeBreakpoint(type, breakpoint, value) {
  var className = type;

  if (isUndefinedOrNull(value) || value === false) {
    return undefined;
  }

  if (breakpoint) {
    className += "-".concat(breakpoint);
  } // Handling the boolean style prop when accepting `[Boolean, String, Number]`
  // means Vue will not convert `<b-col sm></b-col>` to `sm: true` for us
  // Since the default is `false`, '' indicates the prop's presence


  if (type === 'col' && (value === '' || value === true)) {
    // .col-md
    return lowerCase(className);
  } // .order-md-6


  className += "-".concat(value);
  return lowerCase(className);
}; // Memoized function for better performance on generating class names


var computeBreakpointClass = memoize(computeBreakpoint); // Cached copy of the breakpoint prop names

var breakpointPropMap = create(null); // --- Props ---
// Prop generator for lazy generation of props

export var generateProps = function generateProps() {
  // Grab the breakpoints from the cached config (exclude the '' (xs) breakpoint)
  var breakpoints = getBreakpointsUpCached().filter(identity); // i.e. 'col-sm', 'col-md-6', 'col-lg-auto', ...

  var breakpointCol = breakpoints.reduce(function (props, breakpoint) {
    props[breakpoint] = makeProp(PROP_TYPE_BOOLEAN_NUMBER_STRING);
    return props;
  }, create(null)); // i.e. 'offset-md-1', 'offset-lg-12', ...

  var breakpointOffset = breakpoints.reduce(function (props, breakpoint) {
    props[suffixPropName(breakpoint, 'offset')] = makeProp(PROP_TYPE_NUMBER_STRING);
    return props;
  }, create(null)); // i.e. 'order-md-1', 'order-lg-12', ...

  var breakpointOrder = breakpoints.reduce(function (props, breakpoint) {
    props[suffixPropName(breakpoint, 'order')] = makeProp(PROP_TYPE_NUMBER_STRING);
    return props;
  }, create(null)); // For loop doesn't need to check `.hasOwnProperty()`
  // when using an object created from `null`

  breakpointPropMap = assign(create(null), {
    col: keys(breakpointCol),
    offset: keys(breakpointOffset),
    order: keys(breakpointOrder)
  }); // Return the generated props

  return makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, breakpointCol), breakpointOffset), breakpointOrder), {}, {
    // Flex alignment
    alignSelf: makeProp(PROP_TYPE_STRING, null, function (value) {
      return arrayIncludes(ALIGN_SELF_VALUES, value);
    }),
    // Generic flexbox 'col' (xs)
    col: makeProp(PROP_TYPE_BOOLEAN, false),
    // i.e. 'col-1', 'col-2', 'col-auto', ...
    cols: makeProp(PROP_TYPE_NUMBER_STRING),
    offset: makeProp(PROP_TYPE_NUMBER_STRING),
    order: makeProp(PROP_TYPE_NUMBER_STRING),
    tag: makeProp(PROP_TYPE_STRING, 'div')
  })), NAME_COL);
}; // --- Main component ---
// We do not use Vue.extend here as that would evaluate the props
// immediately, which we do not want to happen
// @vue/component

export var BCol = {
  name: NAME_COL,
  functional: true,

  get props() {
    // Allow props to be lazy evaled on first access and
    // then they become a non-getter afterwards.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#Smart_self-overwriting_lazy_getters
    delete this.props; // eslint-disable-next-line no-return-assign

    return this.props = generateProps();
  },

  render: function render(h, _ref) {
    var _classList$push;

    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var cols = props.cols,
        offset = props.offset,
        order = props.order,
        alignSelf = props.alignSelf;
    var classList = []; // Loop through `col`, `offset`, `order` breakpoint props

    for (var type in breakpointPropMap) {
      // Returns colSm, offset, offsetSm, orderMd, etc.
      var _keys = breakpointPropMap[type];

      for (var i = 0; i < _keys.length; i++) {
        // computeBreakpoint(col, colSm => Sm, value=[String, Number, Boolean])
        var c = computeBreakpointClass(type, _keys[i].replace(type, ''), props[_keys[i]]); // If a class is returned, push it onto the array.

        if (c) {
          classList.push(c);
        }
      }
    }

    var hasColClasses = classList.some(function (className) {
      return RX_COL_CLASS.test(className);
    });
    classList.push((_classList$push = {
      // Default to .col if no other col-{bp}-* classes generated nor `cols` specified.
      col: props.col || !hasColClasses && !cols
    }, _defineProperty(_classList$push, "col-".concat(cols), cols), _defineProperty(_classList$push, "offset-".concat(offset), offset), _defineProperty(_classList$push, "order-".concat(order), order), _defineProperty(_classList$push, "align-self-".concat(alignSelf), alignSelf), _classList$push));
    return h(props.tag, mergeData(data, {
      class: classList
    }), children);
  }
};