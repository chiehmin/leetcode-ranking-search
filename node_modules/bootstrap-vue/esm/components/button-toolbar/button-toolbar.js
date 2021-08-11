import { Vue } from '../../vue';
import { NAME_BUTTON_TOOLBAR } from '../../constants/components';
import { PROP_TYPE_BOOLEAN } from '../../constants/props';
import { CODE_DOWN, CODE_LEFT, CODE_RIGHT, CODE_UP } from '../../constants/key-codes';
import { attemptFocus, contains, isVisible, selectAll } from '../../utils/dom';
import { stopEvent } from '../../utils/events';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { normalizeSlotMixin } from '../../mixins/normalize-slot'; // --- Constants ---

var ITEM_SELECTOR = ['.btn:not(.disabled):not([disabled]):not(.dropdown-item)', '.form-control:not(.disabled):not([disabled])', 'select:not(.disabled):not([disabled])', 'input[type="checkbox"]:not(.disabled)', 'input[type="radio"]:not(.disabled)'].join(','); // --- Props ---

export var props = makePropsConfigurable({
  justify: makeProp(PROP_TYPE_BOOLEAN, false),
  keyNav: makeProp(PROP_TYPE_BOOLEAN, false)
}, NAME_BUTTON_TOOLBAR); // --- Main component ---
// @vue/component

export var BButtonToolbar = /*#__PURE__*/Vue.extend({
  name: NAME_BUTTON_TOOLBAR,
  mixins: [normalizeSlotMixin],
  props: props,
  mounted: function mounted() {
    // Pre-set the tabindexes if the markup does not include
    // `tabindex="-1"` on the toolbar items
    if (this.keyNav) {
      this.getItems();
    }
  },
  methods: {
    getItems: function getItems() {
      var items = selectAll(ITEM_SELECTOR, this.$el); // Ensure `tabindex="-1"` is set on every item

      items.forEach(function (item) {
        item.tabIndex = -1;
      });
      return items.filter(function (el) {
        return isVisible(el);
      });
    },
    focusFirst: function focusFirst() {
      var items = this.getItems();
      attemptFocus(items[0]);
    },
    focusPrev: function focusPrev(event) {
      var items = this.getItems();
      var index = items.indexOf(event.target);

      if (index > -1) {
        items = items.slice(0, index).reverse();
        attemptFocus(items[0]);
      }
    },
    focusNext: function focusNext(event) {
      var items = this.getItems();
      var index = items.indexOf(event.target);

      if (index > -1) {
        items = items.slice(index + 1);
        attemptFocus(items[0]);
      }
    },
    focusLast: function focusLast() {
      var items = this.getItems().reverse();
      attemptFocus(items[0]);
    },
    onFocusin: function onFocusin(event) {
      var $el = this.$el;

      if (event.target === $el && !contains($el, event.relatedTarget)) {
        stopEvent(event);
        this.focusFirst(event);
      }
    },
    onKeydown: function onKeydown(event) {
      var keyCode = event.keyCode,
          shiftKey = event.shiftKey;

      if (keyCode === CODE_UP || keyCode === CODE_LEFT) {
        stopEvent(event);
        shiftKey ? this.focusFirst(event) : this.focusPrev(event);
      } else if (keyCode === CODE_DOWN || keyCode === CODE_RIGHT) {
        stopEvent(event);
        shiftKey ? this.focusLast(event) : this.focusNext(event);
      }
    }
  },
  render: function render(h) {
    var keyNav = this.keyNav;
    return h('div', {
      staticClass: 'btn-toolbar',
      class: {
        'justify-content-between': this.justify
      },
      attrs: {
        role: 'toolbar',
        tabindex: keyNav ? '0' : null
      },
      on: keyNav ? {
        focusin: this.onFocusin,
        keydown: this.onKeydown
      } : {}
    }, [this.normalizeSlot()]);
  }
});