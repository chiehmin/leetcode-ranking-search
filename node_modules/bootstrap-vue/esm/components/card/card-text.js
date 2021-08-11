import { Vue, mergeData } from '../../vue';
import { NAME_CARD_TEXT } from '../../constants/components';
import { PROP_TYPE_STRING } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  textTag: makeProp(PROP_TYPE_STRING, 'p')
}, NAME_CARD_TEXT); // --- Main component ---
// @vue/component

export var BCardText = /*#__PURE__*/Vue.extend({
  name: NAME_CARD_TEXT,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    return h(props.textTag, mergeData(data, {
      staticClass: 'card-text'
    }), children);
  }
});