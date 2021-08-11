function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
// Private component used by `b-form-datepicker` and `b-form-timepicker`
//
import { Vue } from '../../vue';
import { NAME_FORM_BUTTON_LABEL_CONTROL } from '../../constants/components';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_BUTTON_CONTENT, SLOT_NAME_DEFAULT } from '../../constants/slots';
import { attemptBlur, attemptFocus } from '../../utils/dom';
import { stopEvent } from '../../utils/events';
import { omit, sortKeys } from '../../utils/object';
import { makeProp } from '../../utils/props';
import { toString } from '../../utils/string';
import { dropdownMixin, props as dropdownProps } from '../../mixins/dropdown';
import { props as formControlProps } from '../../mixins/form-control';
import { formSizeMixin, props as formSizeProps } from '../../mixins/form-size';
import { formStateMixin, props as formStateProps } from '../../mixins/form-state';
import { idMixin, props as idProps } from '../../mixins/id';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { VBHover } from '../../directives/hover/hover';
import { BIconChevronDown } from '../../icons/icons'; // --- Props ---

export var props = sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, idProps), formSizeProps), formStateProps), omit(dropdownProps, ['disabled'])), omit(formControlProps, ['autofocus'])), {}, {
  // When `true`, renders a `btn-group` wrapper and visually hides the label
  buttonOnly: makeProp(PROP_TYPE_BOOLEAN, false),
  // Applicable in button mode only
  buttonVariant: makeProp(PROP_TYPE_STRING, 'secondary'),
  // This is the value shown in the label
  // Defaults back to `value`
  formattedValue: makeProp(PROP_TYPE_STRING),
  // Value placed in `.sr-only` span inside label when value is present
  labelSelected: makeProp(PROP_TYPE_STRING),
  lang: makeProp(PROP_TYPE_STRING),
  // Extra classes to apply to the `dropdown-menu` div
  menuClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  // This is the value placed on the hidden input when no value selected
  placeholder: makeProp(PROP_TYPE_STRING),
  readonly: makeProp(PROP_TYPE_BOOLEAN, false),
  // Tri-state prop: `true`, `false` or `null`
  rtl: makeProp(PROP_TYPE_BOOLEAN, null),
  value: makeProp(PROP_TYPE_STRING, '')
})); // --- Main component ---
// @vue/component

export var BVFormBtnLabelControl = /*#__PURE__*/Vue.extend({
  name: NAME_FORM_BUTTON_LABEL_CONTROL,
  directives: {
    'b-hover': VBHover
  },
  mixins: [idMixin, formSizeMixin, formStateMixin, dropdownMixin, normalizeSlotMixin],
  props: props,
  data: function data() {
    return {
      isHovered: false,
      hasFocus: false
    };
  },
  computed: {
    idButton: function idButton() {
      return this.safeId();
    },
    idLabel: function idLabel() {
      return this.safeId('_value_');
    },
    idMenu: function idMenu() {
      return this.safeId('_dialog_');
    },
    idWrapper: function idWrapper() {
      return this.safeId('_outer_');
    },
    computedDir: function computedDir() {
      return this.rtl === true ? 'rtl' : this.rtl === false ? 'ltr' : null;
    }
  },
  methods: {
    focus: function focus() {
      if (!this.disabled) {
        attemptFocus(this.$refs.toggle);
      }
    },
    blur: function blur() {
      if (!this.disabled) {
        attemptBlur(this.$refs.toggle);
      }
    },
    setFocus: function setFocus(event) {
      this.hasFocus = event.type === 'focus';
    },
    handleHover: function handleHover(hovered) {
      this.isHovered = hovered;
    }
  },
  render: function render(h) {
    var _class;

    var idButton = this.idButton,
        idLabel = this.idLabel,
        idMenu = this.idMenu,
        idWrapper = this.idWrapper,
        disabled = this.disabled,
        readonly = this.readonly,
        required = this.required,
        name = this.name,
        state = this.state,
        visible = this.visible,
        size = this.size,
        isHovered = this.isHovered,
        hasFocus = this.hasFocus,
        labelSelected = this.labelSelected,
        buttonVariant = this.buttonVariant,
        buttonOnly = this.buttonOnly;
    var value = toString(this.value) || '';
    var invalid = state === false || required && !value;
    var btnScope = {
      isHovered: isHovered,
      hasFocus: hasFocus,
      state: state,
      opened: visible
    };
    var $button = h('button', {
      staticClass: 'btn',
      class: (_class = {}, _defineProperty(_class, "btn-".concat(buttonVariant), buttonOnly), _defineProperty(_class, "btn-".concat(size), size), _defineProperty(_class, 'h-auto', !buttonOnly), _defineProperty(_class, 'dropdown-toggle', buttonOnly), _defineProperty(_class, 'dropdown-toggle-no-caret', buttonOnly), _class),
      attrs: {
        id: idButton,
        type: 'button',
        disabled: disabled,
        'aria-haspopup': 'dialog',
        'aria-expanded': visible ? 'true' : 'false',
        'aria-invalid': invalid ? 'true' : null,
        'aria-required': required ? 'true' : null
      },
      directives: [{
        name: 'b-hover',
        value: this.handleHover
      }],
      on: {
        mousedown: this.onMousedown,
        click: this.toggle,
        keydown: this.toggle,
        // Handle ENTER, SPACE and DOWN
        '!focus': this.setFocus,
        '!blur': this.setFocus
      },
      ref: 'toggle'
    }, [this.hasNormalizedSlot(SLOT_NAME_BUTTON_CONTENT) ? this.normalizeSlot(SLOT_NAME_BUTTON_CONTENT, btnScope) :
    /* istanbul ignore next */
    h(BIconChevronDown, {
      props: {
        scale: 1.25
      }
    })]); // Hidden input

    var $hidden = h();

    if (name && !disabled) {
      $hidden = h('input', {
        attrs: {
          type: 'hidden',
          name: name || null,
          form: this.form || null,
          value: value
        }
      });
    } // Dropdown content


    var $menu = h('div', {
      staticClass: 'dropdown-menu',
      class: [this.menuClass, {
        show: visible,
        'dropdown-menu-right': this.right
      }],
      attrs: {
        id: idMenu,
        role: 'dialog',
        tabindex: '-1',
        'aria-modal': 'false',
        'aria-labelledby': idLabel
      },
      on: {
        keydown: this.onKeydown // Handle ESC

      },
      ref: 'menu'
    }, [this.normalizeSlot(SLOT_NAME_DEFAULT, {
      opened: visible
    })]); // Value label

    var $label = h('label', {
      class: buttonOnly ? 'sr-only' // Hidden in button only mode
      : ['form-control', // Mute the text if showing the placeholder
      {
        'text-muted': !value
      }, this.stateClass, this.sizeFormClass],
      attrs: {
        id: idLabel,
        for: idButton,
        'aria-invalid': invalid ? 'true' : null,
        'aria-required': required ? 'true' : null
      },
      directives: [{
        name: 'b-hover',
        value: this.handleHover
      }],
      on: {
        // Disable bubbling of the click event to
        // prevent menu from closing and re-opening
        '!click':
        /* istanbul ignore next */
        function click(event) {
          stopEvent(event, {
            preventDefault: false
          });
        }
      }
    }, [value ? this.formattedValue || value : this.placeholder || '', // Add the selected label for screen readers when a value is provided
    value && labelSelected ? h('bdi', {
      staticClass: 'sr-only'
    }, labelSelected) : '']); // Return the custom form control wrapper

    return h('div', {
      staticClass: 'b-form-btn-label-control dropdown',
      class: [this.directionClass, this.boundaryClass, [{
        'btn-group': buttonOnly,
        'form-control': !buttonOnly,
        focus: hasFocus && !buttonOnly,
        show: visible,
        'is-valid': state === true,
        'is-invalid': state === false
      }, buttonOnly ? null : this.sizeFormClass]],
      attrs: {
        id: idWrapper,
        role: buttonOnly ? null : 'group',
        lang: this.lang || null,
        dir: this.computedDir,
        'aria-disabled': disabled,
        'aria-readonly': readonly && !disabled,
        'aria-labelledby': idLabel,
        'aria-invalid': state === false || required && !value ? 'true' : null,
        'aria-required': required ? 'true' : null
      }
    }, [$button, $hidden, $menu, $label]);
  }
});