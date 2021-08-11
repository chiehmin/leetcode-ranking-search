function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import { Vue } from '../../../vue';
import { NAME_TABLE } from '../../../constants/components';
import { EVENT_NAME_FILTERED } from '../../../constants/events';
import { PROP_TYPE_REG_EXP, PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_FUNCTION, PROP_TYPE_ARRAY, PROP_TYPE_NUMBER_STRING } from '../../../constants/props';
import { RX_DIGITS, RX_SPACES } from '../../../constants/regex';
import { concat } from '../../../utils/array';
import { cloneDeep } from '../../../utils/clone-deep';
import { identity } from '../../../utils/identity';
import { isFunction, isString, isRegExp } from '../../../utils/inspect';
import { looseEqual } from '../../../utils/loose-equal';
import { toInteger } from '../../../utils/number';
import { hasPropFunction, makeProp } from '../../../utils/props';
import { escapeRegExp } from '../../../utils/string';
import { warn } from '../../../utils/warn';
import { stringifyRecordValues } from './stringify-record-values'; // --- Constants ---

var DEBOUNCE_DEPRECATED_MSG = 'Prop "filter-debounce" is deprecated. Use the debounce feature of "<b-form-input>" instead.'; // --- Props ---

export var props = {
  filter: makeProp([].concat(_toConsumableArray(PROP_TYPE_ARRAY_OBJECT_STRING), [PROP_TYPE_REG_EXP])),
  filterDebounce: makeProp(PROP_TYPE_NUMBER_STRING, 0, function (value) {
    return RX_DIGITS.test(String(value));
  }),
  filterFunction: makeProp(PROP_TYPE_FUNCTION),
  filterIgnoredFields: makeProp(PROP_TYPE_ARRAY, []),
  filterIncludedFields: makeProp(PROP_TYPE_ARRAY, [])
}; // --- Mixin ---
// @vue/component

export var filteringMixin = Vue.extend({
  props: props,
  data: function data() {
    return {
      // Flag for displaying which empty slot to show and some event triggering
      isFiltered: false,
      // Where we store the copy of the filter criteria after debouncing
      // We pre-set it with the sanitized filter value
      localFilter: this.filterSanitize(this.filter)
    };
  },
  computed: {
    computedFilterIgnored: function computedFilterIgnored() {
      return concat(this.filterIgnoredFields || []).filter(identity);
    },
    computedFilterIncluded: function computedFilterIncluded() {
      return concat(this.filterIncludedFields || []).filter(identity);
    },
    computedFilterDebounce: function computedFilterDebounce() {
      var ms = toInteger(this.filterDebounce, 0);
      /* istanbul ignore next */

      if (ms > 0) {
        warn(DEBOUNCE_DEPRECATED_MSG, NAME_TABLE);
      }

      return ms;
    },
    localFiltering: function localFiltering() {
      return this.hasProvider ? !!this.noProviderFiltering : true;
    },
    // For watching changes to `filteredItems` vs `localItems`
    filteredCheck: function filteredCheck() {
      var filteredItems = this.filteredItems,
          localItems = this.localItems,
          localFilter = this.localFilter;
      return {
        filteredItems: filteredItems,
        localItems: localItems,
        localFilter: localFilter
      };
    },
    // Sanitized/normalize filter-function prop
    localFilterFn: function localFilterFn() {
      // Return `null` to signal to use internal filter function
      var filterFunction = this.filterFunction;
      return hasPropFunction(filterFunction) ? filterFunction : null;
    },
    // Returns the records in `localItems` that match the filter criteria
    // Returns the original `localItems` array if not sorting
    filteredItems: function filteredItems() {
      // Note the criteria is debounced and sanitized
      var items = this.localItems,
          criteria = this.localFilter; // Resolve the filtering function, when requested
      // We prefer the provided filtering function and fallback to the internal one
      // When no filtering criteria is specified the filtering factories will return `null`

      var filterFn = this.localFiltering ? this.filterFnFactory(this.localFilterFn, criteria) || this.defaultFilterFnFactory(criteria) : null; // We only do local filtering when requested and there are records to filter

      return filterFn && items.length > 0 ? items.filter(filterFn) : items;
    }
  },
  watch: {
    // Watch for debounce being set to 0
    computedFilterDebounce: function computedFilterDebounce(newValue) {
      if (!newValue && this.$_filterTimer) {
        this.clearFilterTimer();
        this.localFilter = this.filterSanitize(this.filter);
      }
    },
    // Watch for changes to the filter criteria, and debounce if necessary
    filter: {
      // We need a deep watcher in case the user passes
      // an object when using `filter-function`
      deep: true,
      handler: function handler(newCriteria) {
        var _this = this;

        var timeout = this.computedFilterDebounce;
        this.clearFilterTimer();

        if (timeout && timeout > 0) {
          // If we have a debounce time, delay the update of `localFilter`
          this.$_filterTimer = setTimeout(function () {
            _this.localFilter = _this.filterSanitize(newCriteria);
          }, timeout);
        } else {
          // Otherwise, immediately update `localFilter` with `newFilter` value
          this.localFilter = this.filterSanitize(newCriteria);
        }
      }
    },
    // Watch for changes to the filter criteria and filtered items vs `localItems`
    // Set visual state and emit events as required
    filteredCheck: function filteredCheck(_ref) {
      var filteredItems = _ref.filteredItems,
          localFilter = _ref.localFilter;
      // Determine if the dataset is filtered or not
      var isFiltered = false;

      if (!localFilter) {
        // If filter criteria is falsey
        isFiltered = false;
      } else if (looseEqual(localFilter, []) || looseEqual(localFilter, {})) {
        // If filter criteria is an empty array or object
        isFiltered = false;
      } else if (localFilter) {
        // If filter criteria is truthy
        isFiltered = true;
      }

      if (isFiltered) {
        this.$emit(EVENT_NAME_FILTERED, filteredItems, filteredItems.length);
      }

      this.isFiltered = isFiltered;
    },
    isFiltered: function isFiltered(newValue, oldValue) {
      if (newValue === false && oldValue === true) {
        // We need to emit a filtered event if `isFiltered` transitions from `true` to
        // `false` so that users can update their pagination controls
        var localItems = this.localItems;
        this.$emit(EVENT_NAME_FILTERED, localItems, localItems.length);
      }
    }
  },
  created: function created() {
    var _this2 = this;

    // Create private non-reactive props
    this.$_filterTimer = null; // If filter is "pre-set", set the criteria
    // This will trigger any watchers/dependents
    // this.localFilter = this.filterSanitize(this.filter)
    // Set the initial filtered state in a `$nextTick()` so that
    // we trigger a filtered event if needed

    this.$nextTick(function () {
      _this2.isFiltered = Boolean(_this2.localFilter);
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.clearFilterTimer();
  },
  methods: {
    clearFilterTimer: function clearFilterTimer() {
      clearTimeout(this.$_filterTimer);
      this.$_filterTimer = null;
    },
    filterSanitize: function filterSanitize(criteria) {
      // Sanitizes filter criteria based on internal or external filtering
      if (this.localFiltering && !this.localFilterFn && !(isString(criteria) || isRegExp(criteria))) {
        // If using internal filter function, which only accepts string or RegExp,
        // return '' to signify no filter
        return '';
      } // Could be a string, object or array, as needed by external filter function
      // We use `cloneDeep` to ensure we have a new copy of an object or array
      // without Vue's reactive observers


      return cloneDeep(criteria);
    },
    // Filter Function factories
    filterFnFactory: function filterFnFactory(filterFn, criteria) {
      // Wrapper factory for external filter functions
      // Wrap the provided filter-function and return a new function
      // Returns `null` if no filter-function defined or if criteria is falsey
      // Rather than directly grabbing `this.computedLocalFilterFn` or `this.filterFunction`
      // we have it passed, so that the caller computed prop will be reactive to changes
      // in the original filter-function (as this routine is a method)
      if (!filterFn || !isFunction(filterFn) || !criteria || looseEqual(criteria, []) || looseEqual(criteria, {})) {
        return null;
      } // Build the wrapped filter test function, passing the criteria to the provided function


      var fn = function fn(item) {
        // Generated function returns true if the criteria matches part
        // of the serialized data, otherwise false
        return filterFn(item, criteria);
      }; // Return the wrapped function


      return fn;
    },
    defaultFilterFnFactory: function defaultFilterFnFactory(criteria) {
      var _this3 = this;

      // Generates the default filter function, using the given filter criteria
      // Returns `null` if no criteria or criteria format not supported
      if (!criteria || !(isString(criteria) || isRegExp(criteria))) {
        // Built in filter can only support strings or RegExp criteria (at the moment)
        return null;
      } // Build the RegExp needed for filtering


      var regExp = criteria;

      if (isString(regExp)) {
        // Escape special RegExp characters in the string and convert contiguous
        // whitespace to \s+ matches
        var pattern = escapeRegExp(criteria).replace(RX_SPACES, '\\s+'); // Build the RegExp (no need for global flag, as we only need
        // to find the value once in the string)

        regExp = new RegExp(".*".concat(pattern, ".*"), 'i');
      } // Generate the wrapped filter test function to use


      var fn = function fn(item) {
        // This searches all row values (and sub property values) in the entire (excluding
        // special `_` prefixed keys), because we convert the record to a space-separated
        // string containing all the value properties (recursively), even ones that are
        // not visible (not specified in this.fields)
        // Users can ignore filtering on specific fields, or on only certain fields,
        // and can optionall specify searching results of fields with formatter
        //
        // TODO: Enable searching on scoped slots (optional, as it will be SLOW)
        //
        // Generated function returns true if the criteria matches part of
        // the serialized data, otherwise false
        //
        // We set `lastIndex = 0` on the `RegExp` in case someone specifies the `/g` global flag
        regExp.lastIndex = 0;
        return regExp.test(stringifyRecordValues(item, _this3.computedFilterIgnored, _this3.computedFilterIncluded, _this3.computedFieldsObj));
      }; // Return the generated function


      return fn;
    }
  }
});