function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { mergeData } from '../../vue';
import { NAME_ROW } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { arrayIncludes, concat } from '../../utils/array';
import { getBreakpointsUpCached } from '../../utils/config';
import { identity } from '../../utils/identity';
import { memoize } from '../../utils/memoize';
import { create, keys, sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable, suffixPropName } from '../../utils/props';
import { lowerCase, toString, trim } from '../../utils/string'; // --- Constants ---

var COMMON_ALIGNMENT = ['start', 'end', 'center']; // --- Helper methods ---
// Compute a `row-cols-{breakpoint}-{cols}` class name
// Memoized function for better performance on generating class names

var computeRowColsClass = memoize(function (breakpoint, cols) {
  cols = trim(toString(cols));
  return cols ? lowerCase(['row-cols', breakpoint, cols].filter(identity).join('-')) : null;
}); // Get the breakpoint name from the `rowCols` prop name
// Memoized function for better performance on extracting breakpoint names

var computeRowColsBreakpoint = memoize(function (prop) {
  return lowerCase(prop.replace('cols', ''));
}); // Cached copy of the `row-cols` breakpoint prop names
// Will be populated when the props are generated

var rowColsPropList = []; // --- Props ---
// Prop generator for lazy generation of props

export var generateProps = function generateProps() {
  // i.e. 'row-cols-2', 'row-cols-md-4', 'row-cols-xl-6', ...
  var rowColsProps = getBreakpointsUpCached().reduce(function (props, breakpoint) {
    props[suffixPropName(breakpoint, 'cols')] = makeProp(PROP_TYPE_NUMBER_STRING);
    return props;
  }, create(null)); // Cache the row-cols prop names

  rowColsPropList = keys(rowColsProps); // Return the generated props

  return makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, rowColsProps), {}, {
    alignContent: makeProp(PROP_TYPE_STRING, null, function (value) {
      return arrayIncludes(concat(COMMON_ALIGNMENT, 'between', 'around', 'stretch'), value);
    }),
    alignH: makeProp(PROP_TYPE_STRING, null, function (value) {
      return arrayIncludes(concat(COMMON_ALIGNMENT, 'between', 'around'), value);
    }),
    alignV: makeProp(PROP_TYPE_STRING, null, function (value) {
      return arrayIncludes(concat(COMMON_ALIGNMENT, 'baseline', 'stretch'), value);
    }),
    noGutters: makeProp(PROP_TYPE_BOOLEAN, false),
    tag: makeProp(PROP_TYPE_STRING, 'div')
  })), NAME_ROW);
}; // --- Main component ---
// We do not use `Vue.extend()` here as that would evaluate the props
// immediately, which we do not want to happen
// @vue/component

export var BRow = {
  name: NAME_ROW,
  functional: true,

  get props() {
    // Allow props to be lazy evaled on first access and
    // then they become a non-getter afterwards
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#Smart_self-overwriting_lazy_getters
    delete this.props;
    this.props = generateProps();
    return this.props;
  },

  render: function render(h, _ref) {
    var _classList$push;

    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var alignV = props.alignV,
        alignH = props.alignH,
        alignContent = props.alignContent; // Loop through row-cols breakpoint props and generate the classes

    var classList = [];
    rowColsPropList.forEach(function (prop) {
      var c = computeRowColsClass(computeRowColsBreakpoint(prop), props[prop]); // If a class is returned, push it onto the array

      if (c) {
        classList.push(c);
      }
    });
    classList.push((_classList$push = {
      'no-gutters': props.noGutters
    }, _defineProperty(_classList$push, "align-items-".concat(alignV), alignV), _defineProperty(_classList$push, "justify-content-".concat(alignH), alignH), _defineProperty(_classList$push, "align-content-".concat(alignContent), alignContent), _classList$push));
    return h(props.tag, mergeData(data, {
      staticClass: 'row',
      class: classList
    }), children);
  }
};