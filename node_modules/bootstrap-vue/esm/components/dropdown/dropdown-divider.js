function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_DROPDOWN_DIVIDER } from '../../constants/components';
import { PROP_TYPE_STRING } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { omit } from '../../utils/object'; // --- Props ---

export var props = makePropsConfigurable({
  tag: makeProp(PROP_TYPE_STRING, 'hr')
}, NAME_DROPDOWN_DIVIDER); // --- Main component ---
// @vue/component

export var BDropdownDivider = /*#__PURE__*/Vue.extend({
  name: NAME_DROPDOWN_DIVIDER,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data;
    return h('li', mergeData(omit(data, ['attrs']), {
      attrs: {
        role: 'presentation'
      }
    }), [h(props.tag, {
      staticClass: 'dropdown-divider',
      attrs: _objectSpread(_objectSpread({}, data.attrs || {}), {}, {
        role: 'separator',
        'aria-orientation': 'horizontal'
      }),
      ref: 'divider'
    })]);
  }
});