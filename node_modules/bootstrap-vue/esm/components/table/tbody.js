function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_TBODY } from '../../constants/components';
import { PROP_TYPE_OBJECT } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { attrsMixin } from '../../mixins/attrs';
import { listenersMixin } from '../../mixins/listeners';
import { normalizeSlotMixin } from '../../mixins/normalize-slot'; // --- Props ---

export var props = makePropsConfigurable({
  tbodyTransitionHandlers: makeProp(PROP_TYPE_OBJECT),
  tbodyTransitionProps: makeProp(PROP_TYPE_OBJECT)
}, NAME_TBODY); // --- Main component ---
// TODO:
//   In Bootstrap v5, we won't need "sniffing" as table element variants properly inherit
//   to the child elements, so this can be converted to a functional component
// @vue/component

export var BTbody = /*#__PURE__*/Vue.extend({
  name: NAME_TBODY,
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
    isTbody: function isTbody() {
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
    isTransitionGroup: function isTransitionGroup() {
      return this.tbodyTransitionProps || this.tbodyTransitionHandlers;
    },
    tbodyAttrs: function tbodyAttrs() {
      return _objectSpread({
        role: 'rowgroup'
      }, this.bvAttrs);
    },
    tbodyProps: function tbodyProps() {
      var tbodyTransitionProps = this.tbodyTransitionProps;
      return tbodyTransitionProps ? _objectSpread(_objectSpread({}, tbodyTransitionProps), {}, {
        tag: 'tbody'
      }) : {};
    }
  },
  render: function render(h) {
    var data = {
      props: this.tbodyProps,
      attrs: this.tbodyAttrs
    };

    if (this.isTransitionGroup) {
      // We use native listeners if a transition group for any delegated events
      data.on = this.tbodyTransitionHandlers || {};
      data.nativeOn = this.bvListeners;
    } else {
      // Otherwise we place any listeners on the tbody element
      data.on = this.bvListeners;
    }

    return h(this.isTransitionGroup ? 'transition-group' : 'tbody', data, this.normalizeSlot());
  }
});