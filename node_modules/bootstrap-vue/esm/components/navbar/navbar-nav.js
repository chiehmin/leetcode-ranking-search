function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_NAVBAR_NAV } from '../../constants/components';
import { pick } from '../../utils/object';
import { makePropsConfigurable } from '../../utils/props';
import { props as BNavProps } from '../nav/nav'; // --- Helper methods ---

var computeJustifyContent = function computeJustifyContent(value) {
  value = value === 'left' ? 'start' : value === 'right' ? 'end' : value;
  return "justify-content-".concat(value);
}; // --- Props ---


export var props = makePropsConfigurable(pick(BNavProps, ['tag', 'fill', 'justified', 'align', 'small']), NAME_NAVBAR_NAV); // --- Main component ---
// @vue/component

export var BNavbarNav = /*#__PURE__*/Vue.extend({
  name: NAME_NAVBAR_NAV,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var _class;

    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var align = props.align;
    return h(props.tag, mergeData(data, {
      staticClass: 'navbar-nav',
      class: (_class = {
        'nav-fill': props.fill,
        'nav-justified': props.justified
      }, _defineProperty(_class, computeJustifyContent(align), align), _defineProperty(_class, "small", props.small), _class)
    }), children);
  }
});