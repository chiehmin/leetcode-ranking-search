function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_SKELETON } from '../../constants/components';
import { PROP_TYPE_STRING } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  animation: makeProp(PROP_TYPE_STRING, 'wave'),
  height: makeProp(PROP_TYPE_STRING),
  size: makeProp(PROP_TYPE_STRING),
  type: makeProp(PROP_TYPE_STRING, 'text'),
  variant: makeProp(PROP_TYPE_STRING),
  width: makeProp(PROP_TYPE_STRING)
}, NAME_SKELETON); // --- Main component ---
// @vue/component

export var BSkeleton = /*#__PURE__*/Vue.extend({
  name: NAME_SKELETON,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var _class;

    var data = _ref.data,
        props = _ref.props;
    var size = props.size,
        animation = props.animation,
        variant = props.variant;
    return h('div', mergeData(data, {
      staticClass: 'b-skeleton',
      style: {
        width: size || props.width,
        height: size || props.height
      },
      class: (_class = {}, _defineProperty(_class, "b-skeleton-".concat(props.type), true), _defineProperty(_class, "b-skeleton-animate-".concat(animation), animation), _defineProperty(_class, "bg-".concat(variant), variant), _class)
    }));
  }
});