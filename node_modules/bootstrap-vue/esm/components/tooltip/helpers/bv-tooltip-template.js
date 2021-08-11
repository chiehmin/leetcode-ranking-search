function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../../vue';
import { NAME_TOOLTIP_TEMPLATE } from '../../../constants/components';
import { EVENT_NAME_FOCUSIN, EVENT_NAME_FOCUSOUT, EVENT_NAME_MOUSEENTER, EVENT_NAME_MOUSELEAVE } from '../../../constants/events';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../../constants/props';
import { isFunction } from '../../../utils/inspect';
import { makeProp } from '../../../utils/props';
import { scopedStyleMixin } from '../../../mixins/scoped-style';
import { BVPopper } from './bv-popper'; // --- Props ---

export var props = {
  // Used only by the directive versions
  html: makeProp(PROP_TYPE_BOOLEAN, false),
  // Other non-reactive (while open) props are pulled in from BVPopper
  id: makeProp(PROP_TYPE_STRING)
}; // --- Main component ---
// @vue/component

export var BVTooltipTemplate = /*#__PURE__*/Vue.extend({
  name: NAME_TOOLTIP_TEMPLATE,
  extends: BVPopper,
  mixins: [scopedStyleMixin],
  props: props,
  data: function data() {
    // We use data, rather than props to ensure reactivity
    // Parent component will directly set this data
    return {
      title: '',
      content: '',
      variant: null,
      customClass: null,
      interactive: true
    };
  },
  computed: {
    templateType: function templateType() {
      return 'tooltip';
    },
    templateClasses: function templateClasses() {
      var _ref;

      var variant = this.variant,
          attachment = this.attachment,
          templateType = this.templateType;
      return [(_ref = {
        // Disables pointer events to hide the tooltip when the user
        // hovers over its content
        noninteractive: !this.interactive
      }, _defineProperty(_ref, "b-".concat(templateType, "-").concat(variant), variant), _defineProperty(_ref, "bs-".concat(templateType, "-").concat(attachment), attachment), _ref), this.customClass];
    },
    templateAttributes: function templateAttributes() {
      var id = this.id;
      return _objectSpread(_objectSpread({}, this.$parent.$parent.$attrs), {}, {
        id: id,
        role: 'tooltip',
        tabindex: '-1'
      }, this.scopedStyleAttrs);
    },
    templateListeners: function templateListeners() {
      var _this = this;

      // Used for hover/focus trigger listeners
      return {
        mouseenter:
        /* istanbul ignore next */
        function mouseenter(event) {
          _this.$emit(EVENT_NAME_MOUSEENTER, event);
        },
        mouseleave:
        /* istanbul ignore next */
        function mouseleave(event) {
          _this.$emit(EVENT_NAME_MOUSELEAVE, event);
        },
        focusin:
        /* istanbul ignore next */
        function focusin(event) {
          _this.$emit(EVENT_NAME_FOCUSIN, event);
        },
        focusout:
        /* istanbul ignore next */
        function focusout(event) {
          _this.$emit(EVENT_NAME_FOCUSOUT, event);
        }
      };
    }
  },
  methods: {
    renderTemplate: function renderTemplate(h) {
      var title = this.title; // Title can be a scoped slot function

      var $title = isFunction(title) ? title({}) : title; // Directive versions only

      var domProps = this.html && !isFunction(title) ? {
        innerHTML: title
      } : {};
      return h('div', {
        staticClass: 'tooltip b-tooltip',
        class: this.templateClasses,
        attrs: this.templateAttributes,
        on: this.templateListeners
      }, [h('div', {
        staticClass: 'arrow',
        ref: 'arrow'
      }), h('div', {
        staticClass: 'tooltip-inner',
        domProps: domProps
      }, [$title])]);
    }
  }
});