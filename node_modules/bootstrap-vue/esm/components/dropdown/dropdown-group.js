function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_DROPDOWN_GROUP } from '../../constants/components';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_DEFAULT, SLOT_NAME_HEADER } from '../../constants/slots';
import { isTag } from '../../utils/dom';
import { identity } from '../../utils/identity';
import { hasNormalizedSlot, normalizeSlot } from '../../utils/normalize-slot';
import { omit } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  ariaDescribedby: makeProp(PROP_TYPE_STRING),
  header: makeProp(PROP_TYPE_STRING),
  headerClasses: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  headerTag: makeProp(PROP_TYPE_STRING, 'header'),
  headerVariant: makeProp(PROP_TYPE_STRING),
  id: makeProp(PROP_TYPE_STRING)
}, NAME_DROPDOWN_GROUP); // --- Main component ---
// @vue/component

export var BDropdownGroup = /*#__PURE__*/Vue.extend({
  name: NAME_DROPDOWN_GROUP,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        slots = _ref.slots,
        scopedSlots = _ref.scopedSlots;
    var id = props.id,
        variant = props.variant,
        header = props.header,
        headerTag = props.headerTag;
    var $slots = slots();
    var $scopedSlots = scopedSlots || {};
    var slotScope = {};
    var headerId = id ? "_bv_".concat(id, "_group_dd_header") : null;
    var $header = h();

    if (hasNormalizedSlot(SLOT_NAME_HEADER, $scopedSlots, $slots) || header) {
      $header = h(headerTag, {
        staticClass: 'dropdown-header',
        class: [props.headerClasses, _defineProperty({}, "text-".concat(variant), variant)],
        attrs: {
          id: headerId,
          role: isTag(headerTag, 'header') ? null : 'heading'
        }
      }, normalizeSlot(SLOT_NAME_HEADER, slotScope, $scopedSlots, $slots) || header);
    }

    return h('li', mergeData(omit(data, ['attrs']), {
      attrs: {
        role: 'presentation'
      }
    }), [$header, h('ul', {
      staticClass: 'list-unstyled',
      attrs: _objectSpread(_objectSpread({}, data.attrs || {}), {}, {
        id: id,
        role: 'group',
        'aria-describedby': [headerId, props.ariaDescribedBy].filter(identity).join(' ').trim() || null
      })
    }, normalizeSlot(SLOT_NAME_DEFAULT, slotScope, $scopedSlots, $slots))]);
  }
});