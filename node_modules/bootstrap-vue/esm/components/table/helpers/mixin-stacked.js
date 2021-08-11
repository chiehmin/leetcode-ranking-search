function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../../vue';
import { PROP_TYPE_BOOLEAN_STRING } from '../../../constants/props';
import { makeProp } from '../../../utils/props'; // --- Props ---

export var props = {
  stacked: makeProp(PROP_TYPE_BOOLEAN_STRING, false)
}; // --- Mixin ---
// @vue/component

export var stackedMixin = Vue.extend({
  props: props,
  computed: {
    isStacked: function isStacked() {
      var stacked = this.stacked; // `true` when always stacked, or returns breakpoint specified

      return stacked === '' ? true : stacked;
    },
    isStackedAlways: function isStackedAlways() {
      return this.isStacked === true;
    },
    stackedTableClasses: function stackedTableClasses() {
      var isStackedAlways = this.isStackedAlways;
      return _defineProperty({
        'b-table-stacked': isStackedAlways
      }, "b-table-stacked-".concat(this.stacked), !isStackedAlways && this.isStacked);
    }
  }
});