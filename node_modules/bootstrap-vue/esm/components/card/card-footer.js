function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_CARD_FOOTER } from '../../constants/components';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { htmlOrText } from '../../utils/html';
import { sortKeys } from '../../utils/object';
import { copyProps, makeProp, makePropsConfigurable, prefixPropName } from '../../utils/props';
import { props as BCardProps } from '../../mixins/card'; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, copyProps(BCardProps, prefixPropName.bind(null, 'footer'))), {}, {
  footer: makeProp(PROP_TYPE_STRING),
  footerClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  footerHtml: makeProp(PROP_TYPE_STRING)
})), NAME_CARD_FOOTER); // --- Main component ---
// @vue/component

export var BCardFooter = /*#__PURE__*/Vue.extend({
  name: NAME_CARD_FOOTER,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var _ref2;

    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var footerBgVariant = props.footerBgVariant,
        footerBorderVariant = props.footerBorderVariant,
        footerTextVariant = props.footerTextVariant;
    return h(props.footerTag, mergeData(data, {
      staticClass: 'card-footer',
      class: [props.footerClass, (_ref2 = {}, _defineProperty(_ref2, "bg-".concat(footerBgVariant), footerBgVariant), _defineProperty(_ref2, "border-".concat(footerBorderVariant), footerBorderVariant), _defineProperty(_ref2, "text-".concat(footerTextVariant), footerTextVariant), _ref2)],
      domProps: children ? {} : htmlOrText(props.footerHtml, props.footer)
    }), children);
  }
});