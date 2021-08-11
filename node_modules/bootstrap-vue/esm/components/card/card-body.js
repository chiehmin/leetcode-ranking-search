function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_CARD_BODY } from '../../constants/components';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_BOOLEAN } from '../../constants/props';
import { sortKeys } from '../../utils/object';
import { copyProps, makeProp, makePropsConfigurable, pluckProps, prefixPropName } from '../../utils/props';
import { props as cardProps } from '../../mixins/card';
import { BCardTitle, props as titleProps } from './card-title';
import { BCardSubTitle, props as subTitleProps } from './card-sub-title'; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, titleProps), subTitleProps), copyProps(cardProps, prefixPropName.bind(null, 'body'))), {}, {
  bodyClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  overlay: makeProp(PROP_TYPE_BOOLEAN, false)
})), NAME_CARD_BODY); // --- Main component ---
// @vue/component

export var BCardBody = /*#__PURE__*/Vue.extend({
  name: NAME_CARD_BODY,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var _ref2;

    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var bodyBgVariant = props.bodyBgVariant,
        bodyBorderVariant = props.bodyBorderVariant,
        bodyTextVariant = props.bodyTextVariant;
    var $title = h();

    if (props.title) {
      $title = h(BCardTitle, {
        props: pluckProps(titleProps, props)
      });
    }

    var $subTitle = h();

    if (props.subTitle) {
      $subTitle = h(BCardSubTitle, {
        props: pluckProps(subTitleProps, props),
        class: ['mb-2']
      });
    }

    return h(props.bodyTag, mergeData(data, {
      staticClass: 'card-body',
      class: [(_ref2 = {
        'card-img-overlay': props.overlay
      }, _defineProperty(_ref2, "bg-".concat(bodyBgVariant), bodyBgVariant), _defineProperty(_ref2, "border-".concat(bodyBorderVariant), bodyBorderVariant), _defineProperty(_ref2, "text-".concat(bodyTextVariant), bodyTextVariant), _ref2), props.bodyClass]
    }), [$title, $subTitle, children]);
  }
});