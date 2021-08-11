function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_FORM_TEXT } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  id: makeProp(PROP_TYPE_STRING),
  inline: makeProp(PROP_TYPE_BOOLEAN, false),
  tag: makeProp(PROP_TYPE_STRING, 'small'),
  textVariant: makeProp(PROP_TYPE_STRING, 'muted')
}, NAME_FORM_TEXT); // --- Main component ---
// @vue/component

export var BFormText = /*#__PURE__*/Vue.extend({
  name: NAME_FORM_TEXT,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    return h(props.tag, mergeData(data, {
      class: _defineProperty({
        'form-text': !props.inline
      }, "text-".concat(props.textVariant), props.textVariant),
      attrs: {
        id: props.id
      }
    }), children);
  }
});