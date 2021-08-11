function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../../vue';
import { EVENT_NAME_CONTEXT_CHANGED } from '../../../constants/events';
import { PROP_TYPE_ARRAY, PROP_TYPE_STRING } from '../../../constants/props';
import { isArray, isFunction, isString } from '../../../utils/inspect';
import { looseEqual } from '../../../utils/loose-equal';
import { mathMax } from '../../../utils/math';
import { makeModelMixin } from '../../../utils/model';
import { toInteger } from '../../../utils/number';
import { clone, sortKeys } from '../../../utils/object';
import { makeProp } from '../../../utils/props';
import { normalizeFields } from './normalize-fields'; // --- Constants ---

var _makeModelMixin = makeModelMixin('value', {
  type: PROP_TYPE_ARRAY,
  defaultValue: []
}),
    modelMixin = _makeModelMixin.mixin,
    modelProps = _makeModelMixin.props,
    MODEL_PROP_NAME = _makeModelMixin.prop,
    MODEL_EVENT_NAME = _makeModelMixin.event;

export { MODEL_PROP_NAME, MODEL_EVENT_NAME }; // --- Props ---

export var props = sortKeys(_objectSpread(_objectSpread({}, modelProps), {}, _defineProperty({
  fields: makeProp(PROP_TYPE_ARRAY, null),
  // Provider mixin adds in `Function` type
  items: makeProp(PROP_TYPE_ARRAY, []),
  // Primary key for record
  // If provided the value in each row must be unique!
  primaryKey: makeProp(PROP_TYPE_STRING)
}, MODEL_PROP_NAME, makeProp(PROP_TYPE_ARRAY, [])))); // --- Mixin ---
// @vue/component

export var itemsMixin = Vue.extend({
  mixins: [modelMixin],
  props: props,
  data: function data() {
    var items = this.items;
    return {
      // Our local copy of the items
      // Must be an array
      localItems: isArray(items) ? items.slice() : []
    };
  },
  computed: {
    computedFields: function computedFields() {
      // We normalize fields into an array of objects
      // `[ { key:..., label:..., ...}, {...}, ..., {..}]`
      return normalizeFields(this.fields, this.localItems);
    },
    computedFieldsObj: function computedFieldsObj() {
      // Fields as a simple lookup hash object
      // Mainly for formatter lookup and use in `scopedSlots` for convenience
      // If the field has a formatter, it normalizes formatter to a
      // function ref or `undefined` if no formatter
      var $parent = this.$parent;
      return this.computedFields.reduce(function (obj, f) {
        // We use object spread here so we don't mutate the original field object
        obj[f.key] = clone(f);

        if (f.formatter) {
          // Normalize formatter to a function ref or `undefined`
          var formatter = f.formatter;

          if (isString(formatter) && isFunction($parent[formatter])) {
            formatter = $parent[formatter];
          } else if (!isFunction(formatter)) {
            /* istanbul ignore next */
            formatter = undefined;
          } // Return formatter function or `undefined` if none


          obj[f.key].formatter = formatter;
        }

        return obj;
      }, {});
    },
    computedItems: function computedItems() {
      // Fallback if various mixins not provided
      return (this.paginatedItems || this.sortedItems || this.filteredItems || this.localItems ||
      /* istanbul ignore next */
      []).slice();
    },
    context: function context() {
      // Current state of sorting, filtering and pagination props/values
      return {
        filter: this.localFilter,
        sortBy: this.localSortBy,
        sortDesc: this.localSortDesc,
        perPage: mathMax(toInteger(this.perPage, 0), 0),
        currentPage: mathMax(toInteger(this.currentPage, 0), 1),
        apiUrl: this.apiUrl
      };
    }
  },
  watch: {
    items: function items(newValue) {
      // Set `localItems`/`filteredItems` to a copy of the provided array
      this.localItems = isArray(newValue) ? newValue.slice() : [];
    },
    // Watch for changes on `computedItems` and update the `v-model`
    computedItems: function computedItems(newValue, oldValue) {
      if (!looseEqual(newValue, oldValue)) {
        this.$emit(MODEL_EVENT_NAME, newValue);
      }
    },
    // Watch for context changes
    context: function context(newValue, oldValue) {
      // Emit context information for external paging/filtering/sorting handling
      if (!looseEqual(newValue, oldValue)) {
        this.$emit(EVENT_NAME_CONTEXT_CHANGED, newValue);
      }
    }
  },
  mounted: function mounted() {
    // Initially update the `v-model` of displayed items
    this.$emit(MODEL_EVENT_NAME, this.computedItems);
  },
  methods: {
    // Method to get the formatter method for a given field key
    getFieldFormatter: function getFieldFormatter(key) {
      var field = this.computedFieldsObj[key]; // `this.computedFieldsObj` has pre-normalized the formatter to a
      // function ref if present, otherwise `undefined`

      return field ? field.formatter : undefined;
    }
  }
});