import { Vue, mergeData } from '../../vue';
import { NAME_SKELETON_WRAPPER } from '../../constants/components';
import { PROP_TYPE_BOOLEAN } from '../../constants/props';
import { SLOT_NAME_DEFAULT, SLOT_NAME_LOADING } from '../../constants/slots';
import { normalizeSlot } from '../../utils/normalize-slot';
import { makeProp, makePropsConfigurable } from '../../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  loading: makeProp(PROP_TYPE_BOOLEAN, false)
}, NAME_SKELETON_WRAPPER); // --- Main component ---
// @vue/component

export var BSkeletonWrapper = /*#__PURE__*/Vue.extend({
  name: NAME_SKELETON_WRAPPER,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var data = _ref.data,
        props = _ref.props,
        slots = _ref.slots,
        scopedSlots = _ref.scopedSlots;
    var $slots = slots();
    var $scopedSlots = scopedSlots || {};
    var slotScope = {};

    if (props.loading) {
      return h('div', mergeData(data, {
        attrs: {
          role: 'alert',
          'aria-live': 'polite',
          'aria-busy': true
        },
        staticClass: 'b-skeleton-wrapper',
        key: 'loading'
      }), normalizeSlot(SLOT_NAME_LOADING, slotScope, $scopedSlots, $slots));
    }

    return normalizeSlot(SLOT_NAME_DEFAULT, slotScope, $scopedSlots, $slots);
  }
});