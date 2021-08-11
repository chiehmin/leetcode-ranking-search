import { Vue, mergeData } from '../../vue';
import { NAME_MEDIA_BODY } from '../../constants/components';
import { PROP_TYPE_STRING } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  tag: makeProp(PROP_TYPE_STRING, 'div')
}, NAME_MEDIA_BODY); // --- Main component ---
// @vue/component

export var BMediaBody = /*#__PURE__*/Vue.extend({
  name: NAME_MEDIA_BODY,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    return h(props.tag, mergeData(data, {
      staticClass: 'media-body'
    }), children);
  }
});