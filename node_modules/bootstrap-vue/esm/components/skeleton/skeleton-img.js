function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_SKELETON_IMG } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { BAspect } from '../aspect';
import { BSkeleton } from './skeleton'; // --- Props ---

export var props = makePropsConfigurable({
  animation: makeProp(PROP_TYPE_STRING),
  aspect: makeProp(PROP_TYPE_STRING, '16:9'),
  cardImg: makeProp(PROP_TYPE_STRING),
  height: makeProp(PROP_TYPE_STRING),
  noAspect: makeProp(PROP_TYPE_BOOLEAN, false),
  variant: makeProp(PROP_TYPE_STRING),
  width: makeProp(PROP_TYPE_STRING)
}, NAME_SKELETON_IMG); // --- Main component ---
// @vue/component

export var BSkeletonImg = /*#__PURE__*/Vue.extend({
  name: NAME_SKELETON_IMG,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props;
    var aspect = props.aspect,
        width = props.width,
        height = props.height,
        animation = props.animation,
        variant = props.variant,
        cardImg = props.cardImg;
    var $img = h(BSkeleton, {
      props: {
        type: 'img',
        width: width,
        height: height,
        animation: animation,
        variant: variant
      },
      class: _defineProperty({}, "card-img-".concat(cardImg), cardImg)
    });
    return props.noAspect ? $img : h(BAspect, {
      props: {
        aspect: aspect
      }
    }, [$img]);
  }
});