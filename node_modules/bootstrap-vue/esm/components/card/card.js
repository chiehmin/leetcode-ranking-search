function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_CARD } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_DEFAULT, SLOT_NAME_FOOTER, SLOT_NAME_HEADER } from '../../constants/slots';
import { htmlOrText } from '../../utils/html';
import { hasNormalizedSlot, normalizeSlot } from '../../utils/normalize-slot';
import { sortKeys } from '../../utils/object';
import { copyProps, makeProp, makePropsConfigurable, pluckProps, prefixPropName, unprefixPropName } from '../../utils/props';
import { props as cardProps } from '../../mixins/card';
import { BCardBody, props as BCardBodyProps } from './card-body';
import { BCardHeader, props as BCardHeaderProps } from './card-header';
import { BCardFooter, props as BCardFooterProps } from './card-footer';
import { BCardImg, props as BCardImgProps } from './card-img'; // --- Props ---

var cardImgProps = copyProps(BCardImgProps, prefixPropName.bind(null, 'img'));
cardImgProps.imgSrc.required = false;
export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, BCardBodyProps), BCardHeaderProps), BCardFooterProps), cardImgProps), cardProps), {}, {
  align: makeProp(PROP_TYPE_STRING),
  noBody: makeProp(PROP_TYPE_BOOLEAN, false)
})), NAME_CARD); // --- Main component ---
// @vue/component

export var BCard = /*#__PURE__*/Vue.extend({
  name: NAME_CARD,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var _class;

    var props = _ref.props,
        data = _ref.data,
        slots = _ref.slots,
        scopedSlots = _ref.scopedSlots;
    var imgSrc = props.imgSrc,
        imgLeft = props.imgLeft,
        imgRight = props.imgRight,
        imgStart = props.imgStart,
        imgEnd = props.imgEnd,
        imgBottom = props.imgBottom,
        header = props.header,
        headerHtml = props.headerHtml,
        footer = props.footer,
        footerHtml = props.footerHtml,
        align = props.align,
        textVariant = props.textVariant,
        bgVariant = props.bgVariant,
        borderVariant = props.borderVariant;
    var $scopedSlots = scopedSlots || {};
    var $slots = slots();
    var slotScope = {};
    var $imgFirst = h();
    var $imgLast = h();

    if (imgSrc) {
      var $img = h(BCardImg, {
        props: pluckProps(cardImgProps, props, unprefixPropName.bind(null, 'img'))
      });

      if (imgBottom) {
        $imgLast = $img;
      } else {
        $imgFirst = $img;
      }
    }

    var $header = h();
    var hasHeaderSlot = hasNormalizedSlot(SLOT_NAME_HEADER, $scopedSlots, $slots);

    if (hasHeaderSlot || header || headerHtml) {
      $header = h(BCardHeader, {
        props: pluckProps(BCardHeaderProps, props),
        domProps: hasHeaderSlot ? {} : htmlOrText(headerHtml, header)
      }, normalizeSlot(SLOT_NAME_HEADER, slotScope, $scopedSlots, $slots));
    }

    var $content = normalizeSlot(SLOT_NAME_DEFAULT, slotScope, $scopedSlots, $slots); // Wrap content in `<card-body>` when `noBody` prop set

    if (!props.noBody) {
      $content = h(BCardBody, {
        props: pluckProps(BCardBodyProps, props)
      }, $content); // When the `overlap` prop is set we need to wrap the `<b-card-img>` and `<b-card-body>`
      // into a relative positioned wrapper to don't distract a potential header or footer

      if (props.overlay && imgSrc) {
        $content = h('div', {
          staticClass: 'position-relative'
        }, [$imgFirst, $content, $imgLast]); // Reset image variables since they are already in the wrapper

        $imgFirst = h();
        $imgLast = h();
      }
    }

    var $footer = h();
    var hasFooterSlot = hasNormalizedSlot(SLOT_NAME_FOOTER, $scopedSlots, $slots);

    if (hasFooterSlot || footer || footerHtml) {
      $footer = h(BCardFooter, {
        props: pluckProps(BCardFooterProps, props),
        domProps: hasHeaderSlot ? {} : htmlOrText(footerHtml, footer)
      }, normalizeSlot(SLOT_NAME_FOOTER, slotScope, $scopedSlots, $slots));
    }

    return h(props.tag, mergeData(data, {
      staticClass: 'card',
      class: (_class = {
        'flex-row': imgLeft || imgStart,
        'flex-row-reverse': (imgRight || imgEnd) && !(imgLeft || imgStart)
      }, _defineProperty(_class, "text-".concat(align), align), _defineProperty(_class, "bg-".concat(bgVariant), bgVariant), _defineProperty(_class, "border-".concat(borderVariant), borderVariant), _defineProperty(_class, "text-".concat(textVariant), textVariant), _class)
    }), [$imgFirst, $header, $content, $footer, $imgLast]);
  }
});