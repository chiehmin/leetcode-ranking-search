import { Vue, mergeData } from '../../vue';
import { NAME_FORM_ROW } from '../../constants/components';
import { PROP_TYPE_STRING } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  tag: makeProp(PROP_TYPE_STRING, 'div')
}, NAME_FORM_ROW); // --- Main component ---
// @vue/component

export var BFormRow = /*#__PURE__*/Vue.extend({
  name: NAME_FORM_ROW,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    return h(props.tag, mergeData(data, {
      staticClass: 'form-row'
    }), children);
  }
});