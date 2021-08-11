import { Vue } from '../../../vue';
import { SLOT_NAME_TABLE_COLGROUP } from '../../../constants/slots'; // --- Props ---

export var props = {}; // --- Mixin ---
// @vue/component

export var colgroupMixin = Vue.extend({
  methods: {
    renderColgroup: function renderColgroup() {
      var fields = this.computedFields;
      var h = this.$createElement;
      var $colgroup = h();

      if (this.hasNormalizedSlot(SLOT_NAME_TABLE_COLGROUP)) {
        $colgroup = h('colgroup', {
          key: 'colgroup'
        }, [this.normalizeSlot(SLOT_NAME_TABLE_COLGROUP, {
          columns: fields.length,
          fields: fields
        })]);
      }

      return $colgroup;
    }
  }
});