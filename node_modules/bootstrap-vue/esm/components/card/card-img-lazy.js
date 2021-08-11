function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_CARD_IMG_LAZY } from '../../constants/components';
import { keys, omit, sortKeys } from '../../utils/object';
import { makePropsConfigurable } from '../../utils/props';
import { props as BImgProps } from '../image/img';
import { BImgLazy, props as BImgLazyProps } from '../image/img-lazy';
import { props as BCardImgProps } from './card-img'; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, omit(BImgLazyProps, keys(BImgProps))), omit(BCardImgProps, ['src', 'alt', 'width', 'height']))), NAME_CARD_IMG_LAZY); // --- Main component ---
// @vue/component

export var BCardImgLazy = /*#__PURE__*/Vue.extend({
  name: NAME_CARD_IMG_LAZY,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data;
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

    return h(BImgLazy, mergeData(data, {
      class: [baseClass],
      // Exclude `left` and `right` props before passing to `<b-img-lazy>`
      props: omit(props, ['left', 'right'])
    }));
  }
});