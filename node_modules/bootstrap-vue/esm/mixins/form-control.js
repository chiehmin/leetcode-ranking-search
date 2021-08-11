import { Vue } from '../vue';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../constants/props';
import { attemptFocus, isVisible, matches, requestAF, select } from '../utils/dom';
import { makeProp, makePropsConfigurable } from '../utils/props'; // --- Constants ---

var SELECTOR = 'input, textarea, select'; // --- Props ---

export var props = makePropsConfigurable({
  autofocus: makeProp(PROP_TYPE_BOOLEAN, false),
  disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  form: makeProp(PROP_TYPE_STRING),
  id: makeProp(PROP_TYPE_STRING),
  name: makeProp(PROP_TYPE_STRING),
  required: makeProp(PROP_TYPE_BOOLEAN, false)
}, 'formControls'); // --- Mixin ---
// @vue/component

export var formControlMixin = Vue.extend({
  props: props,
  mounted: function mounted() {
    this.handleAutofocus();
  },

  /* istanbul ignore next */
  activated: function activated() {
    this.handleAutofocus();
  },
  methods: {
    handleAutofocus: function handleAutofocus() {
      var _this = this;

      this.$nextTick(function () {
        requestAF(function () {
          var el = _this.$el;

          if (_this.autofocus && isVisible(el)) {
            if (!matches(el, SELECTOR)) {
              el = select(SELECTOR, el);
            }

            attemptFocus(el);
          }
        });
      });
    }
  }
});