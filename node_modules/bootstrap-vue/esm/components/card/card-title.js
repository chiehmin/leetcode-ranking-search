import { Vue, mergeData } from '../../vue';
import { NAME_CARD_TITLE } from '../../constants/components';
import { PROP_TYPE_STRING } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { toString } from '../../utils/string'; // --- Props ---

export var props = makePropsConfigurable({
  title: makeProp(PROP_TYPE_STRING),
  titleTag: makeProp(PROP_TYPE_STRING, 'h4')
}, NAME_CARD_TITLE); // --- Main component ---
// @vue/component

export var BCardTitle = /*#__PURE__*/Vue.extend({
  name: NAME_CARD_TITLE,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    return h(props.titleTag, mergeData(data, {
      staticClass: 'card-title'
    }), children || toString(props.title));
  }
});