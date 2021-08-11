function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../../vue';
import { EVENT_NAME_CONTEXT_CHANGED, EVENT_NAME_FILTERED, EVENT_NAME_ROW_CLICKED, EVENT_NAME_ROW_SELECTED } from '../../../constants/events';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../../constants/props';
import { arrayIncludes, createArray } from '../../../utils/array';
import { identity } from '../../../utils/identity';
import { isArray, isNumber } from '../../../utils/inspect';
import { looseEqual } from '../../../utils/loose-equal';
import { mathMax, mathMin } from '../../../utils/math';
import { makeProp } from '../../../utils/props';
import { sanitizeRow } from './sanitize-row'; // --- Constants ---

var SELECT_MODES = ['range', 'multi', 'single']; // --- Props ---

export var props = {
  // Disable use of click handlers for row selection
  noSelectOnClick: makeProp(PROP_TYPE_BOOLEAN, false),
  selectMode: makeProp(PROP_TYPE_STRING, 'multi', function (value) {
    return arrayIncludes(SELECT_MODES, value);
  }),
  selectable: makeProp(PROP_TYPE_BOOLEAN, false),
  selectedVariant: makeProp(PROP_TYPE_STRING, 'active')
}; // --- Mixin ---
// @vue/component

export var selectableMixin = Vue.extend({
  props: props,
  data: function data() {
    return {
      selectedRows: [],
      selectedLastRow: -1
    };
  },
  computed: {
    isSelectable: function isSelectable() {
      return this.selectable && this.selectMode;
    },
    hasSelectableRowClick: function hasSelectableRowClick() {
      return this.isSelectable && !this.noSelectOnClick;
    },
    supportsSelectableRows: function supportsSelectableRows() {
      return true;
    },
    selectableHasSelection: function selectableHasSelection() {
      var selectedRows = this.selectedRows;
      return this.isSelectable && selectedRows && selectedRows.length > 0 && selectedRows.some(identity);
    },
    selectableIsMultiSelect: function selectableIsMultiSelect() {
      return this.isSelectable && arrayIncludes(['range', 'multi'], this.selectMode);
    },
    selectableTableClasses: function selectableTableClasses() {
      var _ref;

      var isSelectable = this.isSelectable;
      return _ref = {
        'b-table-selectable': isSelectable
      }, _defineProperty(_ref, "b-table-select-".concat(this.selectMode), isSelectable), _defineProperty(_ref, 'b-table-selecting', this.selectableHasSelection), _defineProperty(_ref, 'b-table-selectable-no-click', isSelectable && !this.hasSelectableRowClick), _ref;
    },
    selectableTableAttrs: function selectableTableAttrs() {
      return {
        // TODO:
        //   Should this attribute not be included when no-select-on-click is set
        //   since this attribute implies keyboard navigation?
        'aria-multiselectable': !this.isSelectable ? null : this.selectableIsMultiSelect ? 'true' : 'false'
      };
    }
  },
  watch: {
    computedItems: function computedItems(newValue, oldValue) {
      // Reset for selectable
      var equal = false;

      if (this.isSelectable && this.selectedRows.length > 0) {
        // Quick check against array length
        equal = isArray(newValue) && isArray(oldValue) && newValue.length === oldValue.length;

        for (var i = 0; equal && i < newValue.length; i++) {
          // Look for the first non-loosely equal row, after ignoring reserved fields
          equal = looseEqual(sanitizeRow(newValue[i]), sanitizeRow(oldValue[i]));
        }
      }

      if (!equal) {
        this.clearSelected();
      }
    },
    selectable: function selectable(newValue) {
      this.clearSelected();
      this.setSelectionHandlers(newValue);
    },
    selectMode: function selectMode() {
      this.clearSelected();
    },
    hasSelectableRowClick: function hasSelectableRowClick(newValue) {
      this.clearSelected();
      this.setSelectionHandlers(!newValue);
    },
    selectedRows: function selectedRows(_selectedRows, oldValue) {
      var _this = this;

      if (this.isSelectable && !looseEqual(_selectedRows, oldValue)) {
        var items = []; // `.forEach()` skips over non-existent indices (on sparse arrays)

        _selectedRows.forEach(function (v, idx) {
          if (v) {
            items.push(_this.computedItems[idx]);
          }
        });

        this.$emit(EVENT_NAME_ROW_SELECTED, items);
      }
    }
  },
  beforeMount: function beforeMount() {
    // Set up handlers if needed
    if (this.isSelectable) {
      this.setSelectionHandlers(true);
    }
  },
  methods: {
    // Public methods
    selectRow: function selectRow(index) {
      // Select a particular row (indexed based on computedItems)
      if (this.isSelectable && isNumber(index) && index >= 0 && index < this.computedItems.length && !this.isRowSelected(index)) {
        var selectedRows = this.selectableIsMultiSelect ? this.selectedRows.slice() : [];
        selectedRows[index] = true;
        this.selectedLastClicked = -1;
        this.selectedRows = selectedRows;
      }
    },
    unselectRow: function unselectRow(index) {
      // Un-select a particular row (indexed based on `computedItems`)
      if (this.isSelectable && isNumber(index) && this.isRowSelected(index)) {
        var selectedRows = this.selectedRows.slice();
        selectedRows[index] = false;
        this.selectedLastClicked = -1;
        this.selectedRows = selectedRows;
      }
    },
    selectAllRows: function selectAllRows() {
      var length = this.computedItems.length;

      if (this.isSelectable && length > 0) {
        this.selectedLastClicked = -1;
        this.selectedRows = this.selectableIsMultiSelect ? createArray(length, true) : [true];
      }
    },
    isRowSelected: function isRowSelected(index) {
      // Determine if a row is selected (indexed based on `computedItems`)
      return !!(isNumber(index) && this.selectedRows[index]);
    },
    clearSelected: function clearSelected() {
      // Clear any active selected row(s)
      this.selectedLastClicked = -1;
      this.selectedRows = [];
    },
    // Internal private methods
    selectableRowClasses: function selectableRowClasses(index) {
      if (this.isSelectable && this.isRowSelected(index)) {
        var variant = this.selectedVariant;
        return _defineProperty({
          'b-table-row-selected': true
        }, "".concat(this.dark ? 'bg' : 'table', "-").concat(variant), variant);
      }

      return {};
    },
    selectableRowAttrs: function selectableRowAttrs(index) {
      return {
        'aria-selected': !this.isSelectable ? null : this.isRowSelected(index) ? 'true' : 'false'
      };
    },
    setSelectionHandlers: function setSelectionHandlers(on) {
      var method = on && !this.noSelectOnClick ? '$on' : '$off'; // Handle row-clicked event

      this[method](EVENT_NAME_ROW_CLICKED, this.selectionHandler); // Clear selection on filter, pagination, and sort changes

      this[method](EVENT_NAME_FILTERED, this.clearSelected);
      this[method](EVENT_NAME_CONTEXT_CHANGED, this.clearSelected);
    },
    selectionHandler: function selectionHandler(item, index, event) {
      /* istanbul ignore if: should never happen */
      if (!this.isSelectable || this.noSelectOnClick) {
        // Don't do anything if table is not in selectable mode
        this.clearSelected();
        return;
      }

      var selectMode = this.selectMode,
          selectedLastRow = this.selectedLastRow;
      var selectedRows = this.selectedRows.slice();
      var selected = !selectedRows[index]; // Note 'multi' mode needs no special event handling

      if (selectMode === 'single') {
        selectedRows = [];
      } else if (selectMode === 'range') {
        if (selectedLastRow > -1 && event.shiftKey) {
          // range
          for (var idx = mathMin(selectedLastRow, index); idx <= mathMax(selectedLastRow, index); idx++) {
            selectedRows[idx] = true;
          }

          selected = true;
        } else {
          if (!(event.ctrlKey || event.metaKey)) {
            // Clear range selection if any
            selectedRows = [];
            selected = true;
          }

          this.selectedLastRow = selected ? index : -1;
        }
      }

      selectedRows[index] = selected;
      this.selectedRows = selectedRows;
    }
  }
});