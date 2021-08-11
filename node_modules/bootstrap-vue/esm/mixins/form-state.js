/* Form control contextual state class computation
 *
 * Returned class is either 'is-valid' or 'is-invalid' based on the 'state' prop
 * state can be one of five values:
 *  - true for is-valid
 *  - false for is-invalid
 *  - null for no contextual state
 */
import { Vue } from '../vue';
import { PROP_TYPE_BOOLEAN } from '../constants/props';
import { isBoolean } from '../utils/inspect';
import { makeProp, makePropsConfigurable } from '../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  // Tri-state prop: true, false, null (or undefined)
  state: makeProp(PROP_TYPE_BOOLEAN, null)
}, 'formState'); // --- Mixin ---
// @vue/component

export var formStateMixin = Vue.extend({
  props: props,
  computed: {
    computedState: function computedState() {
      // If not a boolean, ensure that value is null
      return isBoolean(this.state) ? this.state : null;
    },
    stateClass: function stateClass() {
      var state = this.computedState;
      return state === true ? 'is-valid' : state === false ? 'is-invalid' : null;
    },
    computedAriaInvalid: function computedAriaInvalid() {
      var ariaInvalid = this.ariaInvalid;

      if (ariaInvalid === true || ariaInvalid === 'true' || ariaInvalid === '') {
        return 'true';
      }

      return this.computedState === false ? 'true' : ariaInvalid;
    }
  }
});