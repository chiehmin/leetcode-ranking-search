function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_NAVBAR } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_BOOLEAN_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { getBreakpoints } from '../../utils/config';
import { isTag } from '../../utils/dom';
import { isString } from '../../utils/inspect';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { normalizeSlotMixin } from '../../mixins/normalize-slot'; // --- Props ---

export var props = makePropsConfigurable({
  fixed: makeProp(PROP_TYPE_STRING),
  print: makeProp(PROP_TYPE_BOOLEAN, false),
  sticky: makeProp(PROP_TYPE_BOOLEAN, false),
  tag: makeProp(PROP_TYPE_STRING, 'nav'),
  toggleable: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
  type: makeProp(PROP_TYPE_STRING, 'light'),
  variant: makeProp(PROP_TYPE_STRING)
}, NAME_NAVBAR); // --- Main component ---
// @vue/component

export var BNavbar = /*#__PURE__*/Vue.extend({
  name: NAME_NAVBAR,
  mixins: [normalizeSlotMixin],
  provide: function provide() {
    return {
      bvNavbar: this
    };
  },
  props: props,
  computed: {
    breakpointClass: function breakpointClass() {
      var toggleable = this.toggleable;
      var xs = getBreakpoints()[0];
      var breakpoint = null;

      if (toggleable && isString(toggleable) && toggleable !== xs) {
        breakpoint = "navbar-expand-".concat(toggleable);
      } else if (toggleable === false) {
        breakpoint = 'navbar-expand';
      }

      return breakpoint;
    }
  },
  render: function render(h) {
    var _ref;

    var tag = this.tag,
        type = this.type,
        variant = this.variant,
        fixed = this.fixed;
    return h(tag, {
      staticClass: 'navbar',
      class: [(_ref = {
        'd-print': this.print,
        'sticky-top': this.sticky
      }, _defineProperty(_ref, "navbar-".concat(type), type), _defineProperty(_ref, "bg-".concat(variant), variant), _defineProperty(_ref, "fixed-".concat(fixed), fixed), _ref), this.breakpointClass],
      attrs: {
        role: isTag(tag, 'nav') ? null : 'navigation'
      }
    }, [this.normalizeSlot()]);
  }
});