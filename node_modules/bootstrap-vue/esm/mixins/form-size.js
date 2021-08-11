import { Vue } from '../vue';
import { PROP_TYPE_STRING } from '../constants/props';
import { makeProp, makePropsConfigurable } from '../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  size: makeProp(PROP_TYPE_STRING)
}, 'formControls'); // --- Mixin ---
// @vue/component

export var formSizeMixin = Vue.extend({
  props: props,
  computed: {
    sizeFormClass: function sizeFormClass() {
      return [this.size ? "form-control-".concat(this.size) : null];
    }
  }
});