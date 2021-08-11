var _watch;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_FORM_TIMEPICKER } from '../../constants/components';
import { EVENT_NAME_CONTEXT, EVENT_NAME_SHOWN, EVENT_NAME_HIDDEN } from '../../constants/events';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_DATE_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_BUTTON_CONTENT } from '../../constants/slots';
import { attemptBlur, attemptFocus } from '../../utils/dom';
import { isUndefinedOrNull } from '../../utils/inspect';
import { makeModelMixin } from '../../utils/model';
import { omit, sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable, pluckProps } from '../../utils/props';
import { idMixin, props as idProps } from '../../mixins/id';
import { BIconClock, BIconClockFill } from '../../icons/icons';
import { BButton } from '../button/button';
import { BVFormBtnLabelControl, props as BVFormBtnLabelControlProps } from '../form-btn-label-control/bv-form-btn-label-control';
import { BTime, props as BTimeProps } from '../time/time'; // --- Constants ---

var _makeModelMixin = makeModelMixin('value', {
  type: PROP_TYPE_STRING,
  defaultValue: ''
}),
    modelMixin = _makeModelMixin.mixin,
    modelProps = _makeModelMixin.props,
    MODEL_PROP_NAME = _makeModelMixin.prop,
    MODEL_EVENT_NAME = _makeModelMixin.event; // --- Props ---


var timeProps = omit(BTimeProps, ['hidden', 'id', 'value']);
var formBtnLabelControlProps = omit(BVFormBtnLabelControlProps, ['formattedValue', 'id', 'lang', 'rtl', 'value']);
export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, idProps), modelProps), timeProps), formBtnLabelControlProps), {}, {
  closeButtonVariant: makeProp(PROP_TYPE_STRING, 'outline-secondary'),
  labelCloseButton: makeProp(PROP_TYPE_STRING, 'Close'),
  labelNowButton: makeProp(PROP_TYPE_STRING, 'Select now'),
  labelResetButton: makeProp(PROP_TYPE_STRING, 'Reset'),
  noCloseButton: makeProp(PROP_TYPE_BOOLEAN, false),
  nowButton: makeProp(PROP_TYPE_BOOLEAN, false),
  nowButtonVariant: makeProp(PROP_TYPE_STRING, 'outline-primary'),
  resetButton: makeProp(PROP_TYPE_BOOLEAN, false),
  resetButtonVariant: makeProp(PROP_TYPE_STRING, 'outline-danger'),
  resetValue: makeProp(PROP_TYPE_DATE_STRING)
})), NAME_FORM_TIMEPICKER); // --- Main component ---
// @vue/component

export var BFormTimepicker = /*#__PURE__*/Vue.extend({
  name: NAME_FORM_TIMEPICKER,
  mixins: [idMixin, modelMixin],
  props: props,
  data: function data() {
    return {
      // We always use `HH:mm:ss` value internally
      localHMS: this[MODEL_PROP_NAME] || '',
      // Context data from BTime
      localLocale: null,
      isRTL: false,
      formattedValue: '',
      // If the menu is opened
      isVisible: false
    };
  },
  computed: {
    computedLang: function computedLang() {
      return (this.localLocale || '').replace(/-u-.*$/i, '') || null;
    }
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME, function (newValue) {
    this.localHMS = newValue || '';
  }), _defineProperty(_watch, "localHMS", function localHMS(newValue) {
    // We only update the v-model value when the timepicker
    // is open, to prevent cursor jumps when bound to a
    // text input in button only mode
    if (this.isVisible) {
      this.$emit(MODEL_EVENT_NAME, newValue || '');
    }
  }), _watch),
  methods: {
    // Public methods
    focus: function focus() {
      if (!this.disabled) {
        attemptFocus(this.$refs.control);
      }
    },
    blur: function blur() {
      if (!this.disabled) {
        attemptBlur(this.$refs.control);
      }
    },
    // Private methods
    setAndClose: function setAndClose(value) {
      var _this = this;

      this.localHMS = value;
      this.$nextTick(function () {
        _this.$refs.control.hide(true);
      });
    },
    onInput: function onInput(hms) {
      if (this.localHMS !== hms) {
        this.localHMS = hms;
      }
    },
    onContext: function onContext(ctx) {
      var isRTL = ctx.isRTL,
          locale = ctx.locale,
          value = ctx.value,
          formatted = ctx.formatted;
      this.isRTL = isRTL;
      this.localLocale = locale;
      this.formattedValue = formatted;
      this.localHMS = value || ''; // Re-emit the context event

      this.$emit(EVENT_NAME_CONTEXT, ctx);
    },
    onNowButton: function onNowButton() {
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var seconds = this.showSeconds ? now.getSeconds() : 0;
      var value = [hours, minutes, seconds].map(function (v) {
        return "00".concat(v || '').slice(-2);
      }).join(':');
      this.setAndClose(value);
    },
    onResetButton: function onResetButton() {
      this.setAndClose(this.resetValue);
    },
    onCloseButton: function onCloseButton() {
      this.$refs.control.hide(true);
    },
    onShow: function onShow() {
      this.isVisible = true;
    },
    onShown: function onShown() {
      var _this2 = this;

      this.$nextTick(function () {
        attemptFocus(_this2.$refs.time);

        _this2.$emit(EVENT_NAME_SHOWN);
      });
    },
    onHidden: function onHidden() {
      this.isVisible = false;
      this.$emit(EVENT_NAME_HIDDEN);
    },
    // Render function helpers
    defaultButtonFn: function defaultButtonFn(_ref) {
      var isHovered = _ref.isHovered,
          hasFocus = _ref.hasFocus;
      return this.$createElement(isHovered || hasFocus ? BIconClockFill : BIconClock, {
        attrs: {
          'aria-hidden': 'true'
        }
      });
    }
  },
  render: function render(h) {
    var localHMS = this.localHMS,
        disabled = this.disabled,
        readonly = this.readonly,
        $props = this.$props;
    var placeholder = isUndefinedOrNull(this.placeholder) ? this.labelNoTimeSelected : this.placeholder; // Footer buttons

    var $footer = [];

    if (this.nowButton) {
      var label = this.labelNowButton;
      $footer.push(h(BButton, {
        props: {
          size: 'sm',
          disabled: disabled || readonly,
          variant: this.nowButtonVariant
        },
        attrs: {
          'aria-label': label || null
        },
        on: {
          click: this.onNowButton
        },
        key: 'now-btn'
      }, label));
    }

    if (this.resetButton) {
      if ($footer.length > 0) {
        // Add a "spacer" between buttons ('&nbsp;')
        $footer.push(h('span', "\xA0"));
      }

      var _label = this.labelResetButton;
      $footer.push(h(BButton, {
        props: {
          size: 'sm',
          disabled: disabled || readonly,
          variant: this.resetButtonVariant
        },
        attrs: {
          'aria-label': _label || null
        },
        on: {
          click: this.onResetButton
        },
        key: 'reset-btn'
      }, _label));
    }

    if (!this.noCloseButton) {
      // Add a "spacer" between buttons ('&nbsp;')
      if ($footer.length > 0) {
        $footer.push(h('span', "\xA0"));
      }

      var _label2 = this.labelCloseButton;
      $footer.push(h(BButton, {
        props: {
          size: 'sm',
          disabled: disabled,
          variant: this.closeButtonVariant
        },
        attrs: {
          'aria-label': _label2 || null
        },
        on: {
          click: this.onCloseButton
        },
        key: 'close-btn'
      }, _label2));
    }

    if ($footer.length > 0) {
      $footer = [h('div', {
        staticClass: 'b-form-date-controls d-flex flex-wrap',
        class: {
          'justify-content-between': $footer.length > 1,
          'justify-content-end': $footer.length < 2
        }
      }, $footer)];
    }

    var $time = h(BTime, {
      staticClass: 'b-form-time-control',
      props: _objectSpread(_objectSpread({}, pluckProps(timeProps, $props)), {}, {
        value: localHMS,
        hidden: !this.isVisible
      }),
      on: {
        input: this.onInput,
        context: this.onContext
      },
      ref: 'time'
    }, $footer);
    return h(BVFormBtnLabelControl, {
      staticClass: 'b-form-timepicker',
      props: _objectSpread(_objectSpread({}, pluckProps(formBtnLabelControlProps, $props)), {}, {
        id: this.safeId(),
        value: localHMS,
        formattedValue: localHMS ? this.formattedValue : '',
        placeholder: placeholder,
        rtl: this.isRTL,
        lang: this.computedLang
      }),
      on: {
        show: this.onShow,
        shown: this.onShown,
        hidden: this.onHidden
      },
      scopedSlots: _defineProperty({}, SLOT_NAME_BUTTON_CONTENT, this.$scopedSlots[SLOT_NAME_BUTTON_CONTENT] || this.defaultButtonFn),
      ref: 'control'
    }, [$time]);
  }
});