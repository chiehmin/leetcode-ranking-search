import { Vue, mergeData } from '../../vue';
import { NAME_CARD_GROUP } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  columns: makeProp(PROP_TYPE_BOOLEAN, false),
  deck: makeProp(PROP_TYPE_BOOLEAN, false),
  tag: makeProp(PROP_TYPE_STRING, 'div')
}, NAME_CARD_GROUP); // --- Main component ---
// @vue/component

export var BCardGroup = /*#__PURE__*/Vue.extend({
  name: NAME_CARD_GROUP,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    return h(props.tag, mergeData(data, {
      class: props.deck ? 'card-deck' : props.columns ? 'card-columns' : 'card-group'
    }), children);
  }
});