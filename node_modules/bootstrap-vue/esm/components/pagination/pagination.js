function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_PAGINATION } from '../../constants/components';
import { EVENT_NAME_CHANGE, EVENT_NAME_PAGE_CLICK } from '../../constants/events';
import { PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { BvEvent } from '../../utils/bv-event.class';
import { attemptFocus, isVisible } from '../../utils/dom';
import { isUndefinedOrNull } from '../../utils/inspect';
import { mathCeil, mathMax } from '../../utils/math';
import { toInteger } from '../../utils/number';
import { sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { MODEL_PROP_NAME, paginationMixin, props as paginationProps } from '../../mixins/pagination'; // --- Constants ---

var DEFAULT_PER_PAGE = 20;
var DEFAULT_TOTAL_ROWS = 0; // --- Helper methods ---
// Sanitize the provided per page number (converting to a number)

var sanitizePerPage = function sanitizePerPage(value) {
  return mathMax(toInteger(value) || DEFAULT_PER_PAGE, 1);
}; // Sanitize the provided total rows number (converting to a number)


var sanitizeTotalRows = function sanitizeTotalRows(value) {
  return mathMax(toInteger(value) || DEFAULT_TOTAL_ROWS, 0);
}; // --- Props ---


export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, paginationProps), {}, {
  ariaControls: makeProp(PROP_TYPE_STRING),
  perPage: makeProp(PROP_TYPE_NUMBER_STRING, DEFAULT_PER_PAGE),
  totalRows: makeProp(PROP_TYPE_NUMBER_STRING, DEFAULT_TOTAL_ROWS)
})), NAME_PAGINATION); // --- Main component ---
// @vue/component

export var BPagination = /*#__PURE__*/Vue.extend({
  name: NAME_PAGINATION,
  // The render function is brought in via the `paginationMixin`
  mixins: [paginationMixin],
  props: props,
  computed: {
    numberOfPages: function numberOfPages() {
      var result = mathCeil(sanitizeTotalRows(this.totalRows) / sanitizePerPage(this.perPage));
      return result < 1 ? 1 : result;
    },
    // Used for watching changes to `perPage` and `numberOfPages`
    pageSizeNumberOfPages: function pageSizeNumberOfPages() {
      return {
        perPage: sanitizePerPage(this.perPage),
        totalRows: sanitizeTotalRows(this.totalRows),
        numberOfPages: this.numberOfPages
      };
    }
  },
  watch: {
    pageSizeNumberOfPages: function pageSizeNumberOfPages(newValue, oldValue) {
      if (!isUndefinedOrNull(oldValue)) {
        if (newValue.perPage !== oldValue.perPage && newValue.totalRows === oldValue.totalRows) {
          // If the page size changes, reset to page 1
          this.currentPage = 1;
        } else if (newValue.numberOfPages !== oldValue.numberOfPages && this.currentPage > newValue.numberOfPages) {
          // If `numberOfPages` changes and is less than
          // the `currentPage` number, reset to page 1
          this.currentPage = 1;
        }
      }

      this.localNumberOfPages = newValue.numberOfPages;
    }
  },
  created: function created() {
    var _this = this;

    // Set the initial page count
    this.localNumberOfPages = this.numberOfPages; // Set the initial page value

    var currentPage = toInteger(this[MODEL_PROP_NAME], 0);

    if (currentPage > 0) {
      this.currentPage = currentPage;
    } else {
      this.$nextTick(function () {
        // If this value parses to `NaN` or a value less than `1`
        // trigger an initial emit of `null` if no page specified
        _this.currentPage = 0;
      });
    }
  },
  methods: {
    // These methods are used by the render function
    onClick: function onClick(event, pageNumber) {
      var _this2 = this;

      // Dont do anything if clicking the current active page
      if (pageNumber === this.currentPage) {
        return;
      }

      var target = event.target; // Emit a user-cancelable `page-click` event

      var clickEvt = new BvEvent(EVENT_NAME_PAGE_CLICK, {
        cancelable: true,
        vueTarget: this,
        target: target
      });
      this.$emit(clickEvt.type, clickEvt, pageNumber);

      if (clickEvt.defaultPrevented) {
        return;
      } // Update the `v-model`


      this.currentPage = pageNumber; // Emit event triggered by user interaction

      this.$emit(EVENT_NAME_CHANGE, this.currentPage); // Keep the current button focused if possible

      this.$nextTick(function () {
        if (isVisible(target) && _this2.$el.contains(target)) {
          attemptFocus(target);
        } else {
          _this2.focusCurrent();
        }
      });
    },
    makePage: function makePage(pageNum) {
      return pageNum;
    },

    /* istanbul ignore next */
    linkProps: function linkProps() {
      // No props, since we render a plain button
      return {};
    }
  }
});