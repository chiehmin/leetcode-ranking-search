function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_BUTTON_CLOSE } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_DEFAULT } from '../../constants/slots';
import { stopEvent } from '../../utils/events';
import { isEvent } from '../../utils/inspect';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { hasNormalizedSlot, normalizeSlot } from '../../utils/normalize-slot'; // --- Props ---

export var props = makePropsConfigurable({
  ariaLabel: makeProp(PROP_TYPE_STRING, 'Close'),
  content: makeProp(PROP_TYPE_STRING, '&times;'),
  disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  textVariant: makeProp(PROP_TYPE_STRING)
}, NAME_BUTTON_CLOSE); // --- Main component ---
// @vue/component

export var BButtonClose = /*#__PURE__*/Vue.extend({
  name: NAME_BUTTON_CLOSE,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        slots = _ref.slots,
        scopedSlots = _ref.scopedSlots;
    var $slots = slots();
    var $scopedSlots = scopedSlots || {};
    var componentData = {
      staticClass: 'close',
      class: _defineProperty({}, "text-".concat(props.textVariant), props.textVariant),
      attrs: {
        type: 'button',
        disabled: props.disabled,
        'aria-label': props.ariaLabel ? String(props.ariaLabel) : null
      },
      on: {
        click: function click(event) {
          // Ensure click on button HTML content is also disabled

          /* istanbul ignore if: bug in JSDOM still emits click on inner element */
          if (props.disabled && isEvent(event)) {
            stopEvent(event);
          }
        }
      }
    }; // Careful not to override the default slot with innerHTML

    if (!hasNormalizedSlot(SLOT_NAME_DEFAULT, $scopedSlots, $slots)) {
      componentData.domProps = {
        innerHTML: props.content
      };
    }

    return h('button', mergeData(data, componentData), normalizeSlot(SLOT_NAME_DEFAULT, {}, $scopedSlots, $slots));
  }
});