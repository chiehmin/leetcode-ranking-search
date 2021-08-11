var _watch, _methods;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../vue';
import { PROP_TYPE_ANY, PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../constants/props';
import { EVENT_NAME_CHANGE } from '../constants/events';
import { attemptBlur, attemptFocus } from '../utils/dom';
import { isBoolean } from '../utils/inspect';
import { looseEqual } from '../utils/loose-equal';
import { makeModelMixin } from '../utils/model';
import { sortKeys } from '../utils/object';
import { makeProp, makePropsConfigurable } from '../utils/props';
import { attrsMixin } from './attrs';
import { formControlMixin, props as formControlProps } from './form-control';
import { formCustomMixin, props as formCustomProps } from './form-custom';
import { formSizeMixin, props as formSizeProps } from './form-size';
import { formStateMixin, props as formStateProps } from './form-state';
import { idMixin, props as idProps } from './id';
import { normalizeSlotMixin } from './normalize-slot'; // --- Constants ---

var _makeModelMixin = makeModelMixin('checked', {
  defaultValue: null
}),
    modelMixin = _makeModelMixin.mixin,
    modelProps = _makeModelMixin.props,
    MODEL_PROP_NAME = _makeModelMixin.prop,
    MODEL_EVENT_NAME = _makeModelMixin.event;

export { MODEL_PROP_NAME, MODEL_EVENT_NAME }; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, idProps), modelProps), formControlProps), formSizeProps), formStateProps), formCustomProps), {}, {
  ariaLabel: makeProp(PROP_TYPE_STRING),
  ariaLabelledby: makeProp(PROP_TYPE_STRING),
  // Only applicable in standalone mode (non group)
  button: makeProp(PROP_TYPE_BOOLEAN, false),
  // Only applicable when rendered with button style
  buttonVariant: makeProp(PROP_TYPE_STRING),
  inline: makeProp(PROP_TYPE_BOOLEAN, false),
  value: makeProp(PROP_TYPE_ANY)
})), 'formRadioCheckControls'); // --- Mixin ---
// @vue/component

export var formRadioCheckMixin = Vue.extend({
  mixins: [attrsMixin, idMixin, modelMixin, normalizeSlotMixin, formControlMixin, formSizeMixin, formStateMixin, formCustomMixin],
  inheritAttrs: false,
  props: props,
  data: function data() {
    return {
      localChecked: this.isGroup ? this.bvGroup[MODEL_PROP_NAME] : this[MODEL_PROP_NAME],
      hasFocus: false
    };
  },
  computed: {
    computedLocalChecked: {
      get: function get() {
        return this.isGroup ? this.bvGroup.localChecked : this.localChecked;
      },
      set: function set(value) {
        if (this.isGroup) {
          this.bvGroup.localChecked = value;
        } else {
          this.localChecked = value;
        }
      }
    },
    isChecked: function isChecked() {
      return looseEqual(this.value, this.computedLocalChecked);
    },
    isRadio: function isRadio() {
      return true;
    },
    isGroup: function isGroup() {
      // Is this check/radio a child of check-group or radio-group?
      return !!this.bvGroup;
    },
    isBtnMode: function isBtnMode() {
      // Support button style in single input mode
      return this.isGroup ? this.bvGroup.buttons : this.button;
    },
    isPlain: function isPlain() {
      return this.isBtnMode ? false : this.isGroup ? this.bvGroup.plain : this.plain;
    },
    isCustom: function isCustom() {
      return this.isBtnMode ? false : !this.isPlain;
    },
    isSwitch: function isSwitch() {
      // Custom switch styling (checkboxes only)
      return this.isBtnMode || this.isRadio || this.isPlain ? false : this.isGroup ? this.bvGroup.switches : this.switch;
    },
    isInline: function isInline() {
      return this.isGroup ? this.bvGroup.inline : this.inline;
    },
    isDisabled: function isDisabled() {
      // Child can be disabled while parent isn't, but is always disabled if group is
      return this.isGroup ? this.bvGroup.disabled || this.disabled : this.disabled;
    },
    isRequired: function isRequired() {
      // Required only works when a name is provided for the input(s)
      // Child can only be required when parent is
      // Groups will always have a name (either user supplied or auto generated)
      return this.computedName && (this.isGroup ? this.bvGroup.required : this.required);
    },
    computedName: function computedName() {
      // Group name preferred over local name
      return (this.isGroup ? this.bvGroup.groupName : this.name) || null;
    },
    computedForm: function computedForm() {
      return (this.isGroup ? this.bvGroup.form : this.form) || null;
    },
    computedSize: function computedSize() {
      return (this.isGroup ? this.bvGroup.size : this.size) || '';
    },
    computedState: function computedState() {
      return this.isGroup ? this.bvGroup.computedState : isBoolean(this.state) ? this.state : null;
    },
    computedButtonVariant: function computedButtonVariant() {
      // Local variant preferred over group variant
      var buttonVariant = this.buttonVariant;

      if (buttonVariant) {
        return buttonVariant;
      }

      if (this.isGroup && this.bvGroup.buttonVariant) {
        return this.bvGroup.buttonVariant;
      }

      return 'secondary';
    },
    buttonClasses: function buttonClasses() {
      var _ref;

      var computedSize = this.computedSize;
      return ['btn', "btn-".concat(this.computedButtonVariant), (_ref = {}, _defineProperty(_ref, "btn-".concat(computedSize), computedSize), _defineProperty(_ref, "disabled", this.isDisabled), _defineProperty(_ref, "active", this.isChecked), _defineProperty(_ref, "focus", this.hasFocus), _ref)];
    },
    computedAttrs: function computedAttrs() {
      var disabled = this.isDisabled,
          required = this.isRequired;
      return _objectSpread(_objectSpread({}, this.bvAttrs), {}, {
        id: this.safeId(),
        type: this.isRadio ? 'radio' : 'checkbox',
        name: this.computedName,
        form: this.computedForm,
        disabled: disabled,
        required: required,
        'aria-required': required || null,
        'aria-label': this.ariaLabel || null,
        'aria-labelledby': this.ariaLabelledby || null
      });
    }
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME, function () {
    this["".concat(MODEL_PROP_NAME, "Watcher")].apply(this, arguments);
  }), _defineProperty(_watch, "computedLocalChecked", function computedLocalChecked() {
    this.computedLocalCheckedWatcher.apply(this, arguments);
  }), _watch),
  methods: (_methods = {}, _defineProperty(_methods, "".concat(MODEL_PROP_NAME, "Watcher"), function Watcher(newValue) {
    if (!looseEqual(newValue, this.computedLocalChecked)) {
      this.computedLocalChecked = newValue;
    }
  }), _defineProperty(_methods, "computedLocalCheckedWatcher", function computedLocalCheckedWatcher(newValue, oldValue) {
    if (!looseEqual(newValue, oldValue)) {
      this.$emit(MODEL_EVENT_NAME, newValue);
    }
  }), _defineProperty(_methods, "handleChange", function handleChange(_ref2) {
    var _this = this;

    var checked = _ref2.target.checked;
    var value = this.value;
    var localChecked = checked ? value : null;
    this.computedLocalChecked = value; // Fire events in a `$nextTick()` to ensure the `v-model` is updated

    this.$nextTick(function () {
      // Change is only emitted on user interaction
      _this.$emit(EVENT_NAME_CHANGE, localChecked); // If this is a child of a group, we emit a change event on it as well


      if (_this.isGroup) {
        _this.bvGroup.$emit(EVENT_NAME_CHANGE, localChecked);
      }
    });
  }), _defineProperty(_methods, "handleFocus", function handleFocus(event) {
    // When in buttons mode, we need to add 'focus' class to label when input focused
    // As it is the hidden input which has actual focus
    if (event.target) {
      if (event.type === 'focus') {
        this.hasFocus = true;
      } else if (event.type === 'blur') {
        this.hasFocus = false;
      }
    }
  }), _defineProperty(_methods, "focus", function focus() {
    if (!this.isDisabled) {
      attemptFocus(this.$refs.input);
    }
  }), _defineProperty(_methods, "blur", function blur() {
    if (!this.isDisabled) {
      attemptBlur(this.$refs.input);
    }
  }), _methods),
  render: function render(h) {
    var isRadio = this.isRadio,
        isBtnMode = this.isBtnMode,
        isPlain = this.isPlain,
        isCustom = this.isCustom,
        isInline = this.isInline,
        isSwitch = this.isSwitch,
        computedSize = this.computedSize,
        bvAttrs = this.bvAttrs;
    var $content = this.normalizeSlot();
    var $input = h('input', {
      class: [{
        'form-check-input': isPlain,
        'custom-control-input': isCustom,
        // https://github.com/bootstrap-vue/bootstrap-vue/issues/2911
        'position-static': isPlain && !$content
      }, isBtnMode ? '' : this.stateClass],
      directives: [{
        name: 'model',
        value: this.computedLocalChecked
      }],
      attrs: this.computedAttrs,
      domProps: {
        value: this.value,
        checked: this.isChecked
      },
      on: _objectSpread({
        change: this.handleChange
      }, isBtnMode ? {
        focus: this.handleFocus,
        blur: this.handleFocus
      } : {}),
      key: 'input',
      ref: 'input'
    });

    if (isBtnMode) {
      var $button = h('label', {
        class: this.buttonClasses
      }, [$input, $content]);

      if (!this.isGroup) {
        // Standalone button mode, so wrap in 'btn-group-toggle'
        // and flag it as inline-block to mimic regular buttons
        $button = h('div', {
          class: ['btn-group-toggle', 'd-inline-block']
        }, [$button]);
      }

      return $button;
    } // If no label content in plain mode we dont render the label
    // See: https://github.com/bootstrap-vue/bootstrap-vue/issues/2911


    var $label = h();

    if (!(isPlain && !$content)) {
      $label = h('label', {
        class: {
          'form-check-label': isPlain,
          'custom-control-label': isCustom
        },
        attrs: {
          for: this.safeId()
        }
      }, $content);
    }

    return h('div', {
      class: [_defineProperty({
        'form-check': isPlain,
        'form-check-inline': isPlain && isInline,
        'custom-control': isCustom,
        'custom-control-inline': isCustom && isInline,
        'custom-checkbox': isCustom && !isRadio && !isSwitch,
        'custom-switch': isSwitch,
        'custom-radio': isCustom && isRadio
      }, "b-custom-control-".concat(computedSize), computedSize && !isBtnMode), bvAttrs.class],
      style: bvAttrs.style
    }, [$input, $label]);
  }
});