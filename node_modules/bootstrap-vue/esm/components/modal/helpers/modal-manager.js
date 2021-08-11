/**
 * Private ModalManager helper
 * Handles controlling modal stacking zIndexes and body adjustments/classes
 */
import { Vue } from '../../../vue';
import { IS_BROWSER } from '../../../constants/env';
import { HOOK_EVENT_NAME_BEFORE_DESTROY } from '../../../constants/events';
import { addClass, getAttr, getBCR, getCS, getStyle, hasAttr, removeAttr, removeClass, requestAF, selectAll, setAttr, setStyle } from '../../../utils/dom';
import { isNull } from '../../../utils/inspect';
import { toFloat, toInteger } from '../../../utils/number'; // --- Constants ---
// Default modal backdrop z-index

var DEFAULT_ZINDEX = 1040; // Selectors for padding/margin adjustments

var SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
var SELECTOR_STICKY_CONTENT = '.sticky-top';
var SELECTOR_NAVBAR_TOGGLER = '.navbar-toggler'; // --- Main component ---
// @vue/component

var ModalManager = /*#__PURE__*/Vue.extend({
  data: function data() {
    return {
      modals: [],
      baseZIndex: null,
      scrollbarWidth: null,
      isBodyOverflowing: false
    };
  },
  computed: {
    modalCount: function modalCount() {
      return this.modals.length;
    },
    modalsAreOpen: function modalsAreOpen() {
      return this.modalCount > 0;
    }
  },
  watch: {
    modalCount: function modalCount(newCount, oldCount) {
      if (IS_BROWSER) {
        this.getScrollbarWidth();

        if (newCount > 0 && oldCount === 0) {
          // Transitioning to modal(s) open
          this.checkScrollbar();
          this.setScrollbar();
          addClass(document.body, 'modal-open');
        } else if (newCount === 0 && oldCount > 0) {
          // Transitioning to modal(s) closed
          this.resetScrollbar();
          removeClass(document.body, 'modal-open');
        }

        setAttr(document.body, 'data-modal-open-count', String(newCount));
      }
    },
    modals: function modals(newValue) {
      var _this = this;

      this.checkScrollbar();
      requestAF(function () {
        _this.updateModals(newValue || []);
      });
    }
  },
  methods: {
    // Public methods
    registerModal: function registerModal(modal) {
      var _this2 = this;

      // Register the modal if not already registered
      if (modal && this.modals.indexOf(modal) === -1) {
        // Add modal to modals array
        this.modals.push(modal);
        modal.$once(HOOK_EVENT_NAME_BEFORE_DESTROY, function () {
          _this2.unregisterModal(modal);
        });
      }
    },
    unregisterModal: function unregisterModal(modal) {
      var index = this.modals.indexOf(modal);

      if (index > -1) {
        // Remove modal from modals array
        this.modals.splice(index, 1); // Reset the modal's data

        if (!(modal._isBeingDestroyed || modal._isDestroyed)) {
          this.resetModal(modal);
        }
      }
    },
    getBaseZIndex: function getBaseZIndex() {
      if (isNull(this.baseZIndex) && IS_BROWSER) {
        // Create a temporary `div.modal-backdrop` to get computed z-index
        var div = document.createElement('div');
        addClass(div, 'modal-backdrop');
        addClass(div, 'd-none');
        setStyle(div, 'display', 'none');
        document.body.appendChild(div);
        this.baseZIndex = toInteger(getCS(div).zIndex, DEFAULT_ZINDEX);
        document.body.removeChild(div);
      }

      return this.baseZIndex || DEFAULT_ZINDEX;
    },
    getScrollbarWidth: function getScrollbarWidth() {
      if (isNull(this.scrollbarWidth) && IS_BROWSER) {
        // Create a temporary `div.measure-scrollbar` to get computed z-index
        var div = document.createElement('div');
        addClass(div, 'modal-scrollbar-measure');
        document.body.appendChild(div);
        this.scrollbarWidth = getBCR(div).width - div.clientWidth;
        document.body.removeChild(div);
      }

      return this.scrollbarWidth || 0;
    },
    // Private methods
    updateModals: function updateModals(modals) {
      var _this3 = this;

      var baseZIndex = this.getBaseZIndex();
      var scrollbarWidth = this.getScrollbarWidth();
      modals.forEach(function (modal, index) {
        // We update data values on each modal
        modal.zIndex = baseZIndex + index;
        modal.scrollbarWidth = scrollbarWidth;
        modal.isTop = index === _this3.modals.length - 1;
        modal.isBodyOverflowing = _this3.isBodyOverflowing;
      });
    },
    resetModal: function resetModal(modal) {
      if (modal) {
        modal.zIndex = this.getBaseZIndex();
        modal.isTop = true;
        modal.isBodyOverflowing = false;
      }
    },
    checkScrollbar: function checkScrollbar() {
      // Determine if the body element is overflowing
      var _getBCR = getBCR(document.body),
          left = _getBCR.left,
          right = _getBCR.right;

      this.isBodyOverflowing = left + right < window.innerWidth;
    },
    setScrollbar: function setScrollbar() {
      var body = document.body; // Storage place to cache changes to margins and padding
      // Note: This assumes the following element types are not added to the
      // document after the modal has opened.

      body._paddingChangedForModal = body._paddingChangedForModal || [];
      body._marginChangedForModal = body._marginChangedForModal || [];

      if (this.isBodyOverflowing) {
        var scrollbarWidth = this.scrollbarWidth; // Adjust fixed content padding

        /* istanbul ignore next: difficult to test in JSDOM */

        selectAll(SELECTOR_FIXED_CONTENT).forEach(function (el) {
          var actualPadding = getStyle(el, 'paddingRight') || '';
          setAttr(el, 'data-padding-right', actualPadding);
          setStyle(el, 'paddingRight', "".concat(toFloat(getCS(el).paddingRight, 0) + scrollbarWidth, "px"));

          body._paddingChangedForModal.push(el);
        }); // Adjust sticky content margin

        /* istanbul ignore next: difficult to test in JSDOM */

        selectAll(SELECTOR_STICKY_CONTENT).forEach(function (el)
        /* istanbul ignore next */
        {
          var actualMargin = getStyle(el, 'marginRight') || '';
          setAttr(el, 'data-margin-right', actualMargin);
          setStyle(el, 'marginRight', "".concat(toFloat(getCS(el).marginRight, 0) - scrollbarWidth, "px"));

          body._marginChangedForModal.push(el);
        }); // Adjust <b-navbar-toggler> margin

        /* istanbul ignore next: difficult to test in JSDOM */

        selectAll(SELECTOR_NAVBAR_TOGGLER).forEach(function (el)
        /* istanbul ignore next */
        {
          var actualMargin = getStyle(el, 'marginRight') || '';
          setAttr(el, 'data-margin-right', actualMargin);
          setStyle(el, 'marginRight', "".concat(toFloat(getCS(el).marginRight, 0) + scrollbarWidth, "px"));

          body._marginChangedForModal.push(el);
        }); // Adjust body padding

        var actualPadding = getStyle(body, 'paddingRight') || '';
        setAttr(body, 'data-padding-right', actualPadding);
        setStyle(body, 'paddingRight', "".concat(toFloat(getCS(body).paddingRight, 0) + scrollbarWidth, "px"));
      }
    },
    resetScrollbar: function resetScrollbar() {
      var body = document.body;

      if (body._paddingChangedForModal) {
        // Restore fixed content padding
        body._paddingChangedForModal.forEach(function (el) {
          /* istanbul ignore next: difficult to test in JSDOM */
          if (hasAttr(el, 'data-padding-right')) {
            setStyle(el, 'paddingRight', getAttr(el, 'data-padding-right') || '');
            removeAttr(el, 'data-padding-right');
          }
        });
      }

      if (body._marginChangedForModal) {
        // Restore sticky content and navbar-toggler margin
        body._marginChangedForModal.forEach(function (el) {
          /* istanbul ignore next: difficult to test in JSDOM */
          if (hasAttr(el, 'data-margin-right')) {
            setStyle(el, 'marginRight', getAttr(el, 'data-margin-right') || '');
            removeAttr(el, 'data-margin-right');
          }
        });
      }

      body._paddingChangedForModal = null;
      body._marginChangedForModal = null; // Restore body padding

      if (hasAttr(body, 'data-padding-right')) {
        setStyle(body, 'paddingRight', getAttr(body, 'data-padding-right') || '');
        removeAttr(body, 'data-padding-right');
      }
    }
  }
}); // Create and export our modal manager instance

export var modalManager = new ModalManager();