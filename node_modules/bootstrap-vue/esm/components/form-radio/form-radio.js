function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_FORM_RADIO } from '../../constants/components';
import { looseEqual } from '../../utils/loose-equal';
import { sortKeys } from '../../utils/object';
import { makePropsConfigurable } from '../../utils/props';
import { formControlMixin, props as formControlProps } from '../../mixins/form-control';
import { MODEL_EVENT_NAME, formRadioCheckMixin, props as formRadioCheckProps } from '../../mixins/form-radio-check';
import { formSizeMixin, props as formSizeProps } from '../../mixins/form-size';
import { formStateMixin, props as formStateProps } from '../../mixins/form-state';
import { idMixin, props as idProps } from '../../mixins/id'; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, idProps), formControlProps), formRadioCheckProps), formSizeProps), formStateProps)), NAME_FORM_RADIO); // --- Main component ---
// @vue/component

export var BFormRadio = /*#__PURE__*/Vue.extend({
  name: NAME_FORM_RADIO,
  mixins: [idMixin, formRadioCheckMixin, // Includes shared render function
  formControlMixin, formSizeMixin, formStateMixin],
  inject: {
    bvGroup: {
      from: 'bvRadioGroup',
      default: false
    }
  },
  props: props,
  watch: {
    computedLocalChecked: function computedLocalChecked(newValue, oldValue) {
      if (!looseEqual(newValue, oldValue)) {
        this.$emit(MODEL_EVENT_NAME, newValue);
      }
    }
  }
});