var _watch;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_FORM_SPINBUTTON } from '../../constants/components';
import { EVENT_NAME_CHANGE } from '../../constants/events';
import { PROP_TYPE_ARRAY_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_BOOLEAN_NUMBER, PROP_TYPE_FUNCTION, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { CODE_DOWN, CODE_END, CODE_HOME, CODE_PAGEUP, CODE_UP, CODE_PAGEDOWN } from '../../constants/key-codes';
import { SLOT_NAME_DECREMENT, SLOT_NAME_INCREMENT } from '../../constants/slots';
import { arrayIncludes, concat } from '../../utils/array';
import { attemptBlur, attemptFocus } from '../../utils/dom';
import { eventOnOff, stopEvent } from '../../utils/events';
import { identity } from '../../utils/identity';
import { isNull } from '../../utils/inspect';
import { isLocaleRTL } from '../../utils/locale';
import { mathFloor, mathMax, mathPow, mathRound } from '../../utils/math';
import { makeModelMixin } from '../../utils/model';
import { toFloat, toInteger } from '../../utils/number';
import { omit, sortKeys } from '../../utils/object';
import { hasPropFunction, makeProp, makePropsConfigurable } from '../../utils/props';
import { toString } from '../../utils/string';
import { attrsMixin } from '../../mixins/attrs';
import { formSizeMixin, props as formSizeProps } from '../../mixins/form-size';
import { formStateMixin, props as formStateProps } from '../../mixins/form-state';
import { idMixin, props as idProps } from '../../mixins/id';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { props as formControlProps } from '../../mixins/form-control';
import { BIconPlus, BIconDash } from '../../icons/icons'; // --- Constants ---

var _makeModelMixin = makeModelMixin('value', {
  // Should this really be String, to match native number inputs?
  type: PROP_TYPE_BOOLEAN_NUMBER
}),
    modelMixin = _makeModelMixin.mixin,
    modelProps = _makeModelMixin.props,
    MODEL_PROP_NAME = _makeModelMixin.prop,
    MODEL_EVENT_NAME = _makeModelMixin.event; // Default for spin button range and step


var DEFAULT_MIN = 1;
var DEFAULT_MAX = 100;
var DEFAULT_STEP = 1; // Delay before auto-repeat in ms

var DEFAULT_REPEAT_DELAY = 500; // Repeat interval in ms

var DEFAULT_REPEAT_INTERVAL = 100; // Repeat rate increased after number of repeats

var DEFAULT_REPEAT_THRESHOLD = 10; // Repeat speed multiplier (step multiplier, must be an integer)

var DEFAULT_REPEAT_MULTIPLIER = 4;
var KEY_CODES = [CODE_UP, CODE_DOWN, CODE_HOME, CODE_END, CODE_PAGEUP, CODE_PAGEDOWN]; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, idProps), modelProps), omit(formControlProps, ['required', 'autofocus'])), formSizeProps), formStateProps), {}, {
  ariaControls: makeProp(PROP_TYPE_STRING),
  ariaLabel: makeProp(PROP_TYPE_STRING),
  formatterFn: makeProp(PROP_TYPE_FUNCTION),
  inline: makeProp(PROP_TYPE_BOOLEAN, false),
  labelDecrement: makeProp(PROP_TYPE_STRING, 'Decrement'),
  labelIncrement: makeProp(PROP_TYPE_STRING, 'Increment'),
  locale: makeProp(PROP_TYPE_ARRAY_STRING),
  max: makeProp(PROP_TYPE_NUMBER_STRING, DEFAULT_MAX),
  min: makeProp(PROP_TYPE_NUMBER_STRING, DEFAULT_MIN),
  placeholder: makeProp(PROP_TYPE_STRING),
  readonly: makeProp(PROP_TYPE_BOOLEAN, false),
  repeatDelay: makeProp(PROP_TYPE_NUMBER_STRING, DEFAULT_REPEAT_DELAY),
  repeatInterval: makeProp(PROP_TYPE_NUMBER_STRING, DEFAULT_REPEAT_INTERVAL),
  repeatStepMultiplier: makeProp(PROP_TYPE_NUMBER_STRING, DEFAULT_REPEAT_MULTIPLIER),
  repeatThreshold: makeProp(PROP_TYPE_NUMBER_STRING, DEFAULT_REPEAT_THRESHOLD),
  step: makeProp(PROP_TYPE_NUMBER_STRING, DEFAULT_STEP),
  vertical: makeProp(PROP_TYPE_BOOLEAN, false),
  wrap: makeProp(PROP_TYPE_BOOLEAN, false)
})), NAME_FORM_SPINBUTTON); // --- Main Component ---
// @vue/component

export var BFormSpinbutton = /*#__PURE__*/Vue.extend({
  name: NAME_FORM_SPINBUTTON,
  // Mixin order is important!
  mixins: [attrsMixin, idMixin, modelMixin, formSizeMixin, formStateMixin, normalizeSlotMixin],
  inheritAttrs: false,
  props: props,
  data: function data() {
    return {
      localValue: toFloat(this[MODEL_PROP_NAME], null),
      hasFocus: false
    };
  },
  computed: {
    spinId: function spinId() {
      return this.safeId();
    },
    computedInline: function computedInline() {
      return this.inline && !this.vertical;
    },
    computedReadonly: function computedReadonly() {
      return this.readonly && !this.disabled;
    },
    computedRequired: function computedRequired() {
      return this.required && !this.computedReadonly && !this.disabled;
    },
    computedStep: function computedStep() {
      return toFloat(this.step, DEFAULT_STEP);
    },
    computedMin: function computedMin() {
      return toFloat(this.min, DEFAULT_MIN);
    },
    computedMax: function computedMax() {
      // We round down to the nearest maximum step value
      var max = toFloat(this.max, DEFAULT_MAX);
      var step = this.computedStep;
      var min = this.computedMin;
      return mathFloor((max - min) / step) * step + min;
    },
    computedDelay: function computedDelay() {
      var delay = toInteger(this.repeatDelay, 0);
      return delay > 0 ? delay : DEFAULT_REPEAT_DELAY;
    },
    computedInterval: function computedInterval() {
      var interval = toInteger(this.repeatInterval, 0);
      return interval > 0 ? interval : DEFAULT_REPEAT_INTERVAL;
    },
    computedThreshold: function computedThreshold() {
      return mathMax(toInteger(this.repeatThreshold, DEFAULT_REPEAT_THRESHOLD), 1);
    },
    computedStepMultiplier: function computedStepMultiplier() {
      return mathMax(toInteger(this.repeatStepMultiplier, DEFAULT_REPEAT_MULTIPLIER), 1);
    },
    computedPrecision: function computedPrecision() {
      // Quick and dirty way to get the number of decimals
      var step = this.computedStep;
      return mathFloor(step) === step ? 0 : (step.toString().split('.')[1] || '').length;
    },
    computedMultiplier: function computedMultiplier() {
      return mathPow(10, this.computedPrecision || 0);
    },
    valueAsFixed: function valueAsFixed() {
      var value = this.localValue;
      return isNull(value) ? '' : value.toFixed(this.computedPrecision);
    },
    computedLocale: function computedLocale() {
      var locales = concat(this.locale).filter(identity);
      var nf = new Intl.NumberFormat(locales);
      return nf.resolvedOptions().locale;
    },
    computedRTL: function computedRTL() {
      return isLocaleRTL(this.computedLocale);
    },
    defaultFormatter: function defaultFormatter() {
      // Returns and `Intl.NumberFormat` formatter method reference
      var precision = this.computedPrecision;
      var nf = new Intl.NumberFormat(this.computedLocale, {
        style: 'decimal',
        useGrouping: false,
        minimumIntegerDigits: 1,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
        notation: 'standard'
      }); // Return the format method reference

      return nf.format;
    },
    computedFormatter: function computedFormatter() {
      var formatterFn = this.formatterFn;
      return hasPropFunction(formatterFn) ? formatterFn : this.defaultFormatter;
    },
    computedAttrs: function computedAttrs() {
      return _objectSpread(_objectSpread({}, this.bvAttrs), {}, {
        role: 'group',
        lang: this.computedLocale,
        tabindex: this.disabled ? null : '-1',
        title: this.ariaLabel
      });
    },
    computedSpinAttrs: function computedSpinAttrs() {
      var spinId = this.spinId,
          value = this.localValue,
          required = this.computedRequired,
          disabled = this.disabled,
          state = this.state,
          computedFormatter = this.computedFormatter;
      var hasValue = !isNull(value);
      return _objectSpread(_objectSpread({
        dir: this.computedRTL ? 'rtl' : 'ltr'
      }, this.bvAttrs), {}, {
        id: spinId,
        role: 'spinbutton',
        tabindex: disabled ? null : '0',
        'aria-live': 'off',
        'aria-label': this.ariaLabel || null,
        'aria-controls': this.ariaControls || null,
        // TODO: May want to check if the value is in range
        'aria-invalid': state === false || !hasValue && required ? 'true' : null,
        'aria-required': required ? 'true' : null,
        // These attrs are required for role spinbutton
        'aria-valuemin': toString(this.computedMin),
        'aria-valuemax': toString(this.computedMax),
        // These should be `null` if the value is out of range
        // They must also be non-existent attrs if the value is out of range or `null`
        'aria-valuenow': hasValue ? value : null,
        'aria-valuetext': hasValue ? computedFormatter(value) : null
      });
    }
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME, function (value) {
    this.localValue = toFloat(value, null);
  }), _defineProperty(_watch, "localValue", function localValue(value) {
    this.$emit(MODEL_EVENT_NAME, value);
  }), _defineProperty(_watch, "disabled", function disabled(_disabled) {
    if (_disabled) {
      this.clearRepeat();
    }
  }), _defineProperty(_watch, "readonly", function readonly(_readonly) {
    if (_readonly) {
      this.clearRepeat();
    }
  }), _watch),
  created: function created() {
    // Create non reactive properties
    this.$_autoDelayTimer = null;
    this.$_autoRepeatTimer = null;
    this.$_keyIsDown = false;
  },
  beforeDestroy: function beforeDestroy() {
    this.clearRepeat();
  },

  /* istanbul ignore next */
  deactivated: function deactivated() {
    this.clearRepeat();
  },
  methods: {
    // --- Public methods ---
    focus: function focus() {
      if (!this.disabled) {
        attemptFocus(this.$refs.spinner);
      }
    },
    blur: function blur() {
      if (!this.disabled) {
        attemptBlur(this.$refs.spinner);
      }
    },
    // --- Private methods ---
    emitChange: function emitChange() {
      this.$emit(EVENT_NAME_CHANGE, this.localValue);
    },
    stepValue: function stepValue(direction) {
      // Sets a new incremented or decremented value, supporting optional wrapping
      // Direction is either +1 or -1 (or a multiple thereof)
      var value = this.localValue;

      if (!this.disabled && !isNull(value)) {
        var step = this.computedStep * direction;
        var min = this.computedMin;
        var max = this.computedMax;
        var multiplier = this.computedMultiplier;
        var wrap = this.wrap; // We ensure that the value steps like a native input

        value = mathRound((value - min) / step) * step + min + step; // We ensure that precision is maintained (decimals)

        value = mathRound(value * multiplier) / multiplier; // Handle if wrapping is enabled

        this.localValue = value > max ? wrap ? min : max : value < min ? wrap ? max : min : value;
      }
    },
    onFocusBlur: function onFocusBlur(event) {
      if (!this.disabled) {
        this.hasFocus = event.type === 'focus';
      } else {
        this.hasFocus = false;
      }
    },
    stepUp: function stepUp() {
      var multiplier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var value = this.localValue;

      if (isNull(value)) {
        this.localValue = this.computedMin;
      } else {
        this.stepValue(+1 * multiplier);
      }
    },
    stepDown: function stepDown() {
      var multiplier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var value = this.localValue;

      if (isNull(value)) {
        this.localValue = this.wrap ? this.computedMax : this.computedMin;
      } else {
        this.stepValue(-1 * multiplier);
      }
    },
    onKeydown: function onKeydown(event) {
      var keyCode = event.keyCode,
          altKey = event.altKey,
          ctrlKey = event.ctrlKey,
          metaKey = event.metaKey;
      /* istanbul ignore if */

      if (this.disabled || this.readonly || altKey || ctrlKey || metaKey) {
        return;
      }

      if (arrayIncludes(KEY_CODES, keyCode)) {
        // https://w3c.github.io/aria-practices/#spinbutton
        stopEvent(event, {
          propagation: false
        });
        /* istanbul ignore if */

        if (this.$_keyIsDown) {
          // Keypress is already in progress
          return;
        }

        this.resetTimers();

        if (arrayIncludes([CODE_UP, CODE_DOWN], keyCode)) {
          // The following use the custom auto-repeat handling
          this.$_keyIsDown = true;

          if (keyCode === CODE_UP) {
            this.handleStepRepeat(event, this.stepUp);
          } else if (keyCode === CODE_DOWN) {
            this.handleStepRepeat(event, this.stepDown);
          }
        } else {
          // These use native OS key repeating
          if (keyCode === CODE_PAGEUP) {
            this.stepUp(this.computedStepMultiplier);
          } else if (keyCode === CODE_PAGEDOWN) {
            this.stepDown(this.computedStepMultiplier);
          } else if (keyCode === CODE_HOME) {
            this.localValue = this.computedMin;
          } else if (keyCode === CODE_END) {
            this.localValue = this.computedMax;
          }
        }
      }
    },
    onKeyup: function onKeyup(event) {
      // Emit a change event when the keyup happens
      var keyCode = event.keyCode,
          altKey = event.altKey,
          ctrlKey = event.ctrlKey,
          metaKey = event.metaKey;
      /* istanbul ignore if */

      if (this.disabled || this.readonly || altKey || ctrlKey || metaKey) {
        return;
      }

      if (arrayIncludes(KEY_CODES, keyCode)) {
        stopEvent(event, {
          propagation: false
        });
        this.resetTimers();
        this.$_keyIsDown = false;
        this.emitChange();
      }
    },
    handleStepRepeat: function handleStepRepeat(event, stepper) {
      var _this = this;

      var _ref = event || {},
          type = _ref.type,
          button = _ref.button;

      if (!this.disabled && !this.readonly) {
        /* istanbul ignore if */
        if (type === 'mousedown' && button) {
          // We only respond to left (main === 0) button clicks
          return;
        }

        this.resetTimers(); // Step the counter initially

        stepper(1);
        var threshold = this.computedThreshold;
        var multiplier = this.computedStepMultiplier;
        var delay = this.computedDelay;
        var interval = this.computedInterval; // Initiate the delay/repeat interval

        this.$_autoDelayTimer = setTimeout(function () {
          var count = 0;
          _this.$_autoRepeatTimer = setInterval(function () {
            // After N initial repeats, we increase the incrementing step amount
            // We do this to minimize screen reader announcements of the value
            // (values are announced every change, which can be chatty for SR users)
            // And to make it easer to select a value when the range is large
            stepper(count < threshold ? 1 : multiplier);
            count++;
          }, interval);
        }, delay);
      }
    },
    onMouseup: function onMouseup(event) {
      // `<body>` listener, only enabled when mousedown starts
      var _ref2 = event || {},
          type = _ref2.type,
          button = _ref2.button;
      /* istanbul ignore if */


      if (type === 'mouseup' && button) {
        // Ignore non left button (main === 0) mouse button click
        return;
      }

      stopEvent(event, {
        propagation: false
      });
      this.resetTimers();
      this.setMouseup(false); // Trigger the change event

      this.emitChange();
    },
    setMouseup: function setMouseup(on) {
      // Enable or disabled the body mouseup/touchend handlers
      // Use try/catch to handle case when called server side
      try {
        eventOnOff(on, document.body, 'mouseup', this.onMouseup, false);
        eventOnOff(on, document.body, 'touchend', this.onMouseup, false);
      } catch (_unused) {}
    },
    resetTimers: function resetTimers() {
      clearTimeout(this.$_autoDelayTimer);
      clearInterval(this.$_autoRepeatTimer);
      this.$_autoDelayTimer = null;
      this.$_autoRepeatTimer = null;
    },
    clearRepeat: function clearRepeat() {
      this.resetTimers();
      this.setMouseup(false);
      this.$_keyIsDown = false;
    }
  },
  render: function render(h) {
    var _this2 = this;

    var spinId = this.spinId,
        value = this.localValue,
        inline = this.computedInline,
        readonly = this.computedReadonly,
        vertical = this.vertical,
        disabled = this.disabled,
        computedFormatter = this.computedFormatter;
    var hasValue = !isNull(value);

    var makeButton = function makeButton(stepper, label, IconCmp, keyRef, shortcut, btnDisabled, slotName) {
      var $icon = h(IconCmp, {
        props: {
          scale: _this2.hasFocus ? 1.5 : 1.25
        },
        attrs: {
          'aria-hidden': 'true'
        }
      });
      var scope = {
        hasFocus: _this2.hasFocus
      };

      var handler = function handler(event) {
        if (!disabled && !readonly) {
          stopEvent(event, {
            propagation: false
          });

          _this2.setMouseup(true); // Since we `preventDefault()`, we must manually focus the button


          attemptFocus(event.currentTarget);

          _this2.handleStepRepeat(event, stepper);
        }
      };

      return h('button', {
        staticClass: 'btn btn-sm border-0 rounded-0',
        class: {
          'py-0': !vertical
        },
        attrs: {
          tabindex: '-1',
          type: 'button',
          disabled: disabled || readonly || btnDisabled,
          'aria-disabled': disabled || readonly || btnDisabled ? 'true' : null,
          'aria-controls': spinId,
          'aria-label': label || null,
          'aria-keyshortcuts': shortcut || null
        },
        on: {
          mousedown: handler,
          touchstart: handler
        },
        key: keyRef || null,
        ref: keyRef
      }, [_this2.normalizeSlot(slotName, scope) || $icon]);
    }; // TODO: Add button disabled state when `wrap` is `false` and at value max/min


    var $increment = makeButton(this.stepUp, this.labelIncrement, BIconPlus, 'inc', 'ArrowUp', false, SLOT_NAME_INCREMENT);
    var $decrement = makeButton(this.stepDown, this.labelDecrement, BIconDash, 'dec', 'ArrowDown', false, SLOT_NAME_DECREMENT);
    var $hidden = h();

    if (this.name && !disabled) {
      $hidden = h('input', {
        attrs: {
          type: 'hidden',
          name: this.name,
          form: this.form || null,
          // TODO: Should this be set to '' if value is out of range?
          value: this.valueAsFixed
        },
        key: 'hidden'
      });
    }

    var $spin = h( // We use 'output' element to make this accept a `<label for="id">` (Except IE)
    'output', {
      staticClass: 'flex-grow-1',
      class: {
        'd-flex': vertical,
        'align-self-center': !vertical,
        'align-items-center': vertical,
        'border-top': vertical,
        'border-bottom': vertical,
        'border-left': !vertical,
        'border-right': !vertical
      },
      attrs: this.computedSpinAttrs,
      key: 'output',
      ref: 'spinner'
    }, [h('bdi', hasValue ? computedFormatter(value) : this.placeholder || '')]);
    return h('div', {
      staticClass: 'b-form-spinbutton form-control',
      class: [{
        disabled: disabled,
        readonly: readonly,
        focus: this.hasFocus,
        'd-inline-flex': inline || vertical,
        'd-flex': !inline && !vertical,
        'align-items-stretch': !vertical,
        'flex-column': vertical
      }, this.sizeFormClass, this.stateClass],
      attrs: this.computedAttrs,
      on: {
        keydown: this.onKeydown,
        keyup: this.onKeyup,
        // We use capture phase (`!` prefix) since focus and blur do not bubble
        '!focus': this.onFocusBlur,
        '!blur': this.onFocusBlur
      }
    }, vertical ? [$increment, $hidden, $spin, $decrement] : [$decrement, $hidden, $spin, $increment]);
  }
});