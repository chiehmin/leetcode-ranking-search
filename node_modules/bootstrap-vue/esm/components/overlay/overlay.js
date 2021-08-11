function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_OVERLAY } from '../../constants/components';
import { EVENT_NAME_CLICK, EVENT_NAME_HIDDEN, EVENT_NAME_SHOWN } from '../../constants/events';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_BOOLEAN_STRING, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_OVERLAY } from '../../constants/slots';
import { toFloat } from '../../utils/number';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { BSpinner } from '../spinner/spinner';
import { BVTransition } from '../transition/bv-transition'; // --- Constants ---

var POSITION_COVER = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
}; // --- Props ---

export var props = makePropsConfigurable({
  // Alternative to variant, allowing a specific
  // CSS color to be applied to the overlay
  bgColor: makeProp(PROP_TYPE_STRING),
  blur: makeProp(PROP_TYPE_STRING, '2px'),
  fixed: makeProp(PROP_TYPE_BOOLEAN, false),
  noCenter: makeProp(PROP_TYPE_BOOLEAN, false),
  noFade: makeProp(PROP_TYPE_BOOLEAN, false),
  // If `true, does not render the default slot
  // and switches to absolute positioning
  noWrap: makeProp(PROP_TYPE_BOOLEAN, false),
  opacity: makeProp(PROP_TYPE_NUMBER_STRING, 0.85, function (value) {
    var number = toFloat(value, 0);
    return number >= 0 && number <= 1;
  }),
  overlayTag: makeProp(PROP_TYPE_STRING, 'div'),
  rounded: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
  show: makeProp(PROP_TYPE_BOOLEAN, false),
  spinnerSmall: makeProp(PROP_TYPE_BOOLEAN, false),
  spinnerType: makeProp(PROP_TYPE_STRING, 'border'),
  spinnerVariant: makeProp(PROP_TYPE_STRING),
  variant: makeProp(PROP_TYPE_STRING, 'light'),
  wrapTag: makeProp(PROP_TYPE_STRING, 'div'),
  zIndex: makeProp(PROP_TYPE_NUMBER_STRING, 10)
}, NAME_OVERLAY); // --- Main component ---
// @vue/component

export var BOverlay = /*#__PURE__*/Vue.extend({
  name: NAME_OVERLAY,
  mixins: [normalizeSlotMixin],
  props: props,
  computed: {
    computedRounded: function computedRounded() {
      var rounded = this.rounded;
      return rounded === true || rounded === '' ? 'rounded' : !rounded ? '' : "rounded-".concat(rounded);
    },
    computedVariant: function computedVariant() {
      var variant = this.variant;
      return variant && !this.bgColor ? "bg-".concat(variant) : '';
    },
    slotScope: function slotScope() {
      return {
        spinnerType: this.spinnerType || null,
        spinnerVariant: this.spinnerVariant || null,
        spinnerSmall: this.spinnerSmall
      };
    }
  },
  methods: {
    defaultOverlayFn: function defaultOverlayFn(_ref) {
      var spinnerType = _ref.spinnerType,
          spinnerVariant = _ref.spinnerVariant,
          spinnerSmall = _ref.spinnerSmall;
      return this.$createElement(BSpinner, {
        props: {
          type: spinnerType,
          variant: spinnerVariant,
          small: spinnerSmall
        }
      });
    }
  },
  render: function render(h) {
    var _this = this;

    var show = this.show,
        fixed = this.fixed,
        noFade = this.noFade,
        noWrap = this.noWrap,
        slotScope = this.slotScope;
    var $overlay = h();

    if (show) {
      var $background = h('div', {
        staticClass: 'position-absolute',
        class: [this.computedVariant, this.computedRounded],
        style: _objectSpread(_objectSpread({}, POSITION_COVER), {}, {
          opacity: this.opacity,
          backgroundColor: this.bgColor || null,
          backdropFilter: this.blur ? "blur(".concat(this.blur, ")") : null
        })
      });
      var $content = h('div', {
        staticClass: 'position-absolute',
        style: this.noCenter ?
        /* istanbul ignore next */
        _objectSpread({}, POSITION_COVER) : {
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)'
        }
      }, [this.normalizeSlot(SLOT_NAME_OVERLAY, slotScope) || this.defaultOverlayFn(slotScope)]);
      $overlay = h(this.overlayTag, {
        staticClass: 'b-overlay',
        class: {
          'position-absolute': !noWrap || noWrap && !fixed,
          'position-fixed': noWrap && fixed
        },
        style: _objectSpread(_objectSpread({}, POSITION_COVER), {}, {
          zIndex: this.zIndex || 10
        }),
        on: {
          click: function click(event) {
            return _this.$emit(EVENT_NAME_CLICK, event);
          }
        },
        key: 'overlay'
      }, [$background, $content]);
    } // Wrap in a fade transition


    $overlay = h(BVTransition, {
      props: {
        noFade: noFade,
        appear: true
      },
      on: {
        'after-enter': function afterEnter() {
          return _this.$emit(EVENT_NAME_SHOWN);
        },
        'after-leave': function afterLeave() {
          return _this.$emit(EVENT_NAME_HIDDEN);
        }
      }
    }, [$overlay]);

    if (noWrap) {
      return $overlay;
    }

    return h(this.wrapTag, {
      staticClass: 'b-overlay-wrap position-relative',
      attrs: {
        'aria-busy': show ? 'true' : null
      }
    }, noWrap ? [$overlay] : [this.normalizeSlot(), $overlay]);
  }
});