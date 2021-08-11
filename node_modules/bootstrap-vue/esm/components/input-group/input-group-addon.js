import { Vue, mergeData } from '../../vue';
import { NAME_INPUT_GROUP_ADDON } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { BInputGroupText } from './input-group-text'; // --- Props ---

export var props = makePropsConfigurable({
  append: makeProp(PROP_TYPE_BOOLEAN, false),
  id: makeProp(PROP_TYPE_STRING),
  isText: makeProp(PROP_TYPE_BOOLEAN, false),
  tag: makeProp(PROP_TYPE_STRING, 'div')
}, NAME_INPUT_GROUP_ADDON); // --- Main component ---
// @vue/component

export var BInputGroupAddon = /*#__PURE__*/Vue.extend({
  name: NAME_INPUT_GROUP_ADDON,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var append = props.append;
    return h(props.tag, mergeData(data, {
      class: {
        'input-group-append': append,
        'input-group-prepend': !append
      },
      attrs: {
        id: props.id
      }
    }), props.isText ? [h(BInputGroupText, children)] : children);
  }
});