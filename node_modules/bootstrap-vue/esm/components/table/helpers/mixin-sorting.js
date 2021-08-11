var _props, _watch;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../../vue';
import { EVENT_NAME_HEAD_CLICKED, EVENT_NAME_SORT_CHANGED, MODEL_EVENT_NAME_PREFIX } from '../../../constants/events';
import { PROP_TYPE_ARRAY_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_FUNCTION, PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '../../../constants/props';
import { arrayIncludes } from '../../../utils/array';
import { isFunction, isUndefinedOrNull } from '../../../utils/inspect';
import { makeProp } from '../../../utils/props';
import { stableSort } from '../../../utils/stable-sort';
import { trim } from '../../../utils/string';
import { defaultSortCompare } from './default-sort-compare'; // --- Constants ---

var MODEL_PROP_NAME_SORT_BY = 'sortBy';
var MODEL_EVENT_NAME_SORT_BY = MODEL_EVENT_NAME_PREFIX + MODEL_PROP_NAME_SORT_BY;
var MODEL_PROP_NAME_SORT_DESC = 'sortDesc';
var MODEL_EVENT_NAME_SORT_DESC = MODEL_EVENT_NAME_PREFIX + MODEL_PROP_NAME_SORT_DESC;
var SORT_DIRECTION_ASC = 'asc';
var SORT_DIRECTION_DESC = 'desc';
var SORT_DIRECTION_LAST = 'last';
var SORT_DIRECTIONS = [SORT_DIRECTION_ASC, SORT_DIRECTION_DESC, SORT_DIRECTION_LAST]; // --- Props ---

export var props = (_props = {
  labelSortAsc: makeProp(PROP_TYPE_STRING, 'Click to sort Ascending'),
  labelSortClear: makeProp(PROP_TYPE_STRING, 'Click to clear sorting'),
  labelSortDesc: makeProp(PROP_TYPE_STRING, 'Click to sort Descending'),
  noFooterSorting: makeProp(PROP_TYPE_BOOLEAN, false),
  noLocalSorting: makeProp(PROP_TYPE_BOOLEAN, false),
  // Another prop that should have had a better name
  // It should be `noSortClear` (on non-sortable headers)
  // We will need to make sure the documentation is clear on what
  // this prop does (as well as in the code for future reference)
  noSortReset: makeProp(PROP_TYPE_BOOLEAN, false)
}, _defineProperty(_props, MODEL_PROP_NAME_SORT_BY, makeProp(PROP_TYPE_STRING)), _defineProperty(_props, "sortCompare", makeProp(PROP_TYPE_FUNCTION)), _defineProperty(_props, "sortCompareLocale", makeProp(PROP_TYPE_ARRAY_STRING)), _defineProperty(_props, "sortCompareOptions", makeProp(PROP_TYPE_OBJECT, {
  numeric: true
})), _defineProperty(_props, MODEL_PROP_NAME_SORT_DESC, makeProp(PROP_TYPE_BOOLEAN, false)), _defineProperty(_props, "sortDirection", makeProp(PROP_TYPE_STRING, SORT_DIRECTION_ASC, function (value) {
  return arrayIncludes(SORT_DIRECTIONS, value);
})), _defineProperty(_props, "sortIconLeft", makeProp(PROP_TYPE_BOOLEAN, false)), _defineProperty(_props, "sortNullLast", makeProp(PROP_TYPE_BOOLEAN, false)), _props); // --- Mixin ---
// @vue/component

export var sortingMixin = Vue.extend({
  props: props,
  data: function data() {
    return {
      localSortBy: this[MODEL_PROP_NAME_SORT_BY] || '',
      localSortDesc: this[MODEL_PROP_NAME_SORT_DESC] || false
    };
  },
  computed: {
    localSorting: function localSorting() {
      return this.hasProvider ? !!this.noProviderSorting : !this.noLocalSorting;
    },
    isSortable: function isSortable() {
      return this.computedFields.some(function (f) {
        return f.sortable;
      });
    },
    // Sorts the filtered items and returns a new array of the sorted items
    // When not sorted, the original items array will be returned
    sortedItems: function sortedItems() {
      var sortBy = this.localSortBy,
          sortDesc = this.localSortDesc,
          locale = this.sortCompareLocale,
          nullLast = this.sortNullLast,
          sortCompare = this.sortCompare,
          localSorting = this.localSorting;
      var items = (this.filteredItems || this.localItems || []).slice();

      var localeOptions = _objectSpread(_objectSpread({}, this.sortCompareOptions), {}, {
        usage: 'sort'
      });

      if (sortBy && localSorting) {
        var field = this.computedFieldsObj[sortBy] || {};
        var sortByFormatted = field.sortByFormatted;
        var formatter = isFunction(sortByFormatted) ?
        /* istanbul ignore next */
        sortByFormatted : sortByFormatted ? this.getFieldFormatter(sortBy) : undefined; // `stableSort` returns a new array, and leaves the original array intact

        return stableSort(items, function (a, b) {
          var result = null; // Call user provided `sortCompare` routine first

          if (isFunction(sortCompare)) {
            // TODO:
            //   Change the `sortCompare` signature to the one of `defaultSortCompare`
            //   with the next major version bump
            result = sortCompare(a, b, sortBy, sortDesc, formatter, localeOptions, locale);
          } // Fallback to built-in `defaultSortCompare` if `sortCompare`
          // is not defined or returns `null`/`false`


          if (isUndefinedOrNull(result) || result === false) {
            result = defaultSortCompare(a, b, {
              sortBy: sortBy,
              formatter: formatter,
              locale: locale,
              localeOptions: localeOptions,
              nullLast: nullLast
            });
          } // Negate result if sorting in descending order


          return (result || 0) * (sortDesc ? -1 : 1);
        });
      }

      return items;
    }
  },
  watch: (_watch = {
    /* istanbul ignore next: pain in the butt to test */
    isSortable: function isSortable(newValue) {
      if (newValue) {
        if (this.isSortable) {
          this.$on(EVENT_NAME_HEAD_CLICKED, this.handleSort);
        }
      } else {
        this.$off(EVENT_NAME_HEAD_CLICKED, this.handleSort);
      }
    }
  }, _defineProperty(_watch, MODEL_PROP_NAME_SORT_DESC, function (newValue) {
    /* istanbul ignore next */
    if (newValue === this.localSortDesc) {
      return;
    }

    this.localSortDesc = newValue || false;
  }), _defineProperty(_watch, MODEL_PROP_NAME_SORT_BY, function (newValue) {
    /* istanbul ignore next */
    if (newValue === this.localSortBy) {
      return;
    }

    this.localSortBy = newValue || '';
  }), _defineProperty(_watch, "localSortDesc", function localSortDesc(newValue, oldValue) {
    // Emit update to sort-desc.sync
    if (newValue !== oldValue) {
      this.$emit(MODEL_EVENT_NAME_SORT_DESC, newValue);
    }
  }), _defineProperty(_watch, "localSortBy", function localSortBy(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.$emit(MODEL_EVENT_NAME_SORT_BY, newValue);
    }
  }), _watch),
  created: function created() {
    if (this.isSortable) {
      this.$on(EVENT_NAME_HEAD_CLICKED, this.handleSort);
    }
  },
  methods: {
    // Handlers
    // Need to move from thead-mixin
    handleSort: function handleSort(key, field, event, isFoot) {
      var _this = this;

      if (!this.isSortable) {
        /* istanbul ignore next */
        return;
      }

      if (isFoot && this.noFooterSorting) {
        return;
      } // TODO: make this tri-state sorting
      // cycle desc => asc => none => desc => ...


      var sortChanged = false;

      var toggleLocalSortDesc = function toggleLocalSortDesc() {
        var sortDirection = field.sortDirection || _this.sortDirection;

        if (sortDirection === SORT_DIRECTION_ASC) {
          _this.localSortDesc = false;
        } else if (sortDirection === SORT_DIRECTION_DESC) {
          _this.localSortDesc = true;
        } else {// sortDirection === 'last'
          // Leave at last sort direction from previous column
        }
      };

      if (field.sortable) {
        var sortKey = !this.localSorting && field.sortKey ? field.sortKey : key;

        if (this.localSortBy === sortKey) {
          // Change sorting direction on current column
          this.localSortDesc = !this.localSortDesc;
        } else {
          // Start sorting this column ascending
          this.localSortBy = sortKey; // this.localSortDesc = false

          toggleLocalSortDesc();
        }

        sortChanged = true;
      } else if (this.localSortBy && !this.noSortReset) {
        this.localSortBy = '';
        toggleLocalSortDesc();
        sortChanged = true;
      }

      if (sortChanged) {
        // Sorting parameters changed
        this.$emit(EVENT_NAME_SORT_CHANGED, this.context);
      }
    },
    // methods to compute classes and attrs for thead>th cells
    sortTheadThClasses: function sortTheadThClasses(key, field, isFoot) {
      return {
        // If sortable and sortIconLeft are true, then place sort icon on the left
        'b-table-sort-icon-left': field.sortable && this.sortIconLeft && !(isFoot && this.noFooterSorting)
      };
    },
    sortTheadThAttrs: function sortTheadThAttrs(key, field, isFoot) {
      if (!this.isSortable || isFoot && this.noFooterSorting) {
        // No attributes if not a sortable table
        return {};
      }

      var sortable = field.sortable; // Assemble the aria-sort attribute value

      var ariaSort = sortable && this.localSortBy === key ? this.localSortDesc ? 'descending' : 'ascending' : sortable ? 'none' : null; // Return the attribute

      return {
        'aria-sort': ariaSort
      };
    },
    sortTheadThLabel: function sortTheadThLabel(key, field, isFoot) {
      // A label to be placed in an `.sr-only` element in the header cell
      if (!this.isSortable || isFoot && this.noFooterSorting) {
        // No label if not a sortable table
        return null;
      }

      var sortable = field.sortable; // The correctness of these labels is very important for screen-reader users.

      var labelSorting = '';

      if (sortable) {
        if (this.localSortBy === key) {
          // currently sorted sortable column.
          labelSorting = this.localSortDesc ? this.labelSortAsc : this.labelSortDesc;
        } else {
          // Not currently sorted sortable column.
          // Not using nested ternary's here for clarity/readability
          // Default for ariaLabel
          labelSorting = this.localSortDesc ? this.labelSortDesc : this.labelSortAsc; // Handle sortDirection setting

          var sortDirection = this.sortDirection || field.sortDirection;

          if (sortDirection === SORT_DIRECTION_ASC) {
            labelSorting = this.labelSortAsc;
          } else if (sortDirection === SORT_DIRECTION_DESC) {
            labelSorting = this.labelSortDesc;
          }
        }
      } else if (!this.noSortReset) {
        // Non sortable column
        labelSorting = this.localSortBy ? this.labelSortClear : '';
      } // Return the sr-only sort label or null if no label


      return trim(labelSorting) || null;
    }
  }
});