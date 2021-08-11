function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_BADGE } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props';
import { omit, sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable, pluckProps } from '../../utils/props';
import { isLink } from '../../utils/router';
import { BLink, props as BLinkProps } from '../link/link'; // --- Props ---

var linkProps = omit(BLinkProps, ['event', 'routerTag']);
delete linkProps.href.default;
delete linkProps.to.default;
export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, linkProps), {}, {
  pill: makeProp(PROP_TYPE_BOOLEAN, false),
  tag: makeProp(PROP_TYPE_STRING, 'span'),
  variant: makeProp(PROP_TYPE_STRING, 'secondary')
})), NAME_BADGE); // --- Main component ---
// @vue/component

export var BBadge = /*#__PURE__*/Vue.extend({
  name: NAME_BADGE,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var active = props.active,
        disabled = props.disabled;
    var link = isLink(props);
    var tag = link ? BLink : props.tag;
    var variant = props.variant || 'secondary';
    return h(tag, mergeData(data, {
      staticClass: 'badge',
      class: ["badge-".concat(variant), {
        'badge-pill': props.pill,
        active: active,
        disabled: disabled
      }],
      props: link ? pluckProps(linkProps, props) : {}
    }), children);
  }
});