function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_TFOOT } from '../../constants/components';
import { PROP_TYPE_STRING } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { attrsMixin } from '../../mixins/attrs';
import { listenersMixin } from '../../mixins/listeners';
import { normalizeSlotMixin } from '../../mixins/normalize-slot'; // --- Props ---

export var props = makePropsConfigurable({
  // Supported values: 'lite', 'dark', or null
  footVariant: makeProp(PROP_TYPE_STRING)
}, NAME_TFOOT); // --- Main component ---
// TODO:
//   In Bootstrap v5, we won't need "sniffing" as table element variants properly inherit
//   to the child elements, so this can be converted to a functional component
// @vue/component

export var BTfoot = /*#__PURE__*/Vue.extend({
  name: NAME_TFOOT,
  mixins: [attrsMixin, listenersMixin, normalizeSlotMixin],
  provide: function provide() {
    return {
      bvTableRowGroup: this
    };
  },
  inject: {
    // Sniffed by `<b-tr>` / `<b-td>` / `<b-th>`
    bvTable: {
      default:
      /* istanbul ignore next */
      function _default() {
        return {};
      }
    }
  },
  inheritAttrs: false,
  props: props,
  computed: {
    // Sniffed by `<b-tr>` / `<b-td>` / `<b-th>`
    isTfoot: function isTfoot() {
      return true;
    },
    // Sniffed by `<b-tr>` / `<b-td>` / `<b-th>`
    isDark: function isDark() {
      return this.bvTable.dark;
    },
    // Sniffed by `<b-tr>` / `<b-td>` / `<b-th>`
    isStacked: function isStacked() {
      return this.bvTable.isStacked;
    },
    // Sniffed by `<b-tr>` / `<b-td>` / `<b-th>`
    isResponsive: function isResponsive() {
      return this.bvTable.isResponsive;
    },
    // Sniffed by `<b-tr>` / `<b-td>` / `<b-th>`
    // Sticky headers are only supported in thead
    isStickyHeader: function isStickyHeader() {
      return false;
    },
    // Sniffed by `<b-tr>` / `<b-td>` / `<b-th>`
    // Needed to handle header background classes, due to lack of
    // background color inheritance with Bootstrap v4 table CSS
    hasStickyHeader: function hasStickyHeader() {
      return !this.isStacked && this.bvTable.stickyHeader;
    },
    // Sniffed by `<b-tr>` / `<b-td>` / `<b-th>`
    tableVariant: function tableVariant() {
      return this.bvTable.tableVariant;
    },
    tfootClasses: function tfootClasses() {
      return [this.footVariant ? "thead-".concat(this.footVariant) : null];
    },
    tfootAttrs: function tfootAttrs() {
      return _objectSpread(_objectSpread({}, this.bvAttrs), {}, {
        role: 'rowgroup'
      });
    }
  },
  render: function render(h) {
    return h('tfoot', {
      class: this.tfootClasses,
      attrs: this.tfootAttrs,
      // Pass down any native listeners
      on: this.bvListeners
    }, this.normalizeSlot());
  }
});