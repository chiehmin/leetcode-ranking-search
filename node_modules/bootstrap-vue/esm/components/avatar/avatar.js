function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_AVATAR } from '../../constants/components';
import { EVENT_NAME_CLICK, EVENT_NAME_IMG_ERROR } from '../../constants/events';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_BOOLEAN_STRING, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_BADGE } from '../../constants/slots';
import { isNumber, isNumeric, isString } from '../../utils/inspect';
import { toFloat } from '../../utils/number';
import { omit, sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable, pluckProps } from '../../utils/props';
import { isLink } from '../../utils/router';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BIcon } from '../../icons/icon';
import { BIconPersonFill } from '../../icons/icons';
import { BButton } from '../button/button';
import { BLink, props as BLinkProps } from '../link/link'; // --- Constants ---

var CLASS_NAME = 'b-avatar';
var SIZES = ['sm', null, 'lg'];
var FONT_SIZE_SCALE = 0.4;
var BADGE_FONT_SIZE_SCALE = FONT_SIZE_SCALE * 0.7; // --- Helper methods ---

export var computeSize = function computeSize(value) {
  // Parse to number when value is a float-like string
  value = isString(value) && isNumeric(value) ? toFloat(value, 0) : value; // Convert all numbers to pixel values

  return isNumber(value) ? "".concat(value, "px") : value || null;
}; // --- Props ---

var linkProps = omit(BLinkProps, ['active', 'event', 'routerTag']);
export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, linkProps), {}, {
  alt: makeProp(PROP_TYPE_STRING, 'avatar'),
  ariaLabel: makeProp(PROP_TYPE_STRING),
  badge: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
  badgeLeft: makeProp(PROP_TYPE_BOOLEAN, false),
  badgeOffset: makeProp(PROP_TYPE_STRING),
  badgeTop: makeProp(PROP_TYPE_BOOLEAN, false),
  badgeVariant: makeProp(PROP_TYPE_STRING, 'primary'),
  button: makeProp(PROP_TYPE_BOOLEAN, false),
  buttonType: makeProp(PROP_TYPE_STRING, 'button'),
  icon: makeProp(PROP_TYPE_STRING),
  rounded: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
  size: makeProp(PROP_TYPE_NUMBER_STRING),
  square: makeProp(PROP_TYPE_BOOLEAN, false),
  src: makeProp(PROP_TYPE_STRING),
  text: makeProp(PROP_TYPE_STRING),
  variant: makeProp(PROP_TYPE_STRING, 'secondary')
})), NAME_AVATAR); // --- Main component ---
// @vue/component

export var BAvatar = /*#__PURE__*/Vue.extend({
  name: NAME_AVATAR,
  mixins: [normalizeSlotMixin],
  inject: {
    bvAvatarGroup: {
      default: null
    }
  },
  props: props,
  data: function data() {
    return {
      localSrc: this.src || null
    };
  },
  computed: {
    computedSize: function computedSize() {
      // Always use the avatar group size
      var bvAvatarGroup = this.bvAvatarGroup;
      return computeSize(bvAvatarGroup ? bvAvatarGroup.size : this.size);
    },
    computedVariant: function computedVariant() {
      var bvAvatarGroup = this.bvAvatarGroup;
      return bvAvatarGroup && bvAvatarGroup.variant ? bvAvatarGroup.variant : this.variant;
    },
    computedRounded: function computedRounded() {
      var bvAvatarGroup = this.bvAvatarGroup;
      var square = bvAvatarGroup && bvAvatarGroup.square ? true : this.square;
      var rounded = bvAvatarGroup && bvAvatarGroup.rounded ? bvAvatarGroup.rounded : this.rounded;
      return square ? '0' : rounded === '' ? true : rounded || 'circle';
    },
    fontStyle: function fontStyle() {
      var size = this.computedSize;
      var fontSize = SIZES.indexOf(size) === -1 ? "calc(".concat(size, " * ").concat(FONT_SIZE_SCALE, ")") : null;
      return fontSize ? {
        fontSize: fontSize
      } : {};
    },
    marginStyle: function marginStyle() {
      var size = this.computedSize,
          bvAvatarGroup = this.bvAvatarGroup;
      var overlapScale = bvAvatarGroup ? bvAvatarGroup.overlapScale : 0;
      var value = size && overlapScale ? "calc(".concat(size, " * -").concat(overlapScale, ")") : null;
      return value ? {
        marginLeft: value,
        marginRight: value
      } : {};
    },
    badgeStyle: function badgeStyle() {
      var size = this.computedSize,
          badgeTop = this.badgeTop,
          badgeLeft = this.badgeLeft,
          badgeOffset = this.badgeOffset;
      var offset = badgeOffset || '0px';
      return {
        fontSize: SIZES.indexOf(size) === -1 ? "calc(".concat(size, " * ").concat(BADGE_FONT_SIZE_SCALE, " )") : null,
        top: badgeTop ? offset : null,
        bottom: badgeTop ? null : offset,
        left: badgeLeft ? offset : null,
        right: badgeLeft ? null : offset
      };
    }
  },
  watch: {
    src: function src(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.localSrc = newValue || null;
      }
    }
  },
  methods: {
    onImgError: function onImgError(event) {
      this.localSrc = null;
      this.$emit(EVENT_NAME_IMG_ERROR, event);
    },
    onClick: function onClick(event) {
      this.$emit(EVENT_NAME_CLICK, event);
    }
  },
  render: function render(h) {
    var _class2;

    var variant = this.computedVariant,
        disabled = this.disabled,
        rounded = this.computedRounded,
        icon = this.icon,
        src = this.localSrc,
        text = this.text,
        fontStyle = this.fontStyle,
        marginStyle = this.marginStyle,
        size = this.computedSize,
        button = this.button,
        type = this.buttonType,
        badge = this.badge,
        badgeVariant = this.badgeVariant,
        badgeStyle = this.badgeStyle;
    var link = !button && isLink(this);
    var tag = button ? BButton : link ? BLink : 'span';
    var alt = this.alt;
    var ariaLabel = this.ariaLabel || null;
    var $content = null;

    if (this.hasNormalizedSlot()) {
      // Default slot overrides props
      $content = h('span', {
        staticClass: 'b-avatar-custom'
      }, [this.normalizeSlot()]);
    } else if (src) {
      $content = h('img', {
        style: variant ? {} : {
          width: '100%',
          height: '100%'
        },
        attrs: {
          src: src,
          alt: alt
        },
        on: {
          error: this.onImgError
        }
      });
      $content = h('span', {
        staticClass: 'b-avatar-img'
      }, [$content]);
    } else if (icon) {
      $content = h(BIcon, {
        props: {
          icon: icon
        },
        attrs: {
          'aria-hidden': 'true',
          alt: alt
        }
      });
    } else if (text) {
      $content = h('span', {
        staticClass: 'b-avatar-text',
        style: fontStyle
      }, [h('span', text)]);
    } else {
      // Fallback default avatar content
      $content = h(BIconPersonFill, {
        attrs: {
          'aria-hidden': 'true',
          alt: alt
        }
      });
    }

    var $badge = h();
    var hasBadgeSlot = this.hasNormalizedSlot(SLOT_NAME_BADGE);

    if (badge || badge === '' || hasBadgeSlot) {
      var badgeText = badge === true ? '' : badge;
      $badge = h('span', {
        staticClass: 'b-avatar-badge',
        class: _defineProperty({}, "badge-".concat(badgeVariant), badgeVariant),
        style: badgeStyle
      }, [hasBadgeSlot ? this.normalizeSlot(SLOT_NAME_BADGE) : badgeText]);
    }

    var componentData = {
      staticClass: CLASS_NAME,
      class: (_class2 = {}, _defineProperty(_class2, "".concat(CLASS_NAME, "-").concat(size), size && SIZES.indexOf(size) !== -1), _defineProperty(_class2, "badge-".concat(variant), !button && variant), _defineProperty(_class2, "rounded", rounded === true), _defineProperty(_class2, "rounded-".concat(rounded), rounded && rounded !== true), _defineProperty(_class2, "disabled", disabled), _class2),
      style: _objectSpread(_objectSpread({}, marginStyle), {}, {
        width: size,
        height: size
      }),
      attrs: {
        'aria-label': ariaLabel || null
      },
      props: button ? {
        variant: variant,
        disabled: disabled,
        type: type
      } : link ? pluckProps(linkProps, this) : {},
      on: button || link ? {
        click: this.onClick
      } : {}
    };
    return h(tag, componentData, [$content, $badge]);
  }
});