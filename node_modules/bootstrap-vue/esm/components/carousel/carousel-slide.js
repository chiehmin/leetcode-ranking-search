function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_CAROUSEL_SLIDE } from '../../constants/components';
import { HAS_TOUCH_SUPPORT } from '../../constants/env';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_IMG } from '../../constants/slots';
import { stopEvent } from '../../utils/events';
import { htmlOrText } from '../../utils/html';
import { identity } from '../../utils/identity';
import { sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable, pluckProps, unprefixPropName } from '../../utils/props';
import { idMixin, props as idProps } from '../../mixins/id';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BImg } from '../image/img'; // --- Props ---

var imgProps = {
  imgAlt: makeProp(PROP_TYPE_STRING),
  imgBlank: makeProp(PROP_TYPE_BOOLEAN, false),
  imgBlankColor: makeProp(PROP_TYPE_STRING, 'transparent'),
  imgHeight: makeProp(PROP_TYPE_NUMBER_STRING),
  imgSrc: makeProp(PROP_TYPE_STRING),
  imgWidth: makeProp(PROP_TYPE_NUMBER_STRING)
};
export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread({}, idProps), imgProps), {}, {
  background: makeProp(PROP_TYPE_STRING),
  caption: makeProp(PROP_TYPE_STRING),
  captionHtml: makeProp(PROP_TYPE_STRING),
  captionTag: makeProp(PROP_TYPE_STRING, 'h3'),
  contentTag: makeProp(PROP_TYPE_STRING, 'div'),
  contentVisibleUp: makeProp(PROP_TYPE_STRING),
  text: makeProp(PROP_TYPE_STRING),
  textHtml: makeProp(PROP_TYPE_STRING),
  textTag: makeProp(PROP_TYPE_STRING, 'p')
})), NAME_CAROUSEL_SLIDE); // --- Main component ---
// @vue/component

export var BCarouselSlide = /*#__PURE__*/Vue.extend({
  name: NAME_CAROUSEL_SLIDE,
  mixins: [idMixin, normalizeSlotMixin],
  inject: {
    bvCarousel: {
      // Explicitly disable touch if not a child of carousel
      default: function _default() {
        return {
          noTouch: true
        };
      }
    }
  },
  props: props,
  computed: {
    contentClasses: function contentClasses() {
      return [this.contentVisibleUp ? 'd-none' : '', this.contentVisibleUp ? "d-".concat(this.contentVisibleUp, "-block") : ''];
    },
    computedWidth: function computedWidth() {
      // Use local width, or try parent width
      return this.imgWidth || this.bvCarousel.imgWidth || null;
    },
    computedHeight: function computedHeight() {
      // Use local height, or try parent height
      return this.imgHeight || this.bvCarousel.imgHeight || null;
    }
  },
  render: function render(h) {
    var $img = this.normalizeSlot(SLOT_NAME_IMG);

    if (!$img && (this.imgSrc || this.imgBlank)) {
      var on = {}; // Touch support event handler

      /* istanbul ignore if: difficult to test in JSDOM */

      if (!this.bvCarousel.noTouch && HAS_TOUCH_SUPPORT) {
        on.dragstart = function (event) {
          return stopEvent(event, {
            propagation: false
          });
        };
      }

      $img = h(BImg, {
        props: _objectSpread(_objectSpread({}, pluckProps(imgProps, this.$props, unprefixPropName.bind(null, 'img'))), {}, {
          width: this.computedWidth,
          height: this.computedHeight,
          fluidGrow: true,
          block: true
        }),
        on: on
      });
    }

    var $contentChildren = [// Caption
    this.caption || this.captionHtml ? h(this.captionTag, {
      domProps: htmlOrText(this.captionHtml, this.caption)
    }) : false, // Text
    this.text || this.textHtml ? h(this.textTag, {
      domProps: htmlOrText(this.textHtml, this.text)
    }) : false, // Children
    this.normalizeSlot() || false];
    var $content = h();

    if ($contentChildren.some(identity)) {
      $content = h(this.contentTag, {
        staticClass: 'carousel-caption',
        class: this.contentClasses
      }, $contentChildren.map(function ($child) {
        return $child || h();
      }));
    }

    return h('div', {
      staticClass: 'carousel-item',
      style: {
        background: this.background || this.bvCarousel.background || null
      },
      attrs: {
        id: this.safeId(),
        role: 'listitem'
      }
    }, [$img, $content]);
  }
});