var _watch;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_FORM_DATEPICKER } from '../../constants/components';
import { EVENT_NAME_CONTEXT, EVENT_NAME_HIDDEN, EVENT_NAME_SHOWN } from '../../constants/events';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_DATE_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_BUTTON_CONTENT } from '../../constants/slots';
import { createDate, constrainDate, formatYMD, parseYMD } from '../../utils/date';
import { attemptBlur, attemptFocus } from '../../utils/dom';
import { isUndefinedOrNull } from '../../utils/inspect';
import { makeModelMixin } from '../../utils/model';
import { omit, pick, sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable, pluckProps } from '../../utils/props';
import { idMixin, props as idProps } from '../../mixins/id';
import { BIconCalendar, BIconCalendarFill } from '../../icons/icons';
import { BButton } from '../button/button';
import { BCalendar, props as BCalendarProps } from '../calendar/calendar';
import { BVFormBtnLabelControl, props as BVFormBtnLabelControlProps } from '../form-btn-label-control/bv-form-btn-label-control'; // --- Constants ---

var _makeModelMixin = makeModelMixin('value', {
  type: PROP_TYPE_DATE_STRING
}),
    modelMixin = _makeModelMixin.mixin,
    modelProps = _makeModelMixin.props,
    MODEL_PROP_NAME = _makeModelMixin.prop,
    MODEL_EVENT_NAME = _makeModelMixin.event; // --- Props ---


var calendarProps = omit(BCalendarProps, ['block', 'hidden', 'id', 'noKeyNav', 'roleDescription', 'value', 'width']);
var formBtnLabelControlProps = omit(BVFormBtnLabelControlProps, ['formattedValue', 'id', 'lang', 'rtl', 'value']);
export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, idProps), modelProps), calendarProps), formBtnLabelControlProps), {}, {
  // Width of the calendar dropdown
  calendarWidth: makeProp(PROP_TYPE_STRING, '270px'),
  closeButton: makeProp(PROP_TYPE_BOOLEAN, false),
  closeButtonVariant: makeProp(PROP_TYPE_STRING, 'outline-secondary'),
  // Dark mode
  dark: makeProp(PROP_TYPE_BOOLEAN, false),
  labelCloseButton: makeProp(PROP_TYPE_STRING, 'Close'),
  labelResetButton: makeProp(PROP_TYPE_STRING, 'Reset'),
  labelTodayButton: makeProp(PROP_TYPE_STRING, 'Select today'),
  noCloseOnSelect: makeProp(PROP_TYPE_BOOLEAN, false),
  resetButton: makeProp(PROP_TYPE_BOOLEAN, false),
  resetButtonVariant: makeProp(PROP_TYPE_STRING, 'outline-danger'),
  resetValue: makeProp(PROP_TYPE_DATE_STRING),
  todayButton: makeProp(PROP_TYPE_BOOLEAN, false),
  todayButtonVariant: makeProp(PROP_TYPE_STRING, 'outline-primary')
})), NAME_FORM_DATEPICKER); // --- Main component ---
// @vue/component

export var BFormDatepicker = /*#__PURE__*/Vue.extend({
  name: NAME_FORM_DATEPICKER,
  mixins: [idMixin, modelMixin],
  props: props,
  data: function data() {
    return {
      // We always use `YYYY-MM-DD` value internally
      localYMD: formatYMD(this[MODEL_PROP_NAME]) || '',
      // If the popup is open
      isVisible: false,
      // Context data from BCalendar
      localLocale: null,
      isRTL: false,
      formattedValue: '',
      activeYMD: ''
    };
  },
  computed: {
    calendarYM: function calendarYM() {
      // Returns the calendar year/month
      // Returns the `YYYY-MM` portion of the active calendar date
      return this.activeYMD.slice(0, -3);
    },
    computedLang: function computedLang() {
      return (this.localLocale || '').replace(/-u-.*$/i, '') || null;
    },
    computedResetValue: function computedResetValue() {
      return formatYMD(constrainDate(this.resetValue)) || '';
    }
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME, function (newValue) {
    this.localYMD = formatYMD(newValue) || '';
  }), _defineProperty(_watch, "localYMD", function localYMD(newValue) {
    // We only update the v-model when the datepicker is open
    if (this.isVisible) {
      this.$emit(MODEL_EVENT_NAME, this.valueAsDate ? parseYMD(newValue) || null : newValue || '');
    }
  }), _defineProperty(_watch, "calendarYM", function calendarYM(newValue, oldValue) {
    // Displayed calendar month has changed
    // So possibly the calendar height has changed...
    // We need to update popper computed position
    if (newValue !== oldValue && oldValue) {
      try {
        this.$refs.control.updatePopper();
      } catch (_unused) {}
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
    setAndClose: function setAndClose(ymd) {
      var _this = this;

      this.localYMD = ymd; // Close calendar popup, unless `noCloseOnSelect`

      if (!this.noCloseOnSelect) {
        this.$nextTick(function () {
          _this.$refs.control.hide(true);
        });
      }
    },
    onSelected: function onSelected(ymd) {
      var _this2 = this;

      this.$nextTick(function () {
        _this2.setAndClose(ymd);
      });
    },
    onInput: function onInput(ymd) {
      if (this.localYMD !== ymd) {
        this.localYMD = ymd;
      }
    },
    onContext: function onContext(ctx) {
      var activeYMD = ctx.activeYMD,
          isRTL = ctx.isRTL,
          locale = ctx.locale,
          selectedYMD = ctx.selectedYMD,
          selectedFormatted = ctx.selectedFormatted;
      this.isRTL = isRTL;
      this.localLocale = locale;
      this.formattedValue = selectedFormatted;
      this.localYMD = selectedYMD;
      this.activeYMD = activeYMD; // Re-emit the context event

      this.$emit(EVENT_NAME_CONTEXT, ctx);
    },
    onTodayButton: function onTodayButton() {
      // Set to today (or min/max if today is out of range)
      this.setAndClose(formatYMD(constrainDate(createDate(), this.min, this.max)));
    },
    onResetButton: function onResetButton() {
      this.setAndClose(this.computedResetValue);
    },
    onCloseButton: function onCloseButton() {
      this.$refs.control.hide(true);
    },
    // Menu handlers
    onShow: function onShow() {
      this.isVisible = true;
    },
    onShown: function onShown() {
      var _this3 = this;

      this.$nextTick(function () {
        attemptFocus(_this3.$refs.calendar);

        _this3.$emit(EVENT_NAME_SHOWN);
      });
    },
    onHidden: function onHidden() {
      this.isVisible = false;
      this.$emit(EVENT_NAME_HIDDEN);
    },
    // Render helpers
    defaultButtonFn: function defaultButtonFn(_ref) {
      var isHovered = _ref.isHovered,
          hasFocus = _ref.hasFocus;
      return this.$createElement(isHovered || hasFocus ? BIconCalendarFill : BIconCalendar, {
        attrs: {
          'aria-hidden': 'true'
        }
      });
    }
  },
  render: function render(h) {
    var localYMD = this.localYMD,
        disabled = this.disabled,
        readonly = this.readonly,
        dark = this.dark,
        $props = this.$props,
        $scopedSlots = this.$scopedSlots;
    var placeholder = isUndefinedOrNull(this.placeholder) ? this.labelNoDateSelected : this.placeholder; // Optional footer buttons

    var $footer = [];

    if (this.todayButton) {
      var label = this.labelTodayButton;
      $footer.push(h(BButton, {
        props: {
          disabled: disabled || readonly,
          size: 'sm',
          variant: this.todayButtonVariant
        },
        attrs: {
          'aria-label': label || null
        },
        on: {
          click: this.onTodayButton
        }
      }, label));
    }

    if (this.resetButton) {
      var _label = this.labelResetButton;
      $footer.push(h(BButton, {
        props: {
          disabled: disabled || readonly,
          size: 'sm',
          variant: this.resetButtonVariant
        },
        attrs: {
          'aria-label': _label || null
        },
        on: {
          click: this.onResetButton
        }
      }, _label));
    }

    if (this.closeButton) {
      var _label2 = this.labelCloseButton;
      $footer.push(h(BButton, {
        props: {
          disabled: disabled,
          size: 'sm',
          variant: this.closeButtonVariant
        },
        attrs: {
          'aria-label': _label2 || null
        },
        on: {
          click: this.onCloseButton
        }
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

    var $calendar = h(BCalendar, {
      staticClass: 'b-form-date-calendar w-100',
      props: _objectSpread(_objectSpread({}, pluckProps(calendarProps, $props)), {}, {
        hidden: !this.isVisible,
        value: localYMD,
        valueAsDate: false,
        width: this.calendarWidth
      }),
      on: {
        selected: this.onSelected,
        input: this.onInput,
        context: this.onContext
      },
      scopedSlots: pick($scopedSlots, ['nav-prev-decade', 'nav-prev-year', 'nav-prev-month', 'nav-this-month', 'nav-next-month', 'nav-next-year', 'nav-next-decade']),
      key: 'calendar',
      ref: 'calendar'
    }, $footer);
    return h(BVFormBtnLabelControl, {
      staticClass: 'b-form-datepicker',
      props: _objectSpread(_objectSpread({}, pluckProps(formBtnLabelControlProps, $props)), {}, {
        formattedValue: localYMD ? this.formattedValue : '',
        id: this.safeId(),
        lang: this.computedLang,
        menuClass: [{
          'bg-dark': dark,
          'text-light': dark
        }, this.menuClass],
        placeholder: placeholder,
        rtl: this.isRTL,
        value: localYMD
      }),
      on: {
        show: this.onShow,
        shown: this.onShown,
        hidden: this.onHidden
      },
      scopedSlots: _defineProperty({}, SLOT_NAME_BUTTON_CONTENT, $scopedSlots[SLOT_NAME_BUTTON_CONTENT] || this.defaultButtonFn),
      ref: 'control'
    }, [$calendar]);
  }
});