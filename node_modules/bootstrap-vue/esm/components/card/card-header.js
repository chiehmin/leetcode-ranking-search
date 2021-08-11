function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_CARD_HEADER } from '../../constants/components';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { htmlOrText } from '../../utils/html';
import { sortKeys } from '../../utils/object';
import { copyProps, makeProp, makePropsConfigurable, prefixPropName } from '../../utils/props';
import { props as BCardProps } from '../../mixins/card'; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, copyProps(BCardProps, prefixPropName.bind(null, 'header'))), {}, {
  header: makeProp(PROP_TYPE_STRING),
  headerClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  headerHtml: makeProp(PROP_TYPE_STRING)
})), NAME_CARD_HEADER); // --- Main component ---
// @vue/component

export var BCardHeader = /*#__PURE__*/Vue.extend({
  name: NAME_CARD_HEADER,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var _ref2;

    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var headerBgVariant = props.headerBgVariant,
        headerBorderVariant = props.headerBorderVariant,
        headerTextVariant = props.headerTextVariant;
    return h(props.headerTag, mergeData(data, {
      staticClass: 'card-header',
      class: [props.headerClass, (_ref2 = {}, _defineProperty(_ref2, "bg-".concat(headerBgVariant), headerBgVariant), _defineProperty(_ref2, "border-".concat(headerBorderVariant), headerBorderVariant), _defineProperty(_ref2, "text-".concat(headerTextVariant), headerTextVariant), _ref2)],
      domProps: children ? {} : htmlOrText(props.headerHtml, props.header)
    }), children);
  }
});