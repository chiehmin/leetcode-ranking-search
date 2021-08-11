import { Vue } from '../vue';
import { PROP_TYPE_BOOLEAN } from '../constants/props';
import { makeProp, makePropsConfigurable } from '../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  plain: makeProp(PROP_TYPE_BOOLEAN, false)
}, 'formControls'); // --- Mixin ---
// @vue/component

export var formCustomMixin = Vue.extend({
  props: props,
  computed: {
    custom: function custom() {
      return !this.plain;
    }
  }
});