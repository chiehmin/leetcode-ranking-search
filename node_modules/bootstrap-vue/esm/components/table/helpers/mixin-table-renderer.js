function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../../vue';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_BOOLEAN_STRING, PROP_TYPE_STRING } from '../../../constants/props';
import { identity } from '../../../utils/identity';
import { isBoolean } from '../../../utils/inspect';
import { makeProp } from '../../../utils/props';
import { toString } from '../../../utils/string';
import { attrsMixin } from '../../../mixins/attrs'; // Main `<table>` render mixin
// Includes all main table styling options
// --- Props ---

export var props = {
  bordered: makeProp(PROP_TYPE_BOOLEAN, false),
  borderless: makeProp(PROP_TYPE_BOOLEAN, false),
  captionTop: makeProp(PROP_TYPE_BOOLEAN, false),
  dark: makeProp(PROP_TYPE_BOOLEAN, false),
  fixed: makeProp(PROP_TYPE_BOOLEAN, false),
  hover: makeProp(PROP_TYPE_BOOLEAN, false),
  noBorderCollapse: makeProp(PROP_TYPE_BOOLEAN, false),
  outlined: makeProp(PROP_TYPE_BOOLEAN, false),
  responsive: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
  small: makeProp(PROP_TYPE_BOOLEAN, false),
  // If a string, it is assumed to be the table `max-height` value
  stickyHeader: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
  striped: makeProp(PROP_TYPE_BOOLEAN, false),
  tableClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  tableVariant: makeProp(PROP_TYPE_STRING)
}; // --- Mixin ---
// @vue/component

export var tableRendererMixin = Vue.extend({
  mixins: [attrsMixin],
  provide: function provide() {
    return {
      bvTable: this
    };
  },
  // Don't place attributes on root element automatically,
  // as table could be wrapped in responsive `<div>`
  inheritAttrs: false,
  props: props,
  computed: {
    // Layout related computed props
    isResponsive: function isResponsive() {
      var responsive = this.responsive;
      return responsive === '' ? true : responsive;
    },
    isStickyHeader: function isStickyHeader() {
      var stickyHeader = this.stickyHeader;
      stickyHeader = stickyHeader === '' ? true : stickyHeader;
      return this.isStacked ? false : stickyHeader;
    },
    wrapperClasses: function wrapperClasses() {
      var isResponsive = this.isResponsive;
      return [this.isStickyHeader ? 'b-table-sticky-header' : '', isResponsive === true ? 'table-responsive' : isResponsive ? "table-responsive-".concat(this.responsive) : ''].filter(identity);
    },
    wrapperStyles: function wrapperStyles() {
      var isStickyHeader = this.isStickyHeader;
      return isStickyHeader && !isBoolean(isStickyHeader) ? {
        maxHeight: isStickyHeader
      } : {};
    },
    tableClasses: function tableClasses() {
      var hover = this.hover,
          tableVariant = this.tableVariant;
      hover = this.isTableSimple ? hover : hover && this.computedItems.length > 0 && !this.computedBusy;
      return [// User supplied classes
      this.tableClass, // Styling classes
      {
        'table-striped': this.striped,
        'table-hover': hover,
        'table-dark': this.dark,
        'table-bordered': this.bordered,
        'table-borderless': this.borderless,
        'table-sm': this.small,
        // The following are b-table custom styles
        border: this.outlined,
        'b-table-fixed': this.fixed,
        'b-table-caption-top': this.captionTop,
        'b-table-no-border-collapse': this.noBorderCollapse
      }, tableVariant ? "".concat(this.dark ? 'bg' : 'table', "-").concat(tableVariant) : '', // Stacked table classes
      this.stackedTableClasses, // Selectable classes
      this.selectableTableClasses];
    },
    tableAttrs: function tableAttrs() {
      var items = this.computedItems,
          filteredItems = this.filteredItems,
          fields = this.computedFields,
          selectableTableAttrs = this.selectableTableAttrs;
      var ariaAttrs = this.isTableSimple ? {} : {
        'aria-busy': this.computedBusy ? 'true' : 'false',
        'aria-colcount': toString(fields.length),
        // Preserve user supplied `aria-describedby`, if provided
        'aria-describedby': this.bvAttrs['aria-describedby'] || this.$refs.caption ? this.captionId : null
      };
      var rowCount = items && filteredItems && filteredItems.length > items.length ? toString(filteredItems.length) : null;
      return _objectSpread(_objectSpread(_objectSpread({
        // We set `aria-rowcount` before merging in `$attrs`,
        // in case user has supplied their own
        'aria-rowcount': rowCount
      }, this.bvAttrs), {}, {
        // Now we can override any `$attrs` here
        id: this.safeId(),
        role: 'table'
      }, ariaAttrs), selectableTableAttrs);
    }
  },
  render: function render(h) {
    var wrapperClasses = this.wrapperClasses,
        renderCaption = this.renderCaption,
        renderColgroup = this.renderColgroup,
        renderThead = this.renderThead,
        renderTbody = this.renderTbody,
        renderTfoot = this.renderTfoot;
    var $content = [];

    if (this.isTableSimple) {
      $content.push(this.normalizeSlot());
    } else {
      // Build the `<caption>` (from caption mixin)
      $content.push(renderCaption ? renderCaption() : null); // Build the `<colgroup>`

      $content.push(renderColgroup ? renderColgroup() : null); // Build the `<thead>`

      $content.push(renderThead ? renderThead() : null); // Build the `<tbody>`

      $content.push(renderTbody ? renderTbody() : null); // Build the `<tfoot>`

      $content.push(renderTfoot ? renderTfoot() : null);
    } // Assemble `<table>`


    var $table = h('table', {
      staticClass: 'table b-table',
      class: this.tableClasses,
      attrs: this.tableAttrs,
      key: 'b-table'
    }, $content.filter(identity)); // Add responsive/sticky wrapper if needed and return table

    return wrapperClasses.length > 0 ? h('div', {
      class: wrapperClasses,
      style: this.wrapperStyles,
      key: 'wrap'
    }, [$table]) : $table;
  }
});