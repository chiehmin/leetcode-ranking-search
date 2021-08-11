function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_ICON_BASE } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { identity } from '../../utils/identity';
import { isUndefinedOrNull } from '../../utils/inspect';
import { mathMax } from '../../utils/math';
import { toFloat } from '../../utils/number';
import { makeProp } from '../../utils/props'; // --- Constants ---
// Base attributes needed on all icons

var BASE_ATTRS = {
  viewBox: '0 0 16 16',
  width: '1em',
  height: '1em',
  focusable: 'false',
  role: 'img',
  'aria-label': 'icon'
}; // Attributes that are nulled out when stacked

var STACKED_ATTRS = {
  width: null,
  height: null,
  focusable: null,
  role: null,
  'aria-label': null
}; // --- Props ---

export var props = {
  animation: makeProp(PROP_TYPE_STRING),
  content: makeProp(PROP_TYPE_STRING),
  flipH: makeProp(PROP_TYPE_BOOLEAN, false),
  flipV: makeProp(PROP_TYPE_BOOLEAN, false),
  fontScale: makeProp(PROP_TYPE_NUMBER_STRING, 1),
  rotate: makeProp(PROP_TYPE_NUMBER_STRING, 0),
  scale: makeProp(PROP_TYPE_NUMBER_STRING, 1),
  shiftH: makeProp(PROP_TYPE_NUMBER_STRING, 0),
  shiftV: makeProp(PROP_TYPE_NUMBER_STRING, 0),
  stacked: makeProp(PROP_TYPE_BOOLEAN, false),
  title: makeProp(PROP_TYPE_STRING),
  variant: makeProp(PROP_TYPE_STRING)
}; // --- Main component ---
// Shared private base component to reduce bundle/runtime size
// @vue/component

export var BVIconBase = /*#__PURE__*/Vue.extend({
  name: NAME_ICON_BASE,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var _class;

    var data = _ref.data,
        props = _ref.props,
        children = _ref.children;
    var animation = props.animation,
        content = props.content,
        flipH = props.flipH,
        flipV = props.flipV,
        stacked = props.stacked,
        title = props.title,
        variant = props.variant;
    var fontScale = mathMax(toFloat(props.fontScale, 1), 0) || 1;
    var scale = mathMax(toFloat(props.scale, 1), 0) || 1;
    var rotate = toFloat(props.rotate, 0);
    var shiftH = toFloat(props.shiftH, 0);
    var shiftV = toFloat(props.shiftV, 0); // Compute the transforms
    // Note that order is important as SVG transforms are applied in order from
    // left to right and we want flipping/scale to occur before rotation
    // Note shifting is applied separately
    // Assumes that the viewbox is `0 0 16 16` (`8 8` is the center)

    var hasScale = flipH || flipV || scale !== 1;
    var hasTransforms = hasScale || rotate;
    var hasShift = shiftH || shiftV;
    var hasContent = !isUndefinedOrNull(content);
    var transforms = [hasTransforms ? 'translate(8 8)' : null, hasScale ? "scale(".concat((flipH ? -1 : 1) * scale, " ").concat((flipV ? -1 : 1) * scale, ")") : null, rotate ? "rotate(".concat(rotate, ")") : null, hasTransforms ? 'translate(-8 -8)' : null].filter(identity); // We wrap the content in a `<g>` for handling the transforms (except shift)

    var $inner = h('g', {
      attrs: {
        transform: transforms.join(' ') || null
      },
      domProps: hasContent ? {
        innerHTML: content || ''
      } : {}
    }, children); // If needed, we wrap in an additional `<g>` in order to handle the shifting

    if (hasShift) {
      $inner = h('g', {
        attrs: {
          transform: "translate(".concat(16 * shiftH / 16, " ").concat(-16 * shiftV / 16, ")")
        }
      }, [$inner]);
    } // Wrap in an additional `<g>` for proper animation handling if stacked


    if (stacked) {
      $inner = h('g', [$inner]);
    }

    var $title = title ? h('title', title) : null;
    var $content = [$title, $inner].filter(identity);
    return h('svg', mergeData({
      staticClass: 'b-icon bi',
      class: (_class = {}, _defineProperty(_class, "text-".concat(variant), variant), _defineProperty(_class, "b-icon-animation-".concat(animation), animation), _class),
      attrs: BASE_ATTRS,
      style: stacked ? {} : {
        fontSize: fontScale === 1 ? null : "".concat(fontScale * 100, "%")
      }
    }, // Merge in user supplied data
    data, // If icon is stacked, null-out some attrs
    stacked ? {
      attrs: STACKED_ATTRS
    } : {}, // These cannot be overridden by users
    {
      attrs: {
        xmlns: stacked ? null : 'http://www.w3.org/2000/svg',
        fill: 'currentColor'
      }
    }), $content);
  }
});