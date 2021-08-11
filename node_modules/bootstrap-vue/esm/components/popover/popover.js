function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_POPOVER } from '../../constants/components';
import { EVENT_NAME_CLICK } from '../../constants/events';
import { PROP_TYPE_ARRAY_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_TITLE } from '../../constants/slots';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { BTooltip, props as BTooltipProps } from '../tooltip/tooltip';
import { BVPopover } from './helpers/bv-popover';
import { sortKeys } from '../../utils/object'; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, BTooltipProps), {}, {
  content: makeProp(PROP_TYPE_STRING),
  placement: makeProp(PROP_TYPE_STRING, 'right'),
  triggers: makeProp(PROP_TYPE_ARRAY_STRING, EVENT_NAME_CLICK)
})), NAME_POPOVER); // --- Main component ---
// @vue/component

export var BPopover = /*#__PURE__*/Vue.extend({
  name: NAME_POPOVER,
  extends: BTooltip,
  inheritAttrs: false,
  props: props,
  methods: {
    getComponent: function getComponent() {
      // Overridden by BPopover
      return BVPopover;
    },
    updateContent: function updateContent() {
      // Tooltip: Default slot is `title`
      // Popover: Default slot is `content`, `title` slot is title
      // We pass a scoped slot function references by default (Vue v2.6x)
      // And pass the title prop as a fallback
      this.setContent(this.normalizeSlot() || this.content);
      this.setTitle(this.normalizeSlot(SLOT_NAME_TITLE) || this.title);
    }
  } // Render function provided by BTooltip

});