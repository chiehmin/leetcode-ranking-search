function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_TABLE_CELL } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { isTag } from '../../utils/dom';
import { isUndefinedOrNull } from '../../utils/inspect';
import { toInteger } from '../../utils/number';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { toString } from '../../utils/string';
import { attrsMixin } from '../../mixins/attrs';
import { listenersMixin } from '../../mixins/listeners';
import { normalizeSlotMixin } from '../../mixins/normalize-slot'; // --- Helper methods ---
// Parse a rowspan or colspan into a digit (or `null` if < `1` )

var parseSpan = function parseSpan(value) {
  value = toInteger(value, 0);
  return value > 0 ? value : null;
};
/* istanbul ignore next */


var spanValidator = function spanValidator(value) {
  return isUndefinedOrNull(value) || parseSpan(value) > 0;
}; // --- Props ---


export var props = makePropsConfigurable({
  colspan: makeProp(PROP_TYPE_NUMBER_STRING, null, spanValidator),
  rowspan: makeProp(PROP_TYPE_NUMBER_STRING, null, spanValidator),
  stackedHeading: makeProp(PROP_TYPE_STRING),
  stickyColumn: makeProp(PROP_TYPE_BOOLEAN, false),
  variant: makeProp(PROP_TYPE_STRING)
}, NAME_TABLE_CELL); // --- Main component ---
// TODO:
//   In Bootstrap v5, we won't need "sniffing" as table element variants properly inherit
//   to the child elements, so this can be converted to a functional component
// @vue/component

export var BTd = /*#__PURE__*/Vue.extend({
  name: NAME_TABLE_CELL,
  // Mixin order is important!
  mixins: [attrsMixin, listenersMixin, normalizeSlotMixin],
  inject: {
    bvTableTr: {
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
    // Overridden by `<b-th>`
    tag: function tag() {
      return 'td';
    },
    inTbody: function inTbody() {
      return this.bvTableTr.inTbody;
    },
    inThead: function inThead() {
      return this.bvTableTr.inThead;
    },
    inTfoot: function inTfoot() {
      return this.bvTableTr.inTfoot;
    },
    isDark: function isDark() {
      return this.bvTableTr.isDark;
    },
    isStacked: function isStacked() {
      return this.bvTableTr.isStacked;
    },
    // We only support stacked-heading in tbody in stacked mode
    isStackedCell: function isStackedCell() {
      return this.inTbody && this.isStacked;
    },
    isResponsive: function isResponsive() {
      return this.bvTableTr.isResponsive;
    },
    // Needed to handle header background classes, due to lack of
    // background color inheritance with Bootstrap v4 table CSS
    // Sticky headers only apply to cells in table `thead`
    isStickyHeader: function isStickyHeader() {
      return this.bvTableTr.isStickyHeader;
    },
    // Needed to handle header background classes, due to lack of
    // background color inheritance with Bootstrap v4 table CSS
    hasStickyHeader: function hasStickyHeader() {
      return this.bvTableTr.hasStickyHeader;
    },
    // Needed to handle background classes, due to lack of
    // background color inheritance with Bootstrap v4 table CSS
    // Sticky column cells are only available in responsive
    // mode (horizontal scrolling) or when sticky header mode
    // Applies to cells in `thead`, `tbody` and `tfoot`
    isStickyColumn: function isStickyColumn() {
      return !this.isStacked && (this.isResponsive || this.hasStickyHeader) && this.stickyColumn;
    },
    rowVariant: function rowVariant() {
      return this.bvTableTr.variant;
    },
    headVariant: function headVariant() {
      return this.bvTableTr.headVariant;
    },
    footVariant: function footVariant() {
      return this.bvTableTr.footVariant;
    },
    tableVariant: function tableVariant() {
      return this.bvTableTr.tableVariant;
    },
    computedColspan: function computedColspan() {
      return parseSpan(this.colspan);
    },
    computedRowspan: function computedRowspan() {
      return parseSpan(this.rowspan);
    },
    // We use computed props here for improved performance by caching
    // the results of the string interpolation
    cellClasses: function cellClasses() {
      var variant = this.variant,
          headVariant = this.headVariant,
          isStickyColumn = this.isStickyColumn;

      if (!variant && this.isStickyHeader && !headVariant || !variant && isStickyColumn && this.inTfoot && !this.footVariant || !variant && isStickyColumn && this.inThead && !headVariant || !variant && isStickyColumn && this.inTbody) {
        // Needed for sticky-header mode as Bootstrap v4 table cells do
        // not inherit parent's `background-color`
        variant = this.rowVariant || this.tableVariant || 'b-table-default';
      }

      return [variant ? "".concat(this.isDark ? 'bg' : 'table', "-").concat(variant) : null, isStickyColumn ? 'b-table-sticky-column' : null];
    },
    cellAttrs: function cellAttrs() {
      var stackedHeading = this.stackedHeading; // We use computed props here for improved performance by caching
      // the results of the object spread (Object.assign)

      var headOrFoot = this.inThead || this.inTfoot; // Make sure col/rowspan's are > 0 or null

      var colspan = this.computedColspan;
      var rowspan = this.computedRowspan; // Default role and scope

      var role = 'cell';
      var scope = null; // Compute role and scope
      // We only add scopes with an explicit span of 1 or greater

      if (headOrFoot) {
        // Header or footer cells
        role = 'columnheader';
        scope = colspan > 0 ? 'colspan' : 'col';
      } else if (isTag(this.tag, 'th')) {
        // th's in tbody
        role = 'rowheader';
        scope = rowspan > 0 ? 'rowgroup' : 'row';
      }

      return _objectSpread(_objectSpread({
        colspan: colspan,
        rowspan: rowspan,
        role: role,
        scope: scope
      }, this.bvAttrs), {}, {
        // Add in the stacked cell label data-attribute if in
        // stacked mode (if a stacked heading label is provided)
        'data-label': this.isStackedCell && !isUndefinedOrNull(stackedHeading) ?
        /* istanbul ignore next */
        toString(stackedHeading) : null
      });
    }
  },
  render: function render(h) {
    var $content = [this.normalizeSlot()];
    return h(this.tag, {
      class: this.cellClasses,
      attrs: this.cellAttrs,
      // Transfer any native listeners
      on: this.bvListeners
    }, [this.isStackedCell ? h('div', [$content]) : $content]);
  }
});