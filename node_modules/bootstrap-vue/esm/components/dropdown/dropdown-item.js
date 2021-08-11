function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_DROPDOWN_ITEM } from '../../constants/components';
import { EVENT_NAME_CLICK } from '../../constants/events';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { requestAF } from '../../utils/dom';
import { omit, sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable, pluckProps } from '../../utils/props';
import { attrsMixin } from '../../mixins/attrs';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BLink, props as BLinkProps } from '../link/link'; // --- Props ---

var linkProps = omit(BLinkProps, ['event', 'routerTag']);
export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, linkProps), {}, {
  linkClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  variant: makeProp(PROP_TYPE_STRING)
})), NAME_DROPDOWN_ITEM); // --- Main component ---
// @vue/component

export var BDropdownItem = /*#__PURE__*/Vue.extend({
  name: NAME_DROPDOWN_ITEM,
  mixins: [attrsMixin, normalizeSlotMixin],
  inject: {
    bvDropdown: {
      default: null
    }
  },
  inheritAttrs: false,
  props: props,
  computed: {
    computedAttrs: function computedAttrs() {
      return _objectSpread(_objectSpread({}, this.bvAttrs), {}, {
        role: 'menuitem'
      });
    }
  },
  methods: {
    closeDropdown: function closeDropdown() {
      var _this = this;

      // Close on next animation frame to allow <b-link> time to process
      requestAF(function () {
        if (_this.bvDropdown) {
          _this.bvDropdown.hide(true);
        }
      });
    },
    onClick: function onClick(event) {
      this.$emit(EVENT_NAME_CLICK, event);
      this.closeDropdown();
    }
  },
  render: function render(h) {
    var linkClass = this.linkClass,
        variant = this.variant,
        active = this.active,
        disabled = this.disabled,
        onClick = this.onClick,
        bvAttrs = this.bvAttrs;
    return h('li', {
      class: bvAttrs.class,
      style: bvAttrs.style,
      attrs: {
        role: 'presentation'
      }
    }, [h(BLink, {
      staticClass: 'dropdown-item',
      class: [linkClass, _defineProperty({}, "text-".concat(variant), variant && !(active || disabled))],
      props: pluckProps(linkProps, this.$props),
      attrs: this.computedAttrs,
      on: {
        click: onClick
      },
      ref: 'item'
    }, this.normalizeSlot())]);
  }
});