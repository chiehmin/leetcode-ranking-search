import { Vue } from '../../vue';
import { NAME_AVATAR_GROUP } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_BOOLEAN_STRING, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { mathMax, mathMin } from '../../utils/math';
import { toFloat } from '../../utils/number';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { computeSize } from './avatar'; // --- Props ---

export var props = makePropsConfigurable({
  overlap: makeProp(PROP_TYPE_NUMBER_STRING, 0.3),
  // Child avatars will prefer this prop (if set) over their own
  rounded: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
  // Child avatars will always use this over their own size
  size: makeProp(PROP_TYPE_STRING),
  // Child avatars will prefer this prop (if set) over their own
  square: makeProp(PROP_TYPE_BOOLEAN, false),
  tag: makeProp(PROP_TYPE_STRING, 'div'),
  // Child avatars will prefer this variant over their own
  variant: makeProp(PROP_TYPE_STRING)
}, NAME_AVATAR_GROUP); // --- Main component ---
// @vue/component

export var BAvatarGroup = /*#__PURE__*/Vue.extend({
  name: NAME_AVATAR_GROUP,
  mixins: [normalizeSlotMixin],
  provide: function provide() {
    return {
      bvAvatarGroup: this
    };
  },
  props: props,
  computed: {
    computedSize: function computedSize() {
      return computeSize(this.size);
    },
    overlapScale: function overlapScale() {
      return mathMin(mathMax(toFloat(this.overlap, 0), 0), 1) / 2;
    },
    paddingStyle: function paddingStyle() {
      var value = this.computedSize;
      value = value ? "calc(".concat(value, " * ").concat(this.overlapScale, ")") : null;
      return value ? {
        paddingLeft: value,
        paddingRight: value
      } : {};
    }
  },
  render: function render(h) {
    var $inner = h('div', {
      staticClass: 'b-avatar-group-inner',
      style: this.paddingStyle
    }, this.normalizeSlot());
    return h(this.tag, {
      staticClass: 'b-avatar-group',
      attrs: {
        role: 'group'
      }
    }, [$inner]);
  }
});