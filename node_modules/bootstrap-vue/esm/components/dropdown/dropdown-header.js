function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_DROPDOWN_HEADER } from '../../constants/components';
import { PROP_TYPE_STRING } from '../../constants/props';
import { isTag } from '../../utils/dom';
import { omit } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  id: makeProp(PROP_TYPE_STRING),
  tag: makeProp(PROP_TYPE_STRING, 'header'),
  variant: makeProp(PROP_TYPE_STRING)
}, NAME_DROPDOWN_HEADER); // --- Main component ---
// @vue/component

export var BDropdownHeader = /*#__PURE__*/Vue.extend({
  name: NAME_DROPDOWN_HEADER,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var tag = props.tag,
        variant = props.variant;
    return h('li', mergeData(omit(data, ['attrs']), {
      attrs: {
        role: 'presentation'
      }
    }), [h(tag, {
      staticClass: 'dropdown-header',
      class: _defineProperty({}, "text-".concat(variant), variant),
      attrs: _objectSpread(_objectSpread({}, data.attrs || {}), {}, {
        id: props.id || null,
        role: isTag(tag, 'header') ? null : 'heading'
      }),
      ref: 'header'
    }, children)]);
  }
});