function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_FORM_TEXTAREA } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { getCS, getStyle, isVisible, requestAF, setStyle } from '../../utils/dom';
import { isNull } from '../../utils/inspect';
import { mathCeil, mathMax, mathMin } from '../../utils/math';
import { toInteger, toFloat } from '../../utils/number';
import { sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { formControlMixin, props as formControlProps } from '../../mixins/form-control';
import { formSelectionMixin } from '../../mixins/form-selection';
import { formSizeMixin, props as formSizeProps } from '../../mixins/form-size';
import { formStateMixin, props as formStateProps } from '../../mixins/form-state';
import { formTextMixin, props as formTextProps } from '../../mixins/form-text';
import { formValidityMixin } from '../../mixins/form-validity';
import { idMixin, props as idProps } from '../../mixins/id';
import { listenOnRootMixin } from '../../mixins/listen-on-root';
import { listenersMixin } from '../../mixins/listeners';
import { VBVisible } from '../../directives/visible/visible'; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, idProps), formControlProps), formSizeProps), formStateProps), formTextProps), {}, {
  maxRows: makeProp(PROP_TYPE_NUMBER_STRING),
  // When in auto resize mode, disable shrinking to content height
  noAutoShrink: makeProp(PROP_TYPE_BOOLEAN, false),
  // Disable the resize handle of textarea
  noResize: makeProp(PROP_TYPE_BOOLEAN, false),
  rows: makeProp(PROP_TYPE_NUMBER_STRING, 2),
  // 'soft', 'hard' or 'off'
  // Browser default is 'soft'
  wrap: makeProp(PROP_TYPE_STRING, 'soft')
})), NAME_FORM_TEXTAREA); // --- Main component ---
// @vue/component

export var BFormTextarea = /*#__PURE__*/Vue.extend({
  name: NAME_FORM_TEXTAREA,
  directives: {
    'b-visible': VBVisible
  },
  // Mixin order is important!
  mixins: [listenersMixin, idMixin, listenOnRootMixin, formControlMixin, formSizeMixin, formStateMixin, formTextMixin, formSelectionMixin, formValidityMixin],
  props: props,
  data: function data() {
    return {
      heightInPx: null
    };
  },
  computed: {
    computedStyle: function computedStyle() {
      var styles = {
        // Setting `noResize` to true will disable the ability for the user to
        // manually resize the textarea. We also disable when in auto height mode
        resize: !this.computedRows || this.noResize ? 'none' : null
      };

      if (!this.computedRows) {
        // Conditionally set the computed CSS height when auto rows/height is enabled
        // We avoid setting the style to `null`, which can override user manual resize handle
        styles.height = this.heightInPx; // We always add a vertical scrollbar to the textarea when auto-height is
        // enabled so that the computed height calculation returns a stable value

        styles.overflowY = 'scroll';
      }

      return styles;
    },
    computedMinRows: function computedMinRows() {
      // Ensure rows is at least 2 and positive (2 is the native textarea value)
      // A value of 1 can cause issues in some browsers, and most browsers
      // only support 2 as the smallest value
      return mathMax(toInteger(this.rows, 2), 2);
    },
    computedMaxRows: function computedMaxRows() {
      return mathMax(this.computedMinRows, toInteger(this.maxRows, 0));
    },
    computedRows: function computedRows() {
      // This is used to set the attribute 'rows' on the textarea
      // If auto-height is enabled, then we return `null` as we use CSS to control height
      return this.computedMinRows === this.computedMaxRows ? this.computedMinRows : null;
    },
    computedAttrs: function computedAttrs() {
      var disabled = this.disabled,
          required = this.required;
      return {
        id: this.safeId(),
        name: this.name || null,
        form: this.form || null,
        disabled: disabled,
        placeholder: this.placeholder || null,
        required: required,
        autocomplete: this.autocomplete || null,
        readonly: this.readonly || this.plaintext,
        rows: this.computedRows,
        wrap: this.wrap || null,
        'aria-required': this.required ? 'true' : null,
        'aria-invalid': this.computedAriaInvalid
      };
    },
    computedListeners: function computedListeners() {
      return _objectSpread(_objectSpread({}, this.bvListeners), {}, {
        input: this.onInput,
        change: this.onChange,
        blur: this.onBlur
      });
    }
  },
  watch: {
    localValue: function localValue() {
      this.setHeight();
    }
  },
  mounted: function mounted() {
    this.setHeight();
  },
  methods: {
    // Called by intersection observer directive

    /* istanbul ignore next */
    visibleCallback: function visibleCallback(visible) {
      if (visible) {
        // We use a `$nextTick()` here just to make sure any
        // transitions or portalling have completed
        this.$nextTick(this.setHeight);
      }
    },
    setHeight: function setHeight() {
      var _this = this;

      this.$nextTick(function () {
        requestAF(function () {
          _this.heightInPx = _this.computeHeight();
        });
      });
    },

    /* istanbul ignore next: can't test getComputedStyle in JSDOM */
    computeHeight: function computeHeight() {
      if (this.$isServer || !isNull(this.computedRows)) {
        return null;
      }

      var el = this.$el; // Element must be visible (not hidden) and in document
      // Must be checked after above checks

      if (!isVisible(el)) {
        return null;
      } // Get current computed styles


      var computedStyle = getCS(el); // Height of one line of text in px

      var lineHeight = toFloat(computedStyle.lineHeight, 1); // Calculate height of border and padding

      var border = toFloat(computedStyle.borderTopWidth, 0) + toFloat(computedStyle.borderBottomWidth, 0);
      var padding = toFloat(computedStyle.paddingTop, 0) + toFloat(computedStyle.paddingBottom, 0); // Calculate offset

      var offset = border + padding; // Minimum height for min rows (which must be 2 rows or greater for cross-browser support)

      var minHeight = lineHeight * this.computedMinRows + offset; // Get the current style height (with `px` units)

      var oldHeight = getStyle(el, 'height') || computedStyle.height; // Probe scrollHeight by temporarily changing the height to `auto`

      setStyle(el, 'height', 'auto');
      var scrollHeight = el.scrollHeight; // Place the original old height back on the element, just in case `computedProp`
      // returns the same value as before

      setStyle(el, 'height', oldHeight); // Calculate content height in 'rows' (scrollHeight includes padding but not border)

      var contentRows = mathMax((scrollHeight - padding) / lineHeight, 2); // Calculate number of rows to display (limited within min/max rows)

      var rows = mathMin(mathMax(contentRows, this.computedMinRows), this.computedMaxRows); // Calculate the required height of the textarea including border and padding (in pixels)

      var height = mathMax(mathCeil(rows * lineHeight + offset), minHeight); // Computed height remains the larger of `oldHeight` and new `height`,
      // when height is in `sticky` mode (prop `no-auto-shrink` is true)

      if (this.noAutoShrink && toFloat(oldHeight, 0) > height) {
        return oldHeight;
      } // Return the new computed CSS height in px units


      return "".concat(height, "px");
    }
  },
  render: function render(h) {
    return h('textarea', {
      class: this.computedClass,
      style: this.computedStyle,
      directives: [{
        name: 'b-visible',
        value: this.visibleCallback,
        // If textarea is within 640px of viewport, consider it visible
        modifiers: {
          '640': true
        }
      }],
      attrs: this.computedAttrs,
      domProps: {
        value: this.localValue
      },
      on: this.computedListeners,
      ref: 'input'
    });
  }
});