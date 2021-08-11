function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_CARD_IMG } from '../../constants/components';
import { PROP_TYPE_BOOLEAN } from '../../constants/props';
import { pick, sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { props as BImgProps } from '../image/img'; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, pick(BImgProps, ['src', 'alt', 'width', 'height', 'left', 'right'])), {}, {
  bottom: makeProp(PROP_TYPE_BOOLEAN, false),
  end: makeProp(PROP_TYPE_BOOLEAN, false),
  start: makeProp(PROP_TYPE_BOOLEAN, false),
  top: makeProp(PROP_TYPE_BOOLEAN, false)
})), NAME_CARD_IMG); // --- Main component ---
// @vue/component

export var BCardImg = /*#__PURE__*/Vue.extend({
  name: NAME_CARD_IMG,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data;
    var src = props.src,
        alt = props.alt,
        width = props.width,
        height = props.height;
    var baseClass = 'card-img';

    if (props.top) {
      baseClass += '-top';
    } else if (props.right || props.end) {
      baseClass += '-right';
    } else if (props.bottom) {
      baseClass += '-bottom';
    } else if (props.left || props.start) {
      baseClass += '-left';
    }

    return h('img', mergeData(data, {
      class: baseClass,
      attrs: {
        src: src,
        alt: alt,
        width: width,
        height: height
      }
    }));
  }
});