import { Vue } from '../../../vue';
import { SLOT_NAME_TOP_ROW } from '../../../constants/slots';
import { isFunction } from '../../../utils/inspect';
import { BTr } from '../tr'; // --- Props ---

export var props = {}; // --- Mixin ---
// @vue/component

export var topRowMixin = Vue.extend({
  methods: {
    renderTopRow: function renderTopRow() {
      var fields = this.computedFields,
          stacked = this.stacked,
          tbodyTrClass = this.tbodyTrClass,
          tbodyTrAttr = this.tbodyTrAttr;
      var h = this.$createElement; // Add static Top Row slot (hidden in visibly stacked mode as we can't control the data-label)
      // If in *always* stacked mode, we don't bother rendering the row

      if (!this.hasNormalizedSlot(SLOT_NAME_TOP_ROW) || stacked === true || stacked === '') {
        return h();
      }

      return h(BTr, {
        staticClass: 'b-table-top-row',
        class: [isFunction(tbodyTrClass) ? tbodyTrClass(null, 'row-top') : tbodyTrClass],
        attrs: isFunction(tbodyTrAttr) ? tbodyTrAttr(null, 'row-top') : tbodyTrAttr,
        key: 'b-top-row'
      }, [this.normalizeSlot(SLOT_NAME_TOP_ROW, {
        columns: fields.length,
        fields: fields
      })]);
    }
  }
});