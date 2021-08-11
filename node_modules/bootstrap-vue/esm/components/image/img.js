function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_IMG } from '../../constants/components';
import { PROP_TYPE_ARRAY_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_BOOLEAN_STRING, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { concat } from '../../utils/array';
import { identity } from '../../utils/identity';
import { isString } from '../../utils/inspect';
import { toInteger } from '../../utils/number';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { toString } from '../../utils/string'; // --- Constants --
// Blank image with fill template

var BLANK_TEMPLATE = '<svg width="%{w}" height="%{h}" ' + 'xmlns="http://www.w3.org/2000/svg" ' + 'viewBox="0 0 %{w} %{h}" preserveAspectRatio="none">' + '<rect width="100%" height="100%" style="fill:%{f};"></rect>' + '</svg>'; // --- Helper methods ---

var makeBlankImgSrc = function makeBlankImgSrc(width, height, color) {
  var src = encodeURIComponent(BLANK_TEMPLATE.replace('%{w}', toString(width)).replace('%{h}', toString(height)).replace('%{f}', color));
  return "data:image/svg+xml;charset=UTF-8,".concat(src);
}; // --- Props ---


export var props = makePropsConfigurable({
  alt: makeProp(PROP_TYPE_STRING),
  blank: makeProp(PROP_TYPE_BOOLEAN, false),
  blankColor: makeProp(PROP_TYPE_STRING, 'transparent'),
  block: makeProp(PROP_TYPE_BOOLEAN, false),
  center: makeProp(PROP_TYPE_BOOLEAN, false),
  fluid: makeProp(PROP_TYPE_BOOLEAN, false),
  // Gives fluid images class `w-100` to make them grow to fit container
  fluidGrow: makeProp(PROP_TYPE_BOOLEAN, false),
  height: makeProp(PROP_TYPE_NUMBER_STRING),
  left: makeProp(PROP_TYPE_BOOLEAN, false),
  right: makeProp(PROP_TYPE_BOOLEAN, false),
  // Possible values:
  //   `false`: no rounding of corners
  //   `true`: slightly rounded corners
  //   'top': top corners rounded
  //   'right': right corners rounded
  //   'bottom': bottom corners rounded
  //   'left': left corners rounded
  //   'circle': circle/oval
  //   '0': force rounding off
  rounded: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
  sizes: makeProp(PROP_TYPE_ARRAY_STRING),
  src: makeProp(PROP_TYPE_STRING),
  srcset: makeProp(PROP_TYPE_ARRAY_STRING),
  thumbnail: makeProp(PROP_TYPE_BOOLEAN, false),
  width: makeProp(PROP_TYPE_NUMBER_STRING)
}, NAME_IMG); // --- Main component ---
// @vue/component

export var BImg = /*#__PURE__*/Vue.extend({
  name: NAME_IMG,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var _class;

    var props = _ref.props,
        data = _ref.data;
    var alt = props.alt,
        src = props.src,
        block = props.block,
        fluidGrow = props.fluidGrow,
        rounded = props.rounded;
    var width = toInteger(props.width) || null;
    var height = toInteger(props.height) || null;
    var align = null;
    var srcset = concat(props.srcset).filter(identity).join(',');
    var sizes = concat(props.sizes).filter(identity).join(',');

    if (props.blank) {
      if (!height && width) {
        height = width;
      } else if (!width && height) {
        width = height;
      }

      if (!width && !height) {
        width = 1;
        height = 1;
      } // Make a blank SVG image


      src = makeBlankImgSrc(width, height, props.blankColor || 'transparent'); // Disable srcset and sizes

      srcset = null;
      sizes = null;
    }

    if (props.left) {
      align = 'float-left';
    } else if (props.right) {
      align = 'float-right';
    } else if (props.center) {
      align = 'mx-auto';
      block = true;
    }

    return h('img', mergeData(data, {
      attrs: {
        src: src,
        alt: alt,
        width: width ? toString(width) : null,
        height: height ? toString(height) : null,
        srcset: srcset || null,
        sizes: sizes || null
      },
      class: (_class = {
        'img-thumbnail': props.thumbnail,
        'img-fluid': props.fluid || fluidGrow,
        'w-100': fluidGrow,
        rounded: rounded === '' || rounded === true
      }, _defineProperty(_class, "rounded-".concat(rounded), isString(rounded) && rounded !== ''), _defineProperty(_class, align, align), _defineProperty(_class, 'd-block', block), _class)
    }));
  }
});