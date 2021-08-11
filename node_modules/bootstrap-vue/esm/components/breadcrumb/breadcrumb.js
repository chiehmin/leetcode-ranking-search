function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_BREADCRUMB } from '../../constants/components';
import { PROP_TYPE_ARRAY } from '../../constants/props';
import { isArray, isObject } from '../../utils/inspect';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { toString } from '../../utils/string';
import { BBreadcrumbItem } from './breadcrumb-item'; // --- Props ---

export var props = makePropsConfigurable({
  items: makeProp(PROP_TYPE_ARRAY)
}, NAME_BREADCRUMB); // --- Main component ---
// @vue/component

export var BBreadcrumb = /*#__PURE__*/Vue.extend({
  name: NAME_BREADCRUMB,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var items = props.items; // Build child nodes from items, if given

    var childNodes = children;

    if (isArray(items)) {
      var activeDefined = false;
      childNodes = items.map(function (item, idx) {
        if (!isObject(item)) {
          item = {
            text: toString(item)
          };
        } // Copy the value here so we can normalize it


        var _item = item,
            active = _item.active;

        if (active) {
          activeDefined = true;
        } // Auto-detect active by position in list


        if (!active && !activeDefined) {
          active = idx + 1 === items.length;
        }

        return h(BBreadcrumbItem, {
          props: _objectSpread(_objectSpread({}, item), {}, {
            active: active
          })
        });
      });
    }

    return h('ol', mergeData(data, {
      staticClass: 'breadcrumb'
    }), childNodes);
  }
});