function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_DROPDOWN } from '../../constants/components';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_OBJECT_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_BUTTON_CONTENT, SLOT_NAME_DEFAULT } from '../../constants/slots';
import { arrayIncludes } from '../../utils/array';
import { htmlOrText } from '../../utils/html';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { toString } from '../../utils/string';
import { dropdownMixin, props as dropdownProps } from '../../mixins/dropdown';
import { idMixin, props as idProps } from '../../mixins/id';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BButton } from '../button/button';
import { sortKeys } from '../../utils/object'; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread({}, idProps), dropdownProps), {}, {
  block: makeProp(PROP_TYPE_BOOLEAN, false),
  html: makeProp(PROP_TYPE_STRING),
  // If `true`, only render menu contents when open
  lazy: makeProp(PROP_TYPE_BOOLEAN, false),
  menuClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  noCaret: makeProp(PROP_TYPE_BOOLEAN, false),
  role: makeProp(PROP_TYPE_STRING, 'menu'),
  size: makeProp(PROP_TYPE_STRING),
  split: makeProp(PROP_TYPE_BOOLEAN, false),
  splitButtonType: makeProp(PROP_TYPE_STRING, 'button', function (value) {
    return arrayIncludes(['button', 'submit', 'reset'], value);
  }),
  splitClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  splitHref: makeProp(PROP_TYPE_STRING),
  splitTo: makeProp(PROP_TYPE_OBJECT_STRING),
  splitVariant: makeProp(PROP_TYPE_STRING),
  text: makeProp(PROP_TYPE_STRING),
  toggleClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  toggleTag: makeProp(PROP_TYPE_STRING, 'button'),
  // TODO: This really should be `toggleLabel`
  toggleText: makeProp(PROP_TYPE_STRING, 'Toggle dropdown'),
  variant: makeProp(PROP_TYPE_STRING, 'secondary')
})), NAME_DROPDOWN); // --- Main component ---
// @vue/component

export var BDropdown = /*#__PURE__*/Vue.extend({
  name: NAME_DROPDOWN,
  mixins: [idMixin, dropdownMixin, normalizeSlotMixin],
  props: props,
  computed: {
    dropdownClasses: function dropdownClasses() {
      var block = this.block,
          split = this.split;
      return [this.directionClass, this.boundaryClass, {
        show: this.visible,
        // The 'btn-group' class is required in `split` mode for button alignment
        // It needs also to be applied when `block` is disabled to allow multiple
        // dropdowns to be aligned one line
        'btn-group': split || !block,
        // When `block` is enabled and we are in `split` mode the 'd-flex' class
        // needs to be applied to allow the buttons to stretch to full width
        'd-flex': block && split
      }];
    },
    menuClasses: function menuClasses() {
      return [this.menuClass, {
        'dropdown-menu-right': this.right,
        show: this.visible
      }];
    },
    toggleClasses: function toggleClasses() {
      var split = this.split;
      return [this.toggleClass, {
        'dropdown-toggle-split': split,
        'dropdown-toggle-no-caret': this.noCaret && !split
      }];
    }
  },
  render: function render(h) {
    var visible = this.visible,
        variant = this.variant,
        size = this.size,
        block = this.block,
        disabled = this.disabled,
        split = this.split,
        role = this.role,
        hide = this.hide,
        toggle = this.toggle;
    var commonProps = {
      variant: variant,
      size: size,
      block: block,
      disabled: disabled
    };
    var $buttonChildren = this.normalizeSlot(SLOT_NAME_BUTTON_CONTENT);
    var buttonContentDomProps = this.hasNormalizedSlot(SLOT_NAME_BUTTON_CONTENT) ? {} : htmlOrText(this.html, this.text);
    var $split = h();

    if (split) {
      var splitTo = this.splitTo,
          splitHref = this.splitHref,
          splitButtonType = this.splitButtonType;

      var btnProps = _objectSpread(_objectSpread({}, commonProps), {}, {
        variant: this.splitVariant || variant
      }); // We add these as needed due to <router-link> issues with
      // defined property with `undefined`/`null` values


      if (splitTo) {
        btnProps.to = splitTo;
      } else if (splitHref) {
        btnProps.href = splitHref;
      } else if (splitButtonType) {
        btnProps.type = splitButtonType;
      }

      $split = h(BButton, {
        class: this.splitClass,
        attrs: {
          id: this.safeId('_BV_button_')
        },
        props: btnProps,
        domProps: buttonContentDomProps,
        on: {
          click: this.onSplitClick
        },
        ref: 'button'
      }, $buttonChildren); // Overwrite button content for the toggle when in `split` mode

      $buttonChildren = [h('span', {
        class: ['sr-only']
      }, [this.toggleText])];
      buttonContentDomProps = {};
    }

    var $toggle = h(BButton, {
      staticClass: 'dropdown-toggle',
      class: this.toggleClasses,
      attrs: {
        id: this.safeId('_BV_toggle_'),
        'aria-haspopup': 'true',
        'aria-expanded': toString(visible)
      },
      props: _objectSpread(_objectSpread({}, commonProps), {}, {
        tag: this.toggleTag,
        block: block && !split
      }),
      domProps: buttonContentDomProps,
      on: {
        mousedown: this.onMousedown,
        click: toggle,
        keydown: toggle // Handle ENTER, SPACE and DOWN

      },
      ref: 'toggle'
    }, $buttonChildren);
    var $menu = h('ul', {
      staticClass: 'dropdown-menu',
      class: this.menuClasses,
      attrs: {
        role: role,
        tabindex: '-1',
        'aria-labelledby': this.safeId(split ? '_BV_button_' : '_BV_toggle_')
      },
      on: {
        keydown: this.onKeydown // Handle UP, DOWN and ESC

      },
      ref: 'menu'
    }, [!this.lazy || visible ? this.normalizeSlot(SLOT_NAME_DEFAULT, {
      hide: hide
    }) : h()]);
    return h('div', {
      staticClass: 'dropdown b-dropdown',
      class: this.dropdownClasses,
      attrs: {
        id: this.safeId()
      }
    }, [$split, $toggle, $menu]);
  }
});