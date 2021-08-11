var _watch;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_CALENDAR } from '../../constants/components';
import { CALENDAR_GREGORY, CALENDAR_LONG, CALENDAR_NARROW, CALENDAR_SHORT, DATE_FORMAT_2_DIGIT, DATE_FORMAT_NUMERIC } from '../../constants/date';
import { EVENT_NAME_CONTEXT, EVENT_NAME_SELECTED } from '../../constants/events';
import { CODE_DOWN, CODE_END, CODE_ENTER, CODE_HOME, CODE_LEFT, CODE_PAGEDOWN, CODE_PAGEUP, CODE_RIGHT, CODE_SPACE, CODE_UP } from '../../constants/key-codes';
import { PROP_TYPE_ARRAY_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_DATE_STRING, PROP_TYPE_FUNCTION, PROP_TYPE_NUMBER_STRING, PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_NAV_NEXT_DECADE, SLOT_NAME_NAV_NEXT_MONTH, SLOT_NAME_NAV_NEXT_YEAR, SLOT_NAME_NAV_PEV_DECADE, SLOT_NAME_NAV_PEV_MONTH, SLOT_NAME_NAV_PEV_YEAR, SLOT_NAME_NAV_THIS_MONTH } from '../../constants/slots';
import { arrayIncludes, concat } from '../../utils/array';
import { createDate, createDateFormatter, constrainDate as _constrainDate, datesEqual, firstDateOfMonth, formatYMD, lastDateOfMonth, oneMonthAgo, oneMonthAhead, oneYearAgo, oneYearAhead, oneDecadeAgo, oneDecadeAhead, parseYMD, resolveLocale } from '../../utils/date';
import { attemptBlur, attemptFocus, requestAF } from '../../utils/dom';
import { stopEvent } from '../../utils/events';
import { identity } from '../../utils/identity';
import { isArray, isPlainObject, isString } from '../../utils/inspect';
import { isLocaleRTL } from '../../utils/locale';
import { looseEqual } from '../../utils/loose-equal';
import { mathMax } from '../../utils/math';
import { makeModelMixin } from '../../utils/model';
import { toInteger } from '../../utils/number';
import { sortKeys } from '../../utils/object';
import { hasPropFunction, makeProp, makePropsConfigurable } from '../../utils/props';
import { toString } from '../../utils/string';
import { attrsMixin } from '../../mixins/attrs';
import { idMixin, props as idProps } from '../../mixins/id';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BIconChevronLeft, BIconChevronDoubleLeft, BIconChevronBarLeft, BIconCircleFill } from '../../icons/icons'; // --- Constants ---

var _makeModelMixin = makeModelMixin('value', {
  type: PROP_TYPE_DATE_STRING
}),
    modelMixin = _makeModelMixin.mixin,
    modelProps = _makeModelMixin.props,
    MODEL_PROP_NAME = _makeModelMixin.prop,
    MODEL_EVENT_NAME = _makeModelMixin.event; // --- Props ---


export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread({}, idProps), modelProps), {}, {
  ariaControls: makeProp(PROP_TYPE_STRING),
  // Makes calendar the full width of its parent container
  block: makeProp(PROP_TYPE_BOOLEAN, false),
  dateDisabledFn: makeProp(PROP_TYPE_FUNCTION),
  // `Intl.DateTimeFormat` object
  dateFormatOptions: makeProp(PROP_TYPE_OBJECT, {
    year: DATE_FORMAT_NUMERIC,
    month: CALENDAR_LONG,
    day: DATE_FORMAT_NUMERIC,
    weekday: CALENDAR_LONG
  }),
  // Function to set a class of (classes) on the date cell
  // if passed a string or an array
  // TODO:
  //   If the function returns an object, look for class prop for classes,
  //   and other props for handling events/details/descriptions
  dateInfoFn: makeProp(PROP_TYPE_FUNCTION),
  // 'ltr', 'rtl', or `null` (for auto detect)
  direction: makeProp(PROP_TYPE_STRING),
  disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  // When `true`, renders a comment node, but keeps the component instance active
  // Mainly for <b-form-date>, so that we can get the component's value and locale
  // But we might just use separate date formatters, using the resolved locale
  // (adjusted for the gregorian calendar)
  hidden: makeProp(PROP_TYPE_BOOLEAN, false),
  // When `true` makes the selected date header `sr-only`
  hideHeader: makeProp(PROP_TYPE_BOOLEAN, false),
  // This specifies the calendar year/month/day that will be shown when
  // first opening the datepicker if no v-model value is provided
  // Default is the current date (or `min`/`max`)
  initialDate: makeProp(PROP_TYPE_DATE_STRING),
  // Labels for buttons and keyboard shortcuts
  labelCalendar: makeProp(PROP_TYPE_STRING, 'Calendar'),
  labelCurrentMonth: makeProp(PROP_TYPE_STRING, 'Current month'),
  labelHelp: makeProp(PROP_TYPE_STRING, 'Use cursor keys to navigate calendar dates'),
  labelNav: makeProp(PROP_TYPE_STRING, 'Calendar navigation'),
  labelNextDecade: makeProp(PROP_TYPE_STRING, 'Next decade'),
  labelNextMonth: makeProp(PROP_TYPE_STRING, 'Next month'),
  labelNextYear: makeProp(PROP_TYPE_STRING, 'Next year'),
  labelNoDateSelected: makeProp(PROP_TYPE_STRING, 'No date selected'),
  labelPrevDecade: makeProp(PROP_TYPE_STRING, 'Previous decade'),
  labelPrevMonth: makeProp(PROP_TYPE_STRING, 'Previous month'),
  labelPrevYear: makeProp(PROP_TYPE_STRING, 'Previous year'),
  labelSelected: makeProp(PROP_TYPE_STRING, 'Selected date'),
  labelToday: makeProp(PROP_TYPE_STRING, 'Today'),
  // Locale(s) to use
  // Default is to use page/browser default setting
  locale: makeProp(PROP_TYPE_ARRAY_STRING),
  max: makeProp(PROP_TYPE_DATE_STRING),
  min: makeProp(PROP_TYPE_DATE_STRING),
  // Variant color to use for the navigation buttons
  navButtonVariant: makeProp(PROP_TYPE_STRING, 'secondary'),
  // Disable highlighting today's date
  noHighlightToday: makeProp(PROP_TYPE_BOOLEAN, false),
  noKeyNav: makeProp(PROP_TYPE_BOOLEAN, false),
  readonly: makeProp(PROP_TYPE_BOOLEAN, false),
  roleDescription: makeProp(PROP_TYPE_STRING),
  // Variant color to use for the selected date
  selectedVariant: makeProp(PROP_TYPE_STRING, 'primary'),
  // When `true` enables the decade navigation buttons
  showDecadeNav: makeProp(PROP_TYPE_BOOLEAN, false),
  // Day of week to start calendar on
  // `0` (Sunday), `1` (Monday), ... `6` (Saturday)
  startWeekday: makeProp(PROP_TYPE_NUMBER_STRING, 0),
  // Variant color to use for today's date (defaults to `selectedVariant`)
  todayVariant: makeProp(PROP_TYPE_STRING),
  // Always return the `v-model` value as a date object
  valueAsDate: makeProp(PROP_TYPE_BOOLEAN, false),
  // Format of the weekday names at the top of the calendar
  // `short` is typically a 3 letter abbreviation,
  // `narrow` is typically a single letter
  // `long` is the full week day name
  // Although some locales may override this (i.e `ar`, etc.)
  weekdayHeaderFormat: makeProp(PROP_TYPE_STRING, CALENDAR_SHORT, function (value) {
    return arrayIncludes([CALENDAR_LONG, CALENDAR_SHORT, CALENDAR_NARROW], value);
  }),
  // Has no effect if prop `block` is set
  width: makeProp(PROP_TYPE_STRING, '270px')
})), NAME_CALENDAR); // --- Main component ---
// @vue/component

export var BCalendar = Vue.extend({
  name: NAME_CALENDAR,
  // Mixin order is important!
  mixins: [attrsMixin, idMixin, modelMixin, normalizeSlotMixin],
  props: props,
  data: function data() {
    var selected = formatYMD(this[MODEL_PROP_NAME]) || '';
    return {
      // Selected date
      selectedYMD: selected,
      // Date in calendar grid that has `tabindex` of `0`
      activeYMD: selected || formatYMD(_constrainDate(this.initialDate || this.getToday()), this.min, this.max),
      // Will be true if the calendar grid has/contains focus
      gridHasFocus: false,
      // Flag to enable the `aria-live` region(s) after mount
      // to prevent screen reader "outbursts" when mounting
      isLive: false
    };
  },
  computed: {
    valueId: function valueId() {
      return this.safeId();
    },
    widgetId: function widgetId() {
      return this.safeId('_calendar-wrapper_');
    },
    navId: function navId() {
      return this.safeId('_calendar-nav_');
    },
    gridId: function gridId() {
      return this.safeId('_calendar-grid_');
    },
    gridCaptionId: function gridCaptionId() {
      return this.safeId('_calendar-grid-caption_');
    },
    gridHelpId: function gridHelpId() {
      return this.safeId('_calendar-grid-help_');
    },
    activeId: function activeId() {
      return this.activeYMD ? this.safeId("_cell-".concat(this.activeYMD, "_")) : null;
    },
    // TODO: Use computed props to convert `YYYY-MM-DD` to `Date` object
    selectedDate: function selectedDate() {
      // Selected as a `Date` object
      return parseYMD(this.selectedYMD);
    },
    activeDate: function activeDate() {
      // Active as a `Date` object
      return parseYMD(this.activeYMD);
    },
    computedMin: function computedMin() {
      return parseYMD(this.min);
    },
    computedMax: function computedMax() {
      return parseYMD(this.max);
    },
    computedWeekStarts: function computedWeekStarts() {
      // `startWeekday` is a prop (constrained to `0` through `6`)
      return mathMax(toInteger(this.startWeekday, 0), 0) % 7;
    },
    computedLocale: function computedLocale() {
      // Returns the resolved locale used by the calendar
      return resolveLocale(concat(this.locale).filter(identity), CALENDAR_GREGORY);
    },
    computedDateDisabledFn: function computedDateDisabledFn() {
      var dateDisabledFn = this.dateDisabledFn;
      return hasPropFunction(dateDisabledFn) ? dateDisabledFn : function () {
        return false;
      };
    },
    // TODO: Change `dateInfoFn` to handle events and notes as well as classes
    computedDateInfoFn: function computedDateInfoFn() {
      var dateInfoFn = this.dateInfoFn;
      return hasPropFunction(dateInfoFn) ? dateInfoFn : function () {
        return {};
      };
    },
    calendarLocale: function calendarLocale() {
      // This locale enforces the gregorian calendar (for use in formatter functions)
      // Needed because IE 11 resolves `ar-IR` as islamic-civil calendar
      // and IE 11 (and some other browsers) do not support the `calendar` option
      // And we currently only support the gregorian calendar
      var fmt = new Intl.DateTimeFormat(this.computedLocale, {
        calendar: CALENDAR_GREGORY
      });
      var calendar = fmt.resolvedOptions().calendar;
      var locale = fmt.resolvedOptions().locale;
      /* istanbul ignore if: mainly for IE 11 and a few other browsers, hard to test in JSDOM */

      if (calendar !== CALENDAR_GREGORY) {
        // Ensure the locale requests the gregorian calendar
        // Mainly for IE 11, and currently we can't handle non-gregorian calendars
        // TODO: Should we always return this value?
        locale = locale.replace(/-u-.+$/i, '').concat('-u-ca-gregory');
      }

      return locale;
    },
    calendarYear: function calendarYear() {
      return this.activeDate.getFullYear();
    },
    calendarMonth: function calendarMonth() {
      return this.activeDate.getMonth();
    },
    calendarFirstDay: function calendarFirstDay() {
      // We set the time for this date to 12pm to work around
      // date formatting issues in Firefox and Safari
      // See: https://github.com/bootstrap-vue/bootstrap-vue/issues/5818
      return createDate(this.calendarYear, this.calendarMonth, 1, 12);
    },
    calendarDaysInMonth: function calendarDaysInMonth() {
      // We create a new date as to not mutate the original
      var date = createDate(this.calendarFirstDay);
      date.setMonth(date.getMonth() + 1, 0);
      return date.getDate();
    },
    computedVariant: function computedVariant() {
      return "btn-".concat(this.selectedVariant || 'primary');
    },
    computedTodayVariant: function computedTodayVariant() {
      return "btn-outline-".concat(this.todayVariant || this.selectedVariant || 'primary');
    },
    computedNavButtonVariant: function computedNavButtonVariant() {
      return "btn-outline-".concat(this.navButtonVariant || 'primary');
    },
    isRTL: function isRTL() {
      // `true` if the language requested is RTL
      var dir = toString(this.direction).toLowerCase();

      if (dir === 'rtl') {
        /* istanbul ignore next */
        return true;
      } else if (dir === 'ltr') {
        /* istanbul ignore next */
        return false;
      }

      return isLocaleRTL(this.computedLocale);
    },
    context: function context() {
      var selectedYMD = this.selectedYMD,
          activeYMD = this.activeYMD;
      var selectedDate = parseYMD(selectedYMD);
      var activeDate = parseYMD(activeYMD);
      return {
        // The current value of the `v-model`
        selectedYMD: selectedYMD,
        selectedDate: selectedDate,
        selectedFormatted: selectedDate ? this.formatDateString(selectedDate) : this.labelNoDateSelected,
        // Which date cell is considered active due to navigation
        activeYMD: activeYMD,
        activeDate: activeDate,
        activeFormatted: activeDate ? this.formatDateString(activeDate) : '',
        // `true` if the date is disabled (when using keyboard navigation)
        disabled: this.dateDisabled(activeDate),
        // Locales used in formatting dates
        locale: this.computedLocale,
        calendarLocale: this.calendarLocale,
        rtl: this.isRTL
      };
    },
    // Computed props that return a function reference
    dateOutOfRange: function dateOutOfRange() {
      // Check whether a date is within the min/max range
      // Returns a new function ref if the pops change
      // We do this as we need to trigger the calendar computed prop
      // to update when these props update
      var min = this.computedMin,
          max = this.computedMax;
      return function (date) {
        // Handle both `YYYY-MM-DD` and `Date` objects
        date = parseYMD(date);
        return min && date < min || max && date > max;
      };
    },
    dateDisabled: function dateDisabled() {
      var _this = this;

      // Returns a function for validating if a date is within range
      // We grab this variables first to ensure a new function ref
      // is generated when the props value changes
      // We do this as we need to trigger the calendar computed prop
      // to update when these props update
      var rangeFn = this.dateOutOfRange; // Return the function ref

      return function (date) {
        // Handle both `YYYY-MM-DD` and `Date` objects
        date = parseYMD(date);
        var ymd = formatYMD(date);
        return !!(rangeFn(date) || _this.computedDateDisabledFn(ymd, date));
      };
    },
    // Computed props that return date formatter functions
    formatDateString: function formatDateString() {
      // Returns a date formatter function
      return createDateFormatter(this.calendarLocale, _objectSpread(_objectSpread({
        // Ensure we have year, month, day shown for screen readers/ARIA
        // If users really want to leave one of these out, they can
        // pass `undefined` for the property value
        year: DATE_FORMAT_NUMERIC,
        month: DATE_FORMAT_2_DIGIT,
        day: DATE_FORMAT_2_DIGIT
      }, this.dateFormatOptions), {}, {
        // Ensure hours/minutes/seconds are not shown
        // As we do not support the time portion (yet)
        hour: undefined,
        minute: undefined,
        second: undefined,
        // Ensure calendar is gregorian
        calendar: CALENDAR_GREGORY
      }));
    },
    formatYearMonth: function formatYearMonth() {
      // Returns a date formatter function
      return createDateFormatter(this.calendarLocale, {
        year: DATE_FORMAT_NUMERIC,
        month: CALENDAR_LONG,
        calendar: CALENDAR_GREGORY
      });
    },
    formatWeekdayName: function formatWeekdayName() {
      // Long weekday name for weekday header aria-label
      return createDateFormatter(this.calendarLocale, {
        weekday: CALENDAR_LONG,
        calendar: CALENDAR_GREGORY
      });
    },
    formatWeekdayNameShort: function formatWeekdayNameShort() {
      // Weekday header cell format
      // defaults to 'short' 3 letter days, where possible
      return createDateFormatter(this.calendarLocale, {
        weekday: this.weekdayHeaderFormat || CALENDAR_SHORT,
        calendar: CALENDAR_GREGORY
      });
    },
    formatDay: function formatDay() {
      // Calendar grid day number formatter
      // We don't use DateTimeFormatter here as it can place extra
      // character(s) after the number (i.e the `zh` locale)
      var nf = new Intl.NumberFormat([this.computedLocale], {
        style: 'decimal',
        minimumIntegerDigits: 1,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        notation: 'standard'
      }); // Return a formatter function instance

      return function (date) {
        return nf.format(date.getDate());
      };
    },
    // Disabled states for the nav buttons
    prevDecadeDisabled: function prevDecadeDisabled() {
      var min = this.computedMin;
      return this.disabled || min && lastDateOfMonth(oneDecadeAgo(this.activeDate)) < min;
    },
    prevYearDisabled: function prevYearDisabled() {
      var min = this.computedMin;
      return this.disabled || min && lastDateOfMonth(oneYearAgo(this.activeDate)) < min;
    },
    prevMonthDisabled: function prevMonthDisabled() {
      var min = this.computedMin;
      return this.disabled || min && lastDateOfMonth(oneMonthAgo(this.activeDate)) < min;
    },
    thisMonthDisabled: function thisMonthDisabled() {
      // TODO: We could/should check if today is out of range
      return this.disabled;
    },
    nextMonthDisabled: function nextMonthDisabled() {
      var max = this.computedMax;
      return this.disabled || max && firstDateOfMonth(oneMonthAhead(this.activeDate)) > max;
    },
    nextYearDisabled: function nextYearDisabled() {
      var max = this.computedMax;
      return this.disabled || max && firstDateOfMonth(oneYearAhead(this.activeDate)) > max;
    },
    nextDecadeDisabled: function nextDecadeDisabled() {
      var max = this.computedMax;
      return this.disabled || max && firstDateOfMonth(oneDecadeAhead(this.activeDate)) > max;
    },
    // Calendar dates generation
    calendar: function calendar() {
      var matrix = [];
      var firstDay = this.calendarFirstDay;
      var calendarYear = firstDay.getFullYear();
      var calendarMonth = firstDay.getMonth();
      var daysInMonth = this.calendarDaysInMonth;
      var startIndex = firstDay.getDay(); // `0`..`6`

      var weekOffset = (this.computedWeekStarts > startIndex ? 7 : 0) - this.computedWeekStarts; // Build the calendar matrix

      var currentDay = 0 - weekOffset - startIndex;

      for (var week = 0; week < 6 && currentDay < daysInMonth; week++) {
        // For each week
        matrix[week] = []; // The following could be a map function

        for (var j = 0; j < 7; j++) {
          // For each day in week
          currentDay++;
          var date = createDate(calendarYear, calendarMonth, currentDay);
          var month = date.getMonth();
          var dayYMD = formatYMD(date);
          var dayDisabled = this.dateDisabled(date); // TODO: This could be a normalizer method

          var dateInfo = this.computedDateInfoFn(dayYMD, parseYMD(dayYMD));
          dateInfo = isString(dateInfo) || isArray(dateInfo) ?
          /* istanbul ignore next */
          {
            class: dateInfo
          } : isPlainObject(dateInfo) ? _objectSpread({
            class: ''
          }, dateInfo) :
          /* istanbul ignore next */
          {
            class: ''
          };
          matrix[week].push({
            ymd: dayYMD,
            // Cell content
            day: this.formatDay(date),
            label: this.formatDateString(date),
            // Flags for styling
            isThisMonth: month === calendarMonth,
            isDisabled: dayDisabled,
            // TODO: Handle other dateInfo properties such as notes/events
            info: dateInfo
          });
        }
      }

      return matrix;
    },
    calendarHeadings: function calendarHeadings() {
      var _this2 = this;

      return this.calendar[0].map(function (d) {
        return {
          text: _this2.formatWeekdayNameShort(parseYMD(d.ymd)),
          label: _this2.formatWeekdayName(parseYMD(d.ymd))
        };
      });
    }
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME, function (newValue, oldValue) {
    var selected = formatYMD(newValue) || '';
    var old = formatYMD(oldValue) || '';

    if (!datesEqual(selected, old)) {
      this.activeYMD = selected || this.activeYMD;
      this.selectedYMD = selected;
    }
  }), _defineProperty(_watch, "selectedYMD", function selectedYMD(newYMD, oldYMD) {
    // TODO:
    //   Should we compare to `formatYMD(this.value)` and emit
    //   only if they are different?
    if (newYMD !== oldYMD) {
      this.$emit(MODEL_EVENT_NAME, this.valueAsDate ? parseYMD(newYMD) || null : newYMD || '');
    }
  }), _defineProperty(_watch, "context", function context(newValue, oldValue) {
    if (!looseEqual(newValue, oldValue)) {
      this.$emit(EVENT_NAME_CONTEXT, newValue);
    }
  }), _defineProperty(_watch, "hidden", function hidden(newValue) {
    // Reset the active focused day when hidden
    this.activeYMD = this.selectedYMD || formatYMD(this[MODEL_PROP_NAME] || this.constrainDate(this.initialDate || this.getToday())); // Enable/disable the live regions

    this.setLive(!newValue);
  }), _watch),
  created: function created() {
    var _this3 = this;

    this.$nextTick(function () {
      _this3.$emit(EVENT_NAME_CONTEXT, _this3.context);
    });
  },
  mounted: function mounted() {
    this.setLive(true);
  },

  /* istanbul ignore next */
  activated: function activated() {
    this.setLive(true);
  },

  /* istanbul ignore next */
  deactivated: function deactivated() {
    this.setLive(false);
  },
  beforeDestroy: function beforeDestroy() {
    this.setLive(false);
  },
  methods: {
    // Public method(s)
    focus: function focus() {
      if (!this.disabled) {
        attemptFocus(this.$refs.grid);
      }
    },
    blur: function blur() {
      if (!this.disabled) {
        attemptBlur(this.$refs.grid);
      }
    },
    // Private methods
    setLive: function setLive(on) {
      var _this4 = this;

      if (on) {
        this.$nextTick(function () {
          requestAF(function () {
            _this4.isLive = true;
          });
        });
      } else {
        this.isLive = false;
      }
    },
    getToday: function getToday() {
      return parseYMD(createDate());
    },
    constrainDate: function constrainDate(date) {
      // Constrains a date between min and max
      // returns a new `Date` object instance
      return _constrainDate(date, this.computedMin, this.computedMax);
    },
    emitSelected: function emitSelected(date) {
      var _this5 = this;

      // Performed in a `$nextTick()` to (probably) ensure
      // the input event has emitted first
      this.$nextTick(function () {
        _this5.$emit(EVENT_NAME_SELECTED, formatYMD(date) || '', parseYMD(date) || null);
      });
    },
    // Event handlers
    setGridFocusFlag: function setGridFocusFlag(event) {
      // Sets the gridHasFocus flag to make date "button" look focused
      this.gridHasFocus = !this.disabled && event.type === 'focus';
    },
    onKeydownWrapper: function onKeydownWrapper(event) {
      // Calendar keyboard navigation
      // Handles PAGEUP/PAGEDOWN/END/HOME/LEFT/UP/RIGHT/DOWN
      // Focuses grid after updating
      if (this.noKeyNav) {
        /* istanbul ignore next */
        return;
      }

      var altKey = event.altKey,
          ctrlKey = event.ctrlKey,
          keyCode = event.keyCode;

      if (!arrayIncludes([CODE_PAGEUP, CODE_PAGEDOWN, CODE_END, CODE_HOME, CODE_LEFT, CODE_UP, CODE_RIGHT, CODE_DOWN], keyCode)) {
        /* istanbul ignore next */
        return;
      }

      stopEvent(event);
      var activeDate = createDate(this.activeDate);
      var checkDate = createDate(this.activeDate);
      var day = activeDate.getDate();
      var constrainedToday = this.constrainDate(this.getToday());
      var isRTL = this.isRTL;

      if (keyCode === CODE_PAGEUP) {
        // PAGEUP - Previous month/year
        activeDate = (altKey ? ctrlKey ? oneDecadeAgo : oneYearAgo : oneMonthAgo)(activeDate); // We check the first day of month to be in rage

        checkDate = createDate(activeDate);
        checkDate.setDate(1);
      } else if (keyCode === CODE_PAGEDOWN) {
        // PAGEDOWN - Next month/year
        activeDate = (altKey ? ctrlKey ? oneDecadeAhead : oneYearAhead : oneMonthAhead)(activeDate); // We check the last day of month to be in rage

        checkDate = createDate(activeDate);
        checkDate.setMonth(checkDate.getMonth() + 1);
        checkDate.setDate(0);
      } else if (keyCode === CODE_LEFT) {
        // LEFT - Previous day (or next day for RTL)
        activeDate.setDate(day + (isRTL ? 1 : -1));
        activeDate = this.constrainDate(activeDate);
        checkDate = activeDate;
      } else if (keyCode === CODE_RIGHT) {
        // RIGHT - Next day (or previous day for RTL)
        activeDate.setDate(day + (isRTL ? -1 : 1));
        activeDate = this.constrainDate(activeDate);
        checkDate = activeDate;
      } else if (keyCode === CODE_UP) {
        // UP - Previous week
        activeDate.setDate(day - 7);
        activeDate = this.constrainDate(activeDate);
        checkDate = activeDate;
      } else if (keyCode === CODE_DOWN) {
        // DOWN - Next week
        activeDate.setDate(day + 7);
        activeDate = this.constrainDate(activeDate);
        checkDate = activeDate;
      } else if (keyCode === CODE_HOME) {
        // HOME - Today
        activeDate = constrainedToday;
        checkDate = activeDate;
      } else if (keyCode === CODE_END) {
        // END - Selected date, or today if no selected date
        activeDate = parseYMD(this.selectedDate) || constrainedToday;
        checkDate = activeDate;
      }

      if (!this.dateOutOfRange(checkDate) && !datesEqual(activeDate, this.activeDate)) {
        // We only jump to date if within min/max
        // We don't check for individual disabled dates though (via user function)
        this.activeYMD = formatYMD(activeDate);
      } // Ensure grid is focused


      this.focus();
    },
    onKeydownGrid: function onKeydownGrid(event) {
      // Pressing enter/space on grid to select active date
      var keyCode = event.keyCode;
      var activeDate = this.activeDate;

      if (keyCode === CODE_ENTER || keyCode === CODE_SPACE) {
        stopEvent(event);

        if (!this.disabled && !this.readonly && !this.dateDisabled(activeDate)) {
          this.selectedYMD = formatYMD(activeDate);
          this.emitSelected(activeDate);
        } // Ensure grid is focused


        this.focus();
      }
    },
    onClickDay: function onClickDay(day) {
      // Clicking on a date "button" to select it
      var selectedDate = this.selectedDate,
          activeDate = this.activeDate;
      var clickedDate = parseYMD(day.ymd);

      if (!this.disabled && !day.isDisabled && !this.dateDisabled(clickedDate)) {
        if (!this.readonly) {
          // If readonly mode, we don't set the selected date, just the active date
          // If the clicked date is equal to the already selected date, we don't update the model
          this.selectedYMD = formatYMD(datesEqual(clickedDate, selectedDate) ? selectedDate : clickedDate);
          this.emitSelected(clickedDate);
        }

        this.activeYMD = formatYMD(datesEqual(clickedDate, activeDate) ? activeDate : createDate(clickedDate)); // Ensure grid is focused

        this.focus();
      }
    },
    gotoPrevDecade: function gotoPrevDecade() {
      this.activeYMD = formatYMD(this.constrainDate(oneDecadeAgo(this.activeDate)));
    },
    gotoPrevYear: function gotoPrevYear() {
      this.activeYMD = formatYMD(this.constrainDate(oneYearAgo(this.activeDate)));
    },
    gotoPrevMonth: function gotoPrevMonth() {
      this.activeYMD = formatYMD(this.constrainDate(oneMonthAgo(this.activeDate)));
    },
    gotoCurrentMonth: function gotoCurrentMonth() {
      // TODO: Maybe this goto date should be configurable?
      this.activeYMD = formatYMD(this.constrainDate(this.getToday()));
    },
    gotoNextMonth: function gotoNextMonth() {
      this.activeYMD = formatYMD(this.constrainDate(oneMonthAhead(this.activeDate)));
    },
    gotoNextYear: function gotoNextYear() {
      this.activeYMD = formatYMD(this.constrainDate(oneYearAhead(this.activeDate)));
    },
    gotoNextDecade: function gotoNextDecade() {
      this.activeYMD = formatYMD(this.constrainDate(oneDecadeAhead(this.activeDate)));
    },
    onHeaderClick: function onHeaderClick() {
      if (!this.disabled) {
        this.activeYMD = this.selectedYMD || formatYMD(this.getToday());
        this.focus();
      }
    }
  },
  render: function render(h) {
    var _this6 = this;

    // If `hidden` prop is set, render just a placeholder node
    if (this.hidden) {
      return h();
    }

    var valueId = this.valueId,
        widgetId = this.widgetId,
        navId = this.navId,
        gridId = this.gridId,
        gridCaptionId = this.gridCaptionId,
        gridHelpId = this.gridHelpId,
        activeId = this.activeId,
        disabled = this.disabled,
        noKeyNav = this.noKeyNav,
        isLive = this.isLive,
        isRTL = this.isRTL,
        activeYMD = this.activeYMD,
        selectedYMD = this.selectedYMD,
        safeId = this.safeId;
    var hideDecadeNav = !this.showDecadeNav;
    var todayYMD = formatYMD(this.getToday());
    var highlightToday = !this.noHighlightToday; // Header showing current selected date

    var $header = h('output', {
      staticClass: 'form-control form-control-sm text-center',
      class: {
        'text-muted': disabled,
        readonly: this.readonly || disabled
      },
      attrs: {
        id: valueId,
        for: gridId,
        role: 'status',
        tabindex: disabled ? null : '-1',
        // Mainly for testing purposes, as we do not know
        // the exact format `Intl` will format the date string
        'data-selected': toString(selectedYMD),
        // We wait until after mount to enable `aria-live`
        // to prevent initial announcement on page render
        'aria-live': isLive ? 'polite' : 'off',
        'aria-atomic': isLive ? 'true' : null
      },
      on: {
        // Transfer focus/click to focus grid
        // and focus active date (or today if no selection)
        click: this.onHeaderClick,
        focus: this.onHeaderClick
      }
    }, this.selectedDate ? [// We use `bdi` elements here in case the label doesn't match the locale
    // Although IE 11 does not deal with <BDI> at all (equivalent to a span)
    h('bdi', {
      staticClass: 'sr-only'
    }, " (".concat(toString(this.labelSelected), ") ")), h('bdi', this.formatDateString(this.selectedDate))] : this.labelNoDateSelected || "\xA0" // '&nbsp;'
    );
    $header = h('header', {
      staticClass: 'b-calendar-header',
      class: {
        'sr-only': this.hideHeader
      },
      attrs: {
        title: this.selectedDate ? this.labelSelectedDate || null : null
      }
    }, [$header]); // Content for the date navigation buttons

    var navScope = {
      isRTL: isRTL
    };
    var navProps = {
      shiftV: 0.5
    };

    var navPrevProps = _objectSpread(_objectSpread({}, navProps), {}, {
      flipH: isRTL
    });

    var navNextProps = _objectSpread(_objectSpread({}, navProps), {}, {
      flipH: !isRTL
    });

    var $prevDecadeIcon = this.normalizeSlot(SLOT_NAME_NAV_PEV_DECADE, navScope) || h(BIconChevronBarLeft, {
      props: navPrevProps
    });
    var $prevYearIcon = this.normalizeSlot(SLOT_NAME_NAV_PEV_YEAR, navScope) || h(BIconChevronDoubleLeft, {
      props: navPrevProps
    });
    var $prevMonthIcon = this.normalizeSlot(SLOT_NAME_NAV_PEV_MONTH, navScope) || h(BIconChevronLeft, {
      props: navPrevProps
    });
    var $thisMonthIcon = this.normalizeSlot(SLOT_NAME_NAV_THIS_MONTH, navScope) || h(BIconCircleFill, {
      props: navProps
    });
    var $nextMonthIcon = this.normalizeSlot(SLOT_NAME_NAV_NEXT_MONTH, navScope) || h(BIconChevronLeft, {
      props: navNextProps
    });
    var $nextYearIcon = this.normalizeSlot(SLOT_NAME_NAV_NEXT_YEAR, navScope) || h(BIconChevronDoubleLeft, {
      props: navNextProps
    });
    var $nextDecadeIcon = this.normalizeSlot(SLOT_NAME_NAV_NEXT_DECADE, navScope) || h(BIconChevronBarLeft, {
      props: navNextProps
    }); // Utility to create the date navigation buttons

    var makeNavBtn = function makeNavBtn(content, label, handler, btnDisabled, shortcut) {
      return h('button', {
        staticClass: 'btn btn-sm border-0 flex-fill',
        class: [_this6.computedNavButtonVariant, {
          disabled: btnDisabled
        }],
        attrs: {
          title: label || null,
          type: 'button',
          tabindex: noKeyNav ? '-1' : null,
          'aria-label': label || null,
          'aria-disabled': btnDisabled ? 'true' : null,
          'aria-keyshortcuts': shortcut || null
        },
        on: btnDisabled ? {} : {
          click: handler
        }
      }, [h('div', {
        attrs: {
          'aria-hidden': 'true'
        }
      }, [content])]);
    }; // Generate the date navigation buttons


    var $nav = h('div', {
      staticClass: 'b-calendar-nav d-flex',
      attrs: {
        id: navId,
        role: 'group',
        tabindex: noKeyNav ? '-1' : null,
        'aria-hidden': disabled ? 'true' : null,
        'aria-label': this.labelNav || null,
        'aria-controls': gridId
      }
    }, [hideDecadeNav ? h() : makeNavBtn($prevDecadeIcon, this.labelPrevDecade, this.gotoPrevDecade, this.prevDecadeDisabled, 'Ctrl+Alt+PageDown'), makeNavBtn($prevYearIcon, this.labelPrevYear, this.gotoPrevYear, this.prevYearDisabled, 'Alt+PageDown'), makeNavBtn($prevMonthIcon, this.labelPrevMonth, this.gotoPrevMonth, this.prevMonthDisabled, 'PageDown'), makeNavBtn($thisMonthIcon, this.labelCurrentMonth, this.gotoCurrentMonth, this.thisMonthDisabled, 'Home'), makeNavBtn($nextMonthIcon, this.labelNextMonth, this.gotoNextMonth, this.nextMonthDisabled, 'PageUp'), makeNavBtn($nextYearIcon, this.labelNextYear, this.gotoNextYear, this.nextYearDisabled, 'Alt+PageUp'), hideDecadeNav ? h() : makeNavBtn($nextDecadeIcon, this.labelNextDecade, this.gotoNextDecade, this.nextDecadeDisabled, 'Ctrl+Alt+PageUp')]); // Caption for calendar grid

    var $gridCaption = h('header', {
      staticClass: 'b-calendar-grid-caption text-center font-weight-bold',
      class: {
        'text-muted': disabled
      },
      attrs: {
        id: gridCaptionId,
        'aria-live': isLive ? 'polite' : null,
        'aria-atomic': isLive ? 'true' : null
      },
      key: 'grid-caption'
    }, this.formatYearMonth(this.calendarFirstDay)); // Calendar weekday headings

    var $gridWeekDays = h('div', {
      staticClass: 'b-calendar-grid-weekdays row no-gutters border-bottom',
      attrs: {
        'aria-hidden': 'true'
      }
    }, this.calendarHeadings.map(function (d, idx) {
      return h('small', {
        staticClass: 'col text-truncate',
        class: {
          'text-muted': disabled
        },
        attrs: {
          title: d.label === d.text ? null : d.label,
          'aria-label': d.label
        },
        key: idx
      }, d.text);
    })); // Calendar day grid

    var $gridBody = this.calendar.map(function (week) {
      var $cells = week.map(function (day, dIndex) {
        var _class;

        var isSelected = day.ymd === selectedYMD;
        var isActive = day.ymd === activeYMD;
        var isToday = day.ymd === todayYMD;
        var idCell = safeId("_cell-".concat(day.ymd, "_")); // "fake" button

        var $btn = h('span', {
          staticClass: 'btn border-0 rounded-circle text-nowrap',
          // Should we add some classes to signify if today/selected/etc?
          class: (_class = {
            // Give the fake button a focus ring
            focus: isActive && _this6.gridHasFocus,
            // Styling
            disabled: day.isDisabled || disabled,
            active: isSelected
          }, _defineProperty(_class, _this6.computedVariant, isSelected), _defineProperty(_class, _this6.computedTodayVariant, isToday && highlightToday && !isSelected && day.isThisMonth), _defineProperty(_class, 'btn-outline-light', !(isToday && highlightToday) && !isSelected && !isActive), _defineProperty(_class, 'btn-light', !(isToday && highlightToday) && !isSelected && isActive), _defineProperty(_class, 'text-muted', !day.isThisMonth && !isSelected), _defineProperty(_class, 'text-dark', !(isToday && highlightToday) && !isSelected && !isActive && day.isThisMonth), _defineProperty(_class, 'font-weight-bold', (isSelected || day.isThisMonth) && !day.isDisabled), _class),
          on: {
            click: function click() {
              return _this6.onClickDay(day);
            }
          }
        }, day.day);
        return h('div', // Cell with button
        {
          staticClass: 'col p-0',
          class: day.isDisabled ? 'bg-light' : day.info.class || '',
          attrs: {
            id: idCell,
            role: 'button',
            'data-date': day.ymd,
            // Primarily for testing purposes
            // Only days in the month are presented as buttons to screen readers
            'aria-hidden': day.isThisMonth ? null : 'true',
            'aria-disabled': day.isDisabled || disabled ? 'true' : null,
            'aria-label': [day.label, isSelected ? "(".concat(_this6.labelSelected, ")") : null, isToday ? "(".concat(_this6.labelToday, ")") : null].filter(identity).join(' '),
            // NVDA doesn't convey `aria-selected`, but does `aria-current`,
            // ChromeVox doesn't convey `aria-current`, but does `aria-selected`,
            // so we set both attributes for robustness
            'aria-selected': isSelected ? 'true' : null,
            'aria-current': isSelected ? 'date' : null
          },
          key: dIndex
        }, [$btn]);
      }); // Return the week "row"
      // We use the first day of the weeks YMD value as a
      // key for efficient DOM patching / element re-use

      return h('div', {
        staticClass: 'row no-gutters',
        key: week[0].ymd
      }, $cells);
    });
    $gridBody = h('div', {
      // A key is only required on the body if we add in transition support
      staticClass: 'b-calendar-grid-body',
      style: disabled ? {
        pointerEvents: 'none'
      } : {} // key: this.activeYMD.slice(0, -3)

    }, $gridBody);
    var $gridHelp = h('footer', {
      staticClass: 'b-calendar-grid-help border-top small text-muted text-center bg-light',
      attrs: {
        id: gridHelpId
      }
    }, [h('div', {
      staticClass: 'small'
    }, this.labelHelp)]);
    var $grid = h('div', {
      staticClass: 'b-calendar-grid form-control h-auto text-center',
      attrs: {
        id: gridId,
        role: 'application',
        tabindex: noKeyNav ? '-1' : disabled ? null : '0',
        'data-month': activeYMD.slice(0, -3),
        // `YYYY-MM`, mainly for testing
        'aria-roledescription': this.labelCalendar || null,
        'aria-labelledby': gridCaptionId,
        'aria-describedby': gridHelpId,
        // `aria-readonly` is not considered valid on `role="application"`
        // https://www.w3.org/TR/wai-aria-1.1/#aria-readonly
        // 'aria-readonly': this.readonly && !disabled ? 'true' : null,
        'aria-disabled': disabled ? 'true' : null,
        'aria-activedescendant': activeId
      },
      on: {
        keydown: this.onKeydownGrid,
        focus: this.setGridFocusFlag,
        blur: this.setGridFocusFlag
      },
      ref: 'grid'
    }, [$gridCaption, $gridWeekDays, $gridBody, $gridHelp]); // Optional bottom slot

    var $slot = this.normalizeSlot();
    $slot = $slot ? h('footer', {
      staticClass: 'b-calendar-footer'
    }, $slot) : h();
    var $widget = h('div', {
      staticClass: 'b-calendar-inner',
      style: this.block ? {} : {
        width: this.width
      },
      attrs: {
        id: widgetId,
        dir: isRTL ? 'rtl' : 'ltr',
        lang: this.computedLocale || null,
        role: 'group',
        'aria-disabled': disabled ? 'true' : null,
        // If datepicker controls an input, this will specify the ID of the input
        'aria-controls': this.ariaControls || null,
        // This should be a prop (so it can be changed to Date picker, etc, localized
        'aria-roledescription': this.roleDescription || null,
        'aria-describedby': [// Should the attr (if present) go last?
        // Or should this attr be a prop?
        this.bvAttrs['aria-describedby'], valueId, gridHelpId].filter(identity).join(' ')
      },
      on: {
        keydown: this.onKeydownWrapper
      }
    }, [$header, $nav, $grid, $slot]); // Wrap in an outer div that can be styled

    return h('div', {
      staticClass: 'b-calendar',
      class: {
        'd-block': this.block
      }
    }, [$widget]);
  }
});