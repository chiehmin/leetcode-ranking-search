var _watch;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../vue';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_BOOLEAN_STRING, PROP_TYPE_STRING } from '../constants/props';
import { SLOT_NAME_FIRST } from '../constants/slots';
import { htmlOrText } from '../utils/html';
import { looseEqual } from '../utils/loose-equal';
import { makeModelMixin } from '../utils/model';
import { omit, pick, sortKeys } from '../utils/object';
import { makeProp, makePropsConfigurable } from '../utils/props';
import { BFormCheckbox } from '../components/form-checkbox/form-checkbox';
import { BFormRadio } from '../components/form-radio/form-radio';
import { formControlMixin, props as formControlProps } from './form-control';
import { formCustomMixin, props as formCustomProps } from './form-custom';
import { formOptionsMixin, props as formOptionsProps } from './form-options';
import { formSizeMixin, props as formSizeProps } from './form-size';
import { formStateMixin, props as formStateProps } from './form-state';
import { idMixin, props as idProps } from './id';
import { normalizeSlotMixin } from './normalize-slot'; // --- Constants ---
// Attributes to pass down to checks/radios instead of applying them to the group

var PASS_DOWN_ATTRS = ['aria-describedby', 'aria-labelledby'];

var _makeModelMixin = makeModelMixin('checked'),
    modelMixin = _makeModelMixin.mixin,
    modelProps = _makeModelMixin.props,
    MODEL_PROP_NAME = _makeModelMixin.prop,
    MODEL_EVENT_NAME = _makeModelMixin.event;

export { MODEL_PROP_NAME, MODEL_EVENT_NAME }; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, idProps), modelProps), formControlProps), formOptionsProps), formSizeProps), formStateProps), formCustomProps), {}, {
  ariaInvalid: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
  // Only applicable when rendered with button style
  buttonVariant: makeProp(PROP_TYPE_STRING),
  // Render as button style
  buttons: makeProp(PROP_TYPE_BOOLEAN, false),
  stacked: makeProp(PROP_TYPE_BOOLEAN, false),
  validated: makeProp(PROP_TYPE_BOOLEAN, false)
})), 'formRadioCheckGroups'); // --- Mixin ---
// @vue/component

export var formRadioCheckGroupMixin = Vue.extend({
  mixins: [idMixin, modelMixin, normalizeSlotMixin, formControlMixin, formOptionsMixin, formSizeMixin, formStateMixin, formCustomMixin],
  inheritAttrs: false,
  props: props,
  data: function data() {
    return {
      localChecked: this[MODEL_PROP_NAME]
    };
  },
  computed: {
    inline: function inline() {
      return !this.stacked;
    },
    groupName: function groupName() {
      // Checks/Radios tied to the same model must have the same name,
      // especially for ARIA accessibility
      return this.name || this.safeId();
    },
    groupClasses: function groupClasses() {
      var inline = this.inline,
          size = this.size,
          validated = this.validated;
      var classes = {
        'was-validated': validated
      };

      if (this.buttons) {
        classes = [classes, 'btn-group-toggle', _defineProperty({
          'btn-group': inline,
          'btn-group-vertical': !inline
        }, "btn-group-".concat(size), size)];
      }

      return classes;
    }
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME, function (newValue) {
    if (!looseEqual(newValue, this.localChecked)) {
      this.localChecked = newValue;
    }
  }), _defineProperty(_watch, "localChecked", function localChecked(newValue, oldValue) {
    if (!looseEqual(newValue, oldValue)) {
      this.$emit(MODEL_EVENT_NAME, newValue);
    }
  }), _watch),
  render: function render(h) {
    var _this = this;

    var isRadioGroup = this.isRadioGroup;
    var attrs = pick(this.$attrs, PASS_DOWN_ATTRS);
    var optionComponent = isRadioGroup ? BFormRadio : BFormCheckbox;
    var $inputs = this.formOptions.map(function (option, index) {
      var key = "BV_option_".concat(index);
      return h(optionComponent, {
        props: {
          // Individual radios or checks can be disabled in a group
          disabled: option.disabled || false,
          id: _this.safeId(key),
          value: option.value // We don't need to include these, since the input's will know they are inside here
          // form: this.form || null,
          // name: this.groupName,
          // required: Boolean(this.name && this.required)

        },
        attrs: attrs,
        key: key
      }, [h('span', {
        domProps: htmlOrText(option.html, option.text)
      })]);
    });
    return h('div', {
      class: [this.groupClasses, 'bv-no-focus-ring'],
      attrs: _objectSpread(_objectSpread({}, omit(this.$attrs, PASS_DOWN_ATTRS)), {}, {
        'aria-invalid': this.computedAriaInvalid,
        'aria-required': this.required ? 'true' : null,
        id: this.safeId(),
        role: isRadioGroup ? 'radiogroup' : 'group',
        // Add `tabindex="-1"` to allow group to be focused if needed by screen readers
        tabindex: '-1'
      })
    }, [this.normalizeSlot(SLOT_NAME_FIRST), $inputs, this.normalizeSlot()]);
  }
});