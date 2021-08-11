function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_DROPDOWN_ITEM_BUTTON } from '../../constants/components';
import { EVENT_NAME_CLICK } from '../../constants/events';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { attrsMixin } from '../../mixins/attrs';
import { normalizeSlotMixin } from '../../mixins/normalize-slot'; // --- Props ---

export var props = makePropsConfigurable({
  active: makeProp(PROP_TYPE_BOOLEAN, false),
  activeClass: makeProp(PROP_TYPE_STRING, 'active'),
  buttonClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  variant: makeProp(PROP_TYPE_STRING)
}, NAME_DROPDOWN_ITEM_BUTTON); // --- Main component ---
// @vue/component

export var BDropdownItemButton = /*#__PURE__*/Vue.extend({
  name: NAME_DROPDOWN_ITEM_BUTTON,
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
        role: 'menuitem',
        type: 'button',
        disabled: this.disabled
      });
    }
  },
  methods: {
    closeDropdown: function closeDropdown() {
      if (this.bvDropdown) {
        this.bvDropdown.hide(true);
      }
    },
    onClick: function onClick(event) {
      this.$emit(EVENT_NAME_CLICK, event);
      this.closeDropdown();
    }
  },
  render: function render(h) {
    var _ref;

    var active = this.active,
        variant = this.variant,
        bvAttrs = this.bvAttrs;
    return h('li', {
      class: bvAttrs.class,
      style: bvAttrs.style,
      attrs: {
        role: 'presentation'
      }
    }, [h('button', {
      staticClass: 'dropdown-item',
      class: [this.buttonClass, (_ref = {}, _defineProperty(_ref, this.activeClass, active), _defineProperty(_ref, "text-".concat(variant), variant && !(active || this.disabled)), _ref)],
      attrs: this.computedAttrs,
      on: {
        click: this.onClick
      },
      ref: 'button'
    }, this.normalizeSlot())]);
  }
});