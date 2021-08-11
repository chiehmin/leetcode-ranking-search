import { Vue, mergeData } from '../../vue';
import { NAME_NAV_TEXT } from '../../constants/components'; // --- Props ---

export var props = {}; // --- Main component ---
// @vue/component

export var BNavText = /*#__PURE__*/Vue.extend({
  name: NAME_NAV_TEXT,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var data = _ref.data,
        children = _ref.children;
    return h('li', mergeData(data, {
      staticClass: 'navbar-text'
    }), children);
  }
});