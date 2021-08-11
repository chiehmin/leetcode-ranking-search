import { Vue, mergeData } from '../../vue';
import { NAME_FORM_SELECT_OPTION } from '../../constants/components';
import { PROP_TYPE_ANY, PROP_TYPE_BOOLEAN } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  value: makeProp(PROP_TYPE_ANY, undefined, true) // Required

}, NAME_FORM_SELECT_OPTION); // --- Main component ---
// @vue/component

export var BFormSelectOption = /*#__PURE__*/Vue.extend({
  name: NAME_FORM_SELECT_OPTION,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var value = props.value,
        disabled = props.disabled;
    return h('option', mergeData(data, {
      attrs: {
        disabled: disabled
      },
      domProps: {
        value: value
      }
    }), children);
  }
});