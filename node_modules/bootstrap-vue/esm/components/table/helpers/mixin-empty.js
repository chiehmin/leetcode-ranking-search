import { Vue } from '../../../vue';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../../constants/props';
import { SLOT_NAME_EMPTY, SLOT_NAME_EMPTYFILTERED, SLOT_NAME_TABLE_BUSY } from '../../../constants/slots';
import { htmlOrText } from '../../../utils/html';
import { isFunction } from '../../../utils/inspect';
import { makeProp } from '../../../utils/props';
import { BTr } from '../tr';
import { BTd } from '../td'; // --- Props ---

export var props = {
  emptyFilteredHtml: makeProp(PROP_TYPE_STRING),
  emptyFilteredText: makeProp(PROP_TYPE_STRING, 'There are no records matching your request'),
  emptyHtml: makeProp(PROP_TYPE_STRING),
  emptyText: makeProp(PROP_TYPE_STRING, 'There are no records to show'),
  showEmpty: makeProp(PROP_TYPE_BOOLEAN, false)
}; // --- Mixin ---
// @vue/component

export var emptyMixin = Vue.extend({
  props: props,
  methods: {
    renderEmpty: function renderEmpty() {
      var items = this.computedItems;
      var h = this.$createElement;
      var $empty = h();

      if (this.showEmpty && (!items || items.length === 0) && !(this.computedBusy && this.hasNormalizedSlot(SLOT_NAME_TABLE_BUSY))) {
        var fields = this.computedFields,
            isFiltered = this.isFiltered,
            emptyText = this.emptyText,
            emptyHtml = this.emptyHtml,
            emptyFilteredText = this.emptyFilteredText,
            emptyFilteredHtml = this.emptyFilteredHtml,
            tbodyTrClass = this.tbodyTrClass,
            tbodyTrAttr = this.tbodyTrAttr;
        $empty = this.normalizeSlot(isFiltered ? SLOT_NAME_EMPTYFILTERED : SLOT_NAME_EMPTY, {
          emptyFilteredHtml: emptyFilteredHtml,
          emptyFilteredText: emptyFilteredText,
          emptyHtml: emptyHtml,
          emptyText: emptyText,
          fields: fields,
          // Not sure why this is included, as it will always be an empty array
          items: items
        });

        if (!$empty) {
          $empty = h('div', {
            class: ['text-center', 'my-2'],
            domProps: isFiltered ? htmlOrText(emptyFilteredHtml, emptyFilteredText) : htmlOrText(emptyHtml, emptyText)
          });
        }

        $empty = h(BTd, {
          props: {
            colspan: fields.length || null
          }
        }, [h('div', {
          attrs: {
            role: 'alert',
            'aria-live': 'polite'
          }
        }, [$empty])]);
        $empty = h(BTr, {
          staticClass: 'b-table-empty-row',
          class: [isFunction(tbodyTrClass) ?
          /* istanbul ignore next */
          tbodyTrClass(null, 'row-empty') : tbodyTrClass],
          attrs: isFunction(tbodyTrAttr) ?
          /* istanbul ignore next */
          tbodyTrAttr(null, 'row-empty') : tbodyTrAttr,
          key: isFiltered ? 'b-empty-filtered-row' : 'b-empty-row'
        }, [$empty]);
      }

      return $empty;
    }
  }
});