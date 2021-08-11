var _watch;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// BTime control (not form input control)
import { Vue } from '../../vue';
import { NAME_TIME } from '../../constants/components';
import { EVENT_NAME_CONTEXT } from '../../constants/events';
import { CODE_LEFT, CODE_RIGHT } from '../../constants/key-codes';
import { PROP_TYPE_ARRAY_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { RX_TIME } from '../../constants/regex';
import { concat } from '../../utils/array';
import { createDate, createDateFormatter } from '../../utils/date';
import { attemptBlur, attemptFocus, contains, getActiveElement, requestAF } from '../../utils/dom';
import { stopEvent } from '../../utils/events';
import { identity } from '../../utils/identity';
import { isNull, isUndefinedOrNull } from '../../utils/inspect';
import { looseEqual } from '../../utils/loose-equal';
import { isLocaleRTL } from '../../utils/locale';
import { makeModelMixin } from '../../utils/model';
import { toInteger } from '../../utils/number';
import { pick, sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { toString } from '../../utils/string';
import { idMixin, props as idProps } from '../../mixins/id';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BFormSpinbutton, props as BFormSpinbuttonProps } from '../form-spinbutton/form-spinbutton';
import { BIconCircleFill, BIconChevronUp } from '../../icons/icons'; // --- Constants ---

var _makeModelMixin = makeModelMixin('value', {
  type: PROP_TYPE_STRING,
  defaultValue: ''
}),
    modelMixin = _makeModelMixin.mixin,
    modelProps = _makeModelMixin.props,
    MODEL_PROP_NAME = _makeModelMixin.prop,
    MODEL_EVENT_NAME = _makeModelMixin.event;

var NUMERIC = 'numeric'; // --- Helper methods ---

var padLeftZeros = function padLeftZeros(value) {
  return "00".concat(value || '').slice(-2);
};

var parseHMS = function parseHMS(value) {
  value = toString(value);
  var hh = null,
      mm = null,
      ss = null;

  if (RX_TIME.test(value)) {
    ;

    var _value$split$map = value.split(':').map(function (v) {
      return toInteger(v, null);
    });

    var _value$split$map2 = _slicedToArray(_value$split$map, 3);

    hh = _value$split$map2[0];
    mm = _value$split$map2[1];
    ss = _value$split$map2[2];
  }

  return {
    hours: isUndefinedOrNull(hh) ? null : hh,
    minutes: isUndefinedOrNull(mm) ? null : mm,
    seconds: isUndefinedOrNull(ss) ? null : ss,
    ampm: isUndefinedOrNull(hh) || hh < 12 ? 0 : 1
  };
};

var formatHMS = function formatHMS(_ref) {
  var hours = _ref.hours,
      minutes = _ref.minutes,
      seconds = _ref.seconds;
  var requireSeconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (isNull(hours) || isNull(minutes) || requireSeconds && isNull(seconds)) {
    return '';
  }

  var hms = [hours, minutes, requireSeconds ? seconds : 0];
  return hms.map(padLeftZeros).join(':');
}; // --- Props ---


export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, idProps), modelProps), pick(BFormSpinbuttonProps, ['labelIncrement', 'labelDecrement'])), {}, {
  // ID of label element
  ariaLabelledby: makeProp(PROP_TYPE_STRING),
  disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  hidden: makeProp(PROP_TYPE_BOOLEAN, false),
  hideHeader: makeProp(PROP_TYPE_BOOLEAN, false),
  // Explicitly force 12 or 24 hour time
  // Default is to use resolved locale for 12/24 hour display
  // Tri-state: `true` = 12, `false` = 24, `null` = auto
  hour12: makeProp(PROP_TYPE_BOOLEAN, null),
  labelAm: makeProp(PROP_TYPE_STRING, 'AM'),
  labelAmpm: makeProp(PROP_TYPE_STRING, 'AM/PM'),
  labelHours: makeProp(PROP_TYPE_STRING, 'Hours'),
  labelMinutes: makeProp(PROP_TYPE_STRING, 'Minutes'),
  labelNoTimeSelected: makeProp(PROP_TYPE_STRING, 'No time selected'),
  labelPm: makeProp(PROP_TYPE_STRING, 'PM'),
  labelSeconds: makeProp(PROP_TYPE_STRING, 'Seconds'),
  labelSelected: makeProp(PROP_TYPE_STRING, 'Selected time'),
  locale: makeProp(PROP_TYPE_ARRAY_STRING),
  minutesStep: makeProp(PROP_TYPE_NUMBER_STRING, 1),
  readonly: makeProp(PROP_TYPE_BOOLEAN, false),
  secondsStep: makeProp(PROP_TYPE_NUMBER_STRING, 1),
  // If `true`, show the second spinbutton
  showSeconds: makeProp(PROP_TYPE_BOOLEAN, false)
})), NAME_TIME); // --- Main component ---
// @vue/component

export var BTime = /*#__PURE__*/Vue.extend({
  name: NAME_TIME,
  mixins: [idMixin, modelMixin, normalizeSlotMixin],
  props: props,
  data: function data() {
    var parsed = parseHMS(this[MODEL_PROP_NAME] || '');
    return {
      // Spin button models
      modelHours: parsed.hours,
      modelMinutes: parsed.minutes,
      modelSeconds: parsed.seconds,
      modelAmpm: parsed.ampm,
      // Internal flag to enable aria-live regions
      isLive: false
    };
  },
  computed: {
    computedHMS: function computedHMS() {
      var hours = this.modelHours;
      var minutes = this.modelMinutes;
      var seconds = this.modelSeconds;
      return formatHMS({
        hours: hours,
        minutes: minutes,
        seconds: seconds
      }, this.showSeconds);
    },
    resolvedOptions: function resolvedOptions() {
      // Resolved locale options
      var locale = concat(this.locale).filter(identity);
      var options = {
        hour: NUMERIC,
        minute: NUMERIC,
        second: NUMERIC
      };

      if (!isUndefinedOrNull(this.hour12)) {
        // Force 12 or 24 hour clock
        options.hour12 = !!this.hour12;
      }

      var dtf = new Intl.DateTimeFormat(locale, options);
      var resolved = dtf.resolvedOptions();
      var hour12 = resolved.hour12 || false; // IE 11 doesn't resolve the hourCycle, so we make
      // an assumption and fall back to common values

      var hourCycle = resolved.hourCycle || (hour12 ? 'h12' : 'h23');
      return {
        locale: resolved.locale,
        hour12: hour12,
        hourCycle: hourCycle
      };
    },
    computedLocale: function computedLocale() {
      return this.resolvedOptions.locale;
    },
    computedLang: function computedLang() {
      return (this.computedLocale || '').replace(/-u-.*$/, '');
    },
    computedRTL: function computedRTL() {
      return isLocaleRTL(this.computedLang);
    },
    computedHourCycle: function computedHourCycle() {
      // h11, h12, h23, or h24
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Locale/hourCycle
      // h12 - Hour system using 1–12. Corresponds to 'h' in patterns. The 12 hour clock, with midnight starting at 12:00 am
      // h23 - Hour system using 0–23. Corresponds to 'H' in patterns. The 24 hour clock, with midnight starting at 0:00
      // h11 - Hour system using 0–11. Corresponds to 'K' in patterns. The 12 hour clock, with midnight starting at 0:00 am
      // h24 - Hour system using 1–24. Corresponds to 'k' in pattern. The 24 hour clock, with midnight starting at 24:00
      // For h12 or h24, we visually format 00 hours as 12
      return this.resolvedOptions.hourCycle;
    },
    is12Hour: function is12Hour() {
      return !!this.resolvedOptions.hour12;
    },
    context: function context() {
      return {
        locale: this.computedLocale,
        isRTL: this.computedRTL,
        hourCycle: this.computedHourCycle,
        hour12: this.is12Hour,
        hours: this.modelHours,
        minutes: this.modelMinutes,
        seconds: this.showSeconds ? this.modelSeconds : 0,
        value: this.computedHMS,
        formatted: this.formattedTimeString
      };
    },
    valueId: function valueId() {
      return this.safeId() || null;
    },
    computedAriaLabelledby: function computedAriaLabelledby() {
      return [this.ariaLabelledby, this.valueId].filter(identity).join(' ') || null;
    },
    timeFormatter: function timeFormatter() {
      // Returns a formatter function reference
      // The formatter converts the time to a localized string
      var options = {
        hour12: this.is12Hour,
        hourCycle: this.computedHourCycle,
        hour: NUMERIC,
        minute: NUMERIC,
        timeZone: 'UTC'
      };

      if (this.showSeconds) {
        options.second = NUMERIC;
      } // Formats the time as a localized string


      return createDateFormatter(this.computedLocale, options);
    },
    numberFormatter: function numberFormatter() {
      // Returns a formatter function reference
      // The formatter always formats as 2 digits and is localized
      var nf = new Intl.NumberFormat(this.computedLocale, {
        style: 'decimal',
        minimumIntegerDigits: 2,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        notation: 'standard'
      });
      return nf.format;
    },
    formattedTimeString: function formattedTimeString() {
      var hours = this.modelHours;
      var minutes = this.modelMinutes;
      var seconds = this.showSeconds ? this.modelSeconds || 0 : 0;

      if (this.computedHMS) {
        return this.timeFormatter(createDate(Date.UTC(0, 0, 1, hours, minutes, seconds)));
      }

      return this.labelNoTimeSelected || ' ';
    },
    spinScopedSlots: function spinScopedSlots() {
      var h = this.$createElement;
      return {
        increment: function increment(_ref2) {
          var hasFocus = _ref2.hasFocus;
          return h(BIconChevronUp, {
            props: {
              scale: hasFocus ? 1.5 : 1.25
            },
            attrs: {
              'aria-hidden': 'true'
            }
          });
        },
        decrement: function decrement(_ref3) {
          var hasFocus = _ref3.hasFocus;
          return h(BIconChevronUp, {
            props: {
              flipV: true,
              scale: hasFocus ? 1.5 : 1.25
            },
            attrs: {
              'aria-hidden': 'true'
            }
          });
        }
      };
    }
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME, function (newValue, oldValue) {
    if (newValue !== oldValue && !looseEqual(parseHMS(newValue), parseHMS(this.computedHMS))) {
      var _parseHMS = parseHMS(newValue),
          hours = _parseHMS.hours,
          minutes = _parseHMS.minutes,
          seconds = _parseHMS.seconds,
          ampm = _parseHMS.ampm;

      this.modelHours = hours;
      this.modelMinutes = minutes;
      this.modelSeconds = seconds;
      this.modelAmpm = ampm;
    }
  }), _defineProperty(_watch, "computedHMS", function computedHMS(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.$emit(MODEL_EVENT_NAME, newValue);
    }
  }), _defineProperty(_watch, "context", function context(newValue, oldValue) {
    if (!looseEqual(newValue, oldValue)) {
      this.$emit(EVENT_NAME_CONTEXT, newValue);
    }
  }), _defineProperty(_watch, "modelAmpm", function modelAmpm(newValue, oldValue) {
    var _this = this;

    if (newValue !== oldValue) {
      var hours = isNull(this.modelHours) ? 0 : this.modelHours;
      this.$nextTick(function () {
        if (newValue === 0 && hours > 11) {
          // Switched to AM
          _this.modelHours = hours - 12;
        } else if (newValue === 1 && hours < 12) {
          // Switched to PM
          _this.modelHours = hours + 12;
        }
      });
    }
  }), _defineProperty(_watch, "modelHours", function modelHours(newHours, oldHours) {
    if (newHours !== oldHours) {
      this.modelAmpm = newHours > 11 ? 1 : 0;
    }
  }), _watch),
  created: function created() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.$emit(EVENT_NAME_CONTEXT, _this2.context);
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
    // Public methods
    focus: function focus() {
      if (!this.disabled) {
        // We focus the first spin button
        attemptFocus(this.$refs.spinners[0]);
      }
    },
    blur: function blur() {
      if (!this.disabled) {
        var activeElement = getActiveElement();

        if (contains(this.$el, activeElement)) {
          attemptBlur(activeElement);
        }
      }
    },
    // Formatters for the spin buttons
    formatHours: function formatHours(hh) {
      var hourCycle = this.computedHourCycle; // We always store 0-23, but format based on h11/h12/h23/h24 formats

      hh = this.is12Hour && hh > 12 ? hh - 12 : hh; // Determine how 00:00 and 12:00 are shown

      hh = hh === 0 && hourCycle === 'h12' ? 12 : hh === 0 && hourCycle === 'h24' ?
      /* istanbul ignore next */
      24 : hh === 12 && hourCycle === 'h11' ?
      /* istanbul ignore next */
      0 : hh;
      return this.numberFormatter(hh);
    },
    formatMinutes: function formatMinutes(mm) {
      return this.numberFormatter(mm);
    },
    formatSeconds: function formatSeconds(ss) {
      return this.numberFormatter(ss);
    },
    formatAmpm: function formatAmpm(ampm) {
      // These should come from label props???
      // `ampm` should always be a value of `0` or `1`
      return ampm === 0 ? this.labelAm : ampm === 1 ? this.labelPm : '';
    },
    // Spinbutton on change handlers
    setHours: function setHours(value) {
      this.modelHours = value;
    },
    setMinutes: function setMinutes(value) {
      this.modelMinutes = value;
    },
    setSeconds: function setSeconds(value) {
      this.modelSeconds = value;
    },
    setAmpm: function setAmpm(value) {
      this.modelAmpm = value;
    },
    onSpinLeftRight: function onSpinLeftRight() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var type = event.type,
          keyCode = event.keyCode;

      if (!this.disabled && type === 'keydown' && (keyCode === CODE_LEFT || keyCode === CODE_RIGHT)) {
        stopEvent(event);
        var spinners = this.$refs.spinners || [];
        var index = spinners.map(function (cmp) {
          return !!cmp.hasFocus;
        }).indexOf(true);
        index = index + (keyCode === CODE_LEFT ? -1 : 1);
        index = index >= spinners.length ? 0 : index < 0 ? spinners.length - 1 : index;
        attemptFocus(spinners[index]);
      }
    },
    setLive: function setLive(on) {
      var _this3 = this;

      if (on) {
        this.$nextTick(function () {
          requestAF(function () {
            _this3.isLive = true;
          });
        });
      } else {
        this.isLive = false;
      }
    }
  },
  render: function render(h) {
    var _this4 = this;

    /* istanbul ignore if */
    if (this.hidden) {
      // If hidden, we just render a placeholder comment
      return h();
    }

    var valueId = this.valueId;
    var computedAriaLabelledby = this.computedAriaLabelledby;
    var spinIds = []; // Helper method to render a spinbutton

    var makeSpinbutton = function makeSpinbutton(handler, key, classes) {
      var spinbuttonProps = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var id = _this4.safeId("_spinbutton_".concat(key, "_")) || null;
      spinIds.push(id);
      return h(BFormSpinbutton, {
        class: classes,
        props: _objectSpread({
          id: id,
          placeholder: '--',
          vertical: true,
          required: true,
          disabled: _this4.disabled,
          readonly: _this4.readonly,
          locale: _this4.computedLocale,
          labelIncrement: _this4.labelIncrement,
          labelDecrement: _this4.labelDecrement,
          wrap: true,
          ariaControls: valueId,
          min: 0
        }, spinbuttonProps),
        scopedSlots: _this4.spinScopedSlots,
        on: {
          // We use `change` event to minimize SR verbosity
          // As the spinbutton will announce each value change
          // and we don't want the formatted time to be announced
          // on each value input if repeat is happening
          change: handler
        },
        key: key,
        ref: 'spinners',
        refInFor: true
      });
    }; // Helper method to return a "colon" separator


    var makeColon = function makeColon() {
      return h('div', {
        staticClass: 'd-flex flex-column',
        class: {
          'text-muted': _this4.disabled || _this4.readonly
        },
        attrs: {
          'aria-hidden': 'true'
        }
      }, [h(BIconCircleFill, {
        props: {
          shiftV: 4,
          scale: 0.5
        }
      }), h(BIconCircleFill, {
        props: {
          shiftV: -4,
          scale: 0.5
        }
      })]);
    };

    var $spinners = []; // Hours

    $spinners.push(makeSpinbutton(this.setHours, 'hours', 'b-time-hours', {
      value: this.modelHours,
      max: 23,
      step: 1,
      formatterFn: this.formatHours,
      ariaLabel: this.labelHours
    })); // Spacer

    $spinners.push(makeColon()); // Minutes

    $spinners.push(makeSpinbutton(this.setMinutes, 'minutes', 'b-time-minutes', {
      value: this.modelMinutes,
      max: 59,
      step: this.minutesStep || 1,
      formatterFn: this.formatMinutes,
      ariaLabel: this.labelMinutes
    }));

    if (this.showSeconds) {
      // Spacer
      $spinners.push(makeColon()); // Seconds

      $spinners.push(makeSpinbutton(this.setSeconds, 'seconds', 'b-time-seconds', {
        value: this.modelSeconds,
        max: 59,
        step: this.secondsStep || 1,
        formatterFn: this.formatSeconds,
        ariaLabel: this.labelSeconds
      }));
    } // AM/PM ?


    if (this.is12Hour) {
      // TODO:
      //   If locale is RTL, unshift this instead of push?
      //   And switch class `ml-2` to `mr-2`
      //   Note some LTR locales (i.e. zh) also place AM/PM to the left
      $spinners.push(makeSpinbutton(this.setAmpm, 'ampm', 'b-time-ampm', {
        value: this.modelAmpm,
        max: 1,
        formatterFn: this.formatAmpm,
        ariaLabel: this.labelAmpm,
        // We set `required` as `false`, since this always has a value
        required: false
      }));
    } // Assemble spinners


    $spinners = h('div', {
      staticClass: 'd-flex align-items-center justify-content-center mx-auto',
      attrs: {
        role: 'group',
        tabindex: this.disabled || this.readonly ? null : '-1',
        'aria-labelledby': computedAriaLabelledby
      },
      on: {
        keydown: this.onSpinLeftRight,
        click:
        /* istanbul ignore next */
        function click(event) {
          if (event.target === event.currentTarget) {
            _this4.focus();
          }
        }
      }
    }, $spinners); // Selected type display

    var $value = h('output', {
      staticClass: 'form-control form-control-sm text-center',
      class: {
        disabled: this.disabled || this.readonly
      },
      attrs: {
        id: valueId,
        role: 'status',
        for: spinIds.filter(identity).join(' ') || null,
        tabindex: this.disabled ? null : '-1',
        'aria-live': this.isLive ? 'polite' : 'off',
        'aria-atomic': 'true'
      },
      on: {
        // Transfer focus/click to focus hours spinner
        click: this.focus,
        focus: this.focus
      }
    }, [h('bdi', this.formattedTimeString), this.computedHMS ? h('span', {
      staticClass: 'sr-only'
    }, " (".concat(this.labelSelected, ") ")) : '']);
    var $header = h('header', {
      staticClass: 'b-time-header',
      class: {
        'sr-only': this.hideHeader
      }
    }, [$value]); // Optional bottom slot

    var $slot = this.normalizeSlot();
    $slot = $slot ? h('footer', {
      staticClass: 'b-time-footer'
    }, $slot) : h();
    return h('div', {
      staticClass: 'b-time d-inline-flex flex-column text-center',
      attrs: {
        role: 'group',
        lang: this.computedLang || null,
        'aria-labelledby': computedAriaLabelledby || null,
        'aria-disabled': this.disabled ? 'true' : null,
        'aria-readonly': this.readonly && !this.disabled ? 'true' : null
      }
    }, [$header, $spinners, $slot]);
  }
});