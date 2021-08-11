var _watch;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { COMPONENT_UID_KEY, Vue } from '../../vue';
import { NAME_ALERT } from '../../constants/components';
import { EVENT_NAME_DISMISSED, EVENT_NAME_DISMISS_COUNT_DOWN } from '../../constants/events';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_BOOLEAN_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_DISMISS } from '../../constants/slots';
import { requestAF } from '../../utils/dom';
import { isBoolean, isNumeric } from '../../utils/inspect';
import { makeModelMixin } from '../../utils/model';
import { toInteger } from '../../utils/number';
import { sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BButtonClose } from '../button/button-close';
import { BVTransition } from '../transition/bv-transition'; // --- Constants ---

var _makeModelMixin = makeModelMixin('show', {
  type: PROP_TYPE_BOOLEAN_NUMBER_STRING,
  defaultValue: false
}),
    modelMixin = _makeModelMixin.mixin,
    modelProps = _makeModelMixin.props,
    MODEL_PROP_NAME = _makeModelMixin.prop,
    MODEL_EVENT_NAME = _makeModelMixin.event; // --- Helper methods ---
// Convert `show` value to a number


var parseCountDown = function parseCountDown(show) {
  if (show === '' || isBoolean(show)) {
    return 0;
  }

  show = toInteger(show, 0);
  return show > 0 ? show : 0;
}; // Convert `show` value to a boolean


var parseShow = function parseShow(show) {
  if (show === '' || show === true) {
    return true;
  }

  if (toInteger(show, 0) < 1) {
    // Boolean will always return false for the above comparison
    return false;
  }

  return !!show;
}; // --- Props ---


export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, modelProps), {}, {
  dismissLabel: makeProp(PROP_TYPE_STRING, 'Close'),
  dismissible: makeProp(PROP_TYPE_BOOLEAN, false),
  fade: makeProp(PROP_TYPE_BOOLEAN, false),
  variant: makeProp(PROP_TYPE_STRING, 'info')
})), NAME_ALERT); // --- Main component ---
// @vue/component

export var BAlert = /*#__PURE__*/Vue.extend({
  name: NAME_ALERT,
  mixins: [modelMixin, normalizeSlotMixin],
  props: props,
  data: function data() {
    return {
      countDown: 0,
      // If initially shown, we need to set these for SSR
      localShow: parseShow(this[MODEL_PROP_NAME])
    };
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME, function (newValue) {
    this.countDown = parseCountDown(newValue);
    this.localShow = parseShow(newValue);
  }), _defineProperty(_watch, "countDown", function countDown(newValue) {
    var _this = this;

    this.clearCountDownInterval();
    var show = this[MODEL_PROP_NAME]; // Ignore if `show` transitions to a boolean value

    if (isNumeric(show)) {
      this.$emit(EVENT_NAME_DISMISS_COUNT_DOWN, newValue); // Update the v-model if needed

      if (show !== newValue) {
        this.$emit(MODEL_EVENT_NAME, newValue);
      }

      if (newValue > 0) {
        this.localShow = true;
        this.$_countDownTimeout = setTimeout(function () {
          _this.countDown--;
        }, 1000);
      } else {
        // Slightly delay the hide to allow any UI updates
        this.$nextTick(function () {
          requestAF(function () {
            _this.localShow = false;
          });
        });
      }
    }
  }), _defineProperty(_watch, "localShow", function localShow(newValue) {
    var show = this[MODEL_PROP_NAME]; // Only emit dismissed events for dismissible or auto-dismissing alerts

    if (!newValue && (this.dismissible || isNumeric(show))) {
      this.$emit(EVENT_NAME_DISMISSED);
    } // Only emit booleans if we weren't passed a number via v-model


    if (!isNumeric(show) && show !== newValue) {
      this.$emit(MODEL_EVENT_NAME, newValue);
    }
  }), _watch),
  created: function created() {
    // Create private non-reactive props
    this.$_filterTimer = null;
    var show = this[MODEL_PROP_NAME];
    this.countDown = parseCountDown(show);
    this.localShow = parseShow(show);
  },
  beforeDestroy: function beforeDestroy() {
    this.clearCountDownInterval();
  },
  methods: {
    dismiss: function dismiss() {
      this.clearCountDownInterval();
      this.countDown = 0;
      this.localShow = false;
    },
    clearCountDownInterval: function clearCountDownInterval() {
      clearTimeout(this.$_countDownTimeout);
      this.$_countDownTimeout = null;
    }
  },
  render: function render(h) {
    var $alert = h();

    if (this.localShow) {
      var dismissible = this.dismissible,
          variant = this.variant;
      var $dismissButton = h();

      if (dismissible) {
        // Add dismiss button
        $dismissButton = h(BButtonClose, {
          attrs: {
            'aria-label': this.dismissLabel
          },
          on: {
            click: this.dismiss
          }
        }, [this.normalizeSlot(SLOT_NAME_DISMISS)]);
      }

      $alert = h('div', {
        staticClass: 'alert',
        class: _defineProperty({
          'alert-dismissible': dismissible
        }, "alert-".concat(variant), variant),
        attrs: {
          role: 'alert',
          'aria-live': 'polite',
          'aria-atomic': true
        },
        key: this[COMPONENT_UID_KEY]
      }, [$dismissButton, this.normalizeSlot()]);
    }

    return h(BVTransition, {
      props: {
        noFade: !this.fade
      }
    }, [$alert]);
  }
});