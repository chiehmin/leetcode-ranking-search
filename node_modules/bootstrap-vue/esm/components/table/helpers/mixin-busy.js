function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../../vue';
import { MODEL_EVENT_NAME_PREFIX } from '../../../constants/events';
import { PROP_TYPE_BOOLEAN } from '../../../constants/props';
import { SLOT_NAME_TABLE_BUSY } from '../../../constants/slots';
import { stopEvent } from '../../../utils/events';
import { isFunction } from '../../../utils/inspect';
import { makeProp } from '../../../utils/props';
import { BTr } from '../tr';
import { BTd } from '../td'; // --- Constants ---

var MODEL_PROP_NAME_BUSY = 'busy';
var MODEL_EVENT_NAME_BUSY = MODEL_EVENT_NAME_PREFIX + MODEL_PROP_NAME_BUSY; // --- Props ---

export var props = _defineProperty({}, MODEL_PROP_NAME_BUSY, makeProp(PROP_TYPE_BOOLEAN, false)); // --- Mixin ---
// @vue/component

export var busyMixin = Vue.extend({
  props: props,
  data: function data() {
    return {
      localBusy: false
    };
  },
  computed: {
    computedBusy: function computedBusy() {
      return this[MODEL_PROP_NAME_BUSY] || this.localBusy;
    }
  },
  watch: {
    localBusy: function localBusy(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$emit(MODEL_EVENT_NAME_BUSY, newValue);
      }
    }
  },
  methods: {
    // Event handler helper
    stopIfBusy: function stopIfBusy(event) {
      // If table is busy (via provider) then don't propagate
      if (this.computedBusy) {
        stopEvent(event);
        return true;
      }

      return false;
    },
    // Render the busy indicator or return `null` if not busy
    renderBusy: function renderBusy() {
      var tbodyTrClass = this.tbodyTrClass,
          tbodyTrAttr = this.tbodyTrAttr;
      var h = this.$createElement; // Return a busy indicator row, or `null` if not busy

      if (this.computedBusy && this.hasNormalizedSlot(SLOT_NAME_TABLE_BUSY)) {
        return h(BTr, {
          staticClass: 'b-table-busy-slot',
          class: [isFunction(tbodyTrClass) ?
          /* istanbul ignore next */
          tbodyTrClass(null, SLOT_NAME_TABLE_BUSY) : tbodyTrClass],
          attrs: isFunction(tbodyTrAttr) ?
          /* istanbul ignore next */
          tbodyTrAttr(null, SLOT_NAME_TABLE_BUSY) : tbodyTrAttr,
          key: 'table-busy-slot'
        }, [h(BTd, {
          props: {
            colspan: this.computedFields.length || null
          }
        }, [this.normalizeSlot(SLOT_NAME_TABLE_BUSY)])]);
      } // We return `null` here so that we can determine if we need to
      // render the table items rows or not


      return null;
    }
  }
});