var _objectSpread2;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_FORM_CHECKBOX } from '../../constants/components';
import { EVENT_NAME_CHANGE, MODEL_EVENT_NAME_PREFIX } from '../../constants/events';
import { PROP_TYPE_ANY, PROP_TYPE_BOOLEAN } from '../../constants/props';
import { isArray } from '../../utils/inspect';
import { looseEqual } from '../../utils/loose-equal';
import { looseIndexOf } from '../../utils/loose-index-of';
import { sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { MODEL_EVENT_NAME, formRadioCheckMixin, props as formRadioCheckProps } from '../../mixins/form-radio-check'; // --- Constants ---

var MODEL_PROP_NAME_INDETERMINATE = 'indeterminate';
var MODEL_EVENT_NAME_INDETERMINATE = MODEL_EVENT_NAME_PREFIX + MODEL_PROP_NAME_INDETERMINATE; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, formRadioCheckProps), {}, (_objectSpread2 = {}, _defineProperty(_objectSpread2, MODEL_PROP_NAME_INDETERMINATE, makeProp(PROP_TYPE_BOOLEAN, false)), _defineProperty(_objectSpread2, "switch", makeProp(PROP_TYPE_BOOLEAN, false)), _defineProperty(_objectSpread2, "uncheckedValue", makeProp(PROP_TYPE_ANY, false)), _defineProperty(_objectSpread2, "value", makeProp(PROP_TYPE_ANY, true)), _objectSpread2))), NAME_FORM_CHECKBOX); // --- Main component ---
// @vue/component

export var BFormCheckbox = /*#__PURE__*/Vue.extend({
  name: NAME_FORM_CHECKBOX,
  mixins: [formRadioCheckMixin],
  inject: {
    bvGroup: {
      from: 'bvCheckGroup',
      default: null
    }
  },
  props: props,
  computed: {
    isChecked: function isChecked() {
      var value = this.value,
          checked = this.computedLocalChecked;
      return isArray(checked) ? looseIndexOf(checked, value) > -1 : looseEqual(checked, value);
    },
    isRadio: function isRadio() {
      return false;
    }
  },
  watch: _defineProperty({}, MODEL_PROP_NAME_INDETERMINATE, function (newValue, oldValue) {
    if (!looseEqual(newValue, oldValue)) {
      this.setIndeterminate(newValue);
    }
  }),
  mounted: function mounted() {
    // Set initial indeterminate state
    this.setIndeterminate(this[MODEL_PROP_NAME_INDETERMINATE]);
  },
  methods: {
    computedLocalCheckedWatcher: function computedLocalCheckedWatcher(newValue, oldValue) {
      if (!looseEqual(newValue, oldValue)) {
        this.$emit(MODEL_EVENT_NAME, newValue);
        var $input = this.$refs.input;

        if ($input) {
          this.$emit(MODEL_EVENT_NAME_INDETERMINATE, $input.indeterminate);
        }
      }
    },
    handleChange: function handleChange(_ref) {
      var _this = this;

      var _ref$target = _ref.target,
          checked = _ref$target.checked,
          indeterminate = _ref$target.indeterminate;
      var value = this.value,
          uncheckedValue = this.uncheckedValue; // Update `computedLocalChecked`

      var localChecked = this.computedLocalChecked;

      if (isArray(localChecked)) {
        var index = looseIndexOf(localChecked, value);

        if (checked && index < 0) {
          // Add value to array
          localChecked = localChecked.concat(value);
        } else if (!checked && index > -1) {
          // Remove value from array
          localChecked = localChecked.slice(0, index).concat(localChecked.slice(index + 1));
        }
      } else {
        localChecked = checked ? value : uncheckedValue;
      }

      this.computedLocalChecked = localChecked; // Fire events in a `$nextTick()` to ensure the `v-model` is updated

      this.$nextTick(function () {
        // Change is only emitted on user interaction
        _this.$emit(EVENT_NAME_CHANGE, localChecked); // If this is a child of a group, we emit a change event on it as well


        if (_this.isGroup) {
          _this.bvGroup.$emit(EVENT_NAME_CHANGE, localChecked);
        }

        _this.$emit(MODEL_EVENT_NAME_INDETERMINATE, indeterminate);
      });
    },
    setIndeterminate: function setIndeterminate(state) {
      // Indeterminate only supported in single checkbox mode
      if (isArray(this.computedLocalChecked)) {
        state = false;
      }

      var $input = this.$refs.input;

      if ($input) {
        $input.indeterminate = state; // Emit update event to prop

        this.$emit(MODEL_EVENT_NAME_INDETERMINATE, state);
      }
    }
  }
});