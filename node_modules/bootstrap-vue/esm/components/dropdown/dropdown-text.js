function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_DROPDOWN_TEXT } from '../../constants/components';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { omit } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  tag: makeProp(PROP_TYPE_STRING, 'p'),
  textClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  variant: makeProp(PROP_TYPE_STRING)
}, NAME_DROPDOWN_TEXT); // --- Main component ---
// @vue/component

export var BDropdownText = /*#__PURE__*/Vue.extend({
  name: NAME_DROPDOWN_TEXT,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var tag = props.tag,
        textClass = props.textClass,
        variant = props.variant;
    return h('li', mergeData(omit(data, ['attrs']), {
      attrs: {
        role: 'presentation'
      }
    }), [h(tag, {
      staticClass: 'b-dropdown-text',
      class: [textClass, _defineProperty({}, "text-".concat(variant), variant)],
      props: props,
      attrs: data.attrs || {},
      ref: 'text'
    }, children)]);
  }
});