import { Vue } from '../vue';
import { PROP_TYPE_ARRAY_OBJECT, PROP_TYPE_STRING } from '../constants/props';
import { get } from '../utils/get';
import { stripTags } from '../utils/html';
import { isArray, isPlainObject, isUndefined } from '../utils/inspect';
import { keys } from '../utils/object';
import { makeProp, makePropsConfigurable } from '../utils/props';
import { warn } from '../utils/warn'; // --- Constants ---

var OPTIONS_OBJECT_DEPRECATED_MSG = 'Setting prop "options" to an object is deprecated. Use the array format instead.'; // --- Props ---

export var props = makePropsConfigurable({
  disabledField: makeProp(PROP_TYPE_STRING, 'disabled'),
  htmlField: makeProp(PROP_TYPE_STRING, 'html'),
  options: makeProp(PROP_TYPE_ARRAY_OBJECT, []),
  textField: makeProp(PROP_TYPE_STRING, 'text'),
  valueField: makeProp(PROP_TYPE_STRING, 'value')
}, 'formOptionControls'); // --- Mixin ---
// @vue/component

export var formOptionsMixin = Vue.extend({
  props: props,
  computed: {
    formOptions: function formOptions() {
      return this.normalizeOptions(this.options);
    }
  },
  methods: {
    normalizeOption: function normalizeOption(option) {
      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      // When the option is an object, normalize it
      if (isPlainObject(option)) {
        var value = get(option, this.valueField);
        var text = get(option, this.textField);
        return {
          value: isUndefined(value) ? key || text : value,
          text: stripTags(String(isUndefined(text) ? key : text)),
          html: get(option, this.htmlField),
          disabled: Boolean(get(option, this.disabledField))
        };
      } // Otherwise create an `<option>` object from the given value


      return {
        value: key || option,
        text: stripTags(String(option)),
        disabled: false
      };
    },
    normalizeOptions: function normalizeOptions(options) {
      var _this = this;

      // Normalize the given options array
      if (isArray(options)) {
        return options.map(function (option) {
          return _this.normalizeOption(option);
        });
      } else if (isPlainObject(options)) {
        // Deprecate the object options format
        warn(OPTIONS_OBJECT_DEPRECATED_MSG, this.$options.name); // Normalize a `options` object to an array of options

        return keys(options).map(function (key) {
          return _this.normalizeOption(options[key] || {}, key);
        });
      } // If not an array or object, return an empty array

      /* istanbul ignore next */


      return [];
    }
  }
});