import { Vue } from '../../vue';
import { NAME_FORM_RADIO_GROUP } from '../../constants/components';
import { makePropsConfigurable } from '../../utils/props';
import { formRadioCheckGroupMixin, props as formRadioCheckGroupProps } from '../../mixins/form-radio-check-group'; // --- Props ---

export var props = makePropsConfigurable(formRadioCheckGroupProps, NAME_FORM_RADIO_GROUP); // --- Main component ---
// @vue/component

export var BFormRadioGroup = /*#__PURE__*/Vue.extend({
  name: NAME_FORM_RADIO_GROUP,
  mixins: [formRadioCheckGroupMixin],
  provide: function provide() {
    return {
      bvRadioGroup: this
    };
  },
  props: props,
  computed: {
    isRadioGroup: function isRadioGroup() {
      return true;
    }
  }
});