function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_BREADCRUMB_LINK } from '../../constants/components';
import { PROP_TYPE_STRING } from '../../constants/props';
import { htmlOrText } from '../../utils/html';
import { omit, sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable, pluckProps } from '../../utils/props';
import { BLink, props as BLinkProps } from '../link/link'; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, omit(BLinkProps, ['event', 'routerTag'])), {}, {
  ariaCurrent: makeProp(PROP_TYPE_STRING, 'location'),
  html: makeProp(PROP_TYPE_STRING),
  text: makeProp(PROP_TYPE_STRING)
})), NAME_BREADCRUMB_LINK); // --- Main component ---
// @vue/component

export var BBreadcrumbLink = /*#__PURE__*/Vue.extend({
  name: NAME_BREADCRUMB_LINK,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var suppliedProps = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var active = suppliedProps.active;
    var tag = active ? 'span' : BLink;
    var componentData = {
      attrs: {
        'aria-current': active ? suppliedProps.ariaCurrent : null
      },
      props: pluckProps(props, suppliedProps)
    };

    if (!children) {
      componentData.domProps = htmlOrText(suppliedProps.html, suppliedProps.text);
    }

    return h(tag, mergeData(data, componentData), children);
  }
});