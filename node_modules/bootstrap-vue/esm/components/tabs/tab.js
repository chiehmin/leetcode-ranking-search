var _objectSpread2, _watch;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_TAB } from '../../constants/components';
import { MODEL_EVENT_NAME_PREFIX } from '../../constants/events';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_TITLE } from '../../constants/slots';
import { sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { idMixin, props as idProps } from '../../mixins/id';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BVTransition } from '../transition/bv-transition'; // --- Constants ---

var MODEL_PROP_NAME_ACTIVE = 'active';
var MODEL_EVENT_NAME_ACTIVE = MODEL_EVENT_NAME_PREFIX + MODEL_PROP_NAME_ACTIVE; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, idProps), {}, (_objectSpread2 = {}, _defineProperty(_objectSpread2, MODEL_PROP_NAME_ACTIVE, makeProp(PROP_TYPE_BOOLEAN, false)), _defineProperty(_objectSpread2, "buttonId", makeProp(PROP_TYPE_STRING)), _defineProperty(_objectSpread2, "disabled", makeProp(PROP_TYPE_BOOLEAN, false)), _defineProperty(_objectSpread2, "lazy", makeProp(PROP_TYPE_BOOLEAN, false)), _defineProperty(_objectSpread2, "noBody", makeProp(PROP_TYPE_BOOLEAN, false)), _defineProperty(_objectSpread2, "tag", makeProp(PROP_TYPE_STRING, 'div')), _defineProperty(_objectSpread2, "title", makeProp(PROP_TYPE_STRING)), _defineProperty(_objectSpread2, "titleItemClass", makeProp(PROP_TYPE_ARRAY_OBJECT_STRING)), _defineProperty(_objectSpread2, "titleLinkAttributes", makeProp(PROP_TYPE_OBJECT)), _defineProperty(_objectSpread2, "titleLinkClass", makeProp(PROP_TYPE_ARRAY_OBJECT_STRING)), _objectSpread2))), NAME_TAB); // --- Main component ---
// @vue/component

export var BTab = /*#__PURE__*/Vue.extend({
  name: NAME_TAB,
  mixins: [idMixin, normalizeSlotMixin],
  inject: {
    bvTabs: {
      default: function _default() {
        return {};
      }
    }
  },
  props: props,
  data: function data() {
    return {
      localActive: this[MODEL_PROP_NAME_ACTIVE] && !this.disabled
    };
  },
  computed: {
    // For parent sniffing of child
    _isTab: function _isTab() {
      return true;
    },
    tabClasses: function tabClasses() {
      var active = this.localActive,
          disabled = this.disabled;
      return [{
        active: active,
        disabled: disabled,
        'card-body': this.bvTabs.card && !this.noBody
      }, // Apply <b-tabs> `activeTabClass` styles when this tab is active
      active ? this.bvTabs.activeTabClass : null];
    },
    controlledBy: function controlledBy() {
      return this.buttonId || this.safeId('__BV_tab_button__');
    },
    computedNoFade: function computedNoFade() {
      return !(this.bvTabs.fade || false);
    },
    computedLazy: function computedLazy() {
      return this.bvTabs.lazy || this.lazy;
    }
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME_ACTIVE, function (newValue, oldValue) {
    if (newValue !== oldValue) {
      if (newValue) {
        // If activated post mount
        this.activate();
      } else {
        /* istanbul ignore next */
        if (!this.deactivate()) {
          // Tab couldn't be deactivated, so we reset the synced active prop
          // Deactivation will fail if no other tabs to activate
          this.$emit(MODEL_EVENT_NAME_ACTIVE, this.localActive);
        }
      }
    }
  }), _defineProperty(_watch, "disabled", function disabled(newValue, oldValue) {
    if (newValue !== oldValue) {
      var firstTab = this.bvTabs.firstTab;

      if (newValue && this.localActive && firstTab) {
        this.localActive = false;
        firstTab();
      }
    }
  }), _defineProperty(_watch, "localActive", function localActive(newValue) {
    // Make `active` prop work with `.sync` modifier
    this.$emit(MODEL_EVENT_NAME_ACTIVE, newValue);
  }), _watch),
  mounted: function mounted() {
    // Inform `<b-tabs>` of our presence
    this.registerTab();
  },
  updated: function updated() {
    // Force the tab button content to update (since slots are not reactive)
    // Only done if we have a title slot, as the title prop is reactive
    var updateButton = this.bvTabs.updateButton;

    if (updateButton && this.hasNormalizedSlot(SLOT_NAME_TITLE)) {
      updateButton(this);
    }
  },
  beforeDestroy: function beforeDestroy() {
    // Inform `<b-tabs>` of our departure
    this.unregisterTab();
  },
  methods: {
    // Private methods
    registerTab: function registerTab() {
      // Inform `<b-tabs>` of our presence
      var registerTab = this.bvTabs.registerTab;

      if (registerTab) {
        registerTab(this);
      }
    },
    unregisterTab: function unregisterTab() {
      // Inform `<b-tabs>` of our departure
      var unregisterTab = this.bvTabs.unregisterTab;

      if (unregisterTab) {
        unregisterTab(this);
      }
    },
    // Public methods
    activate: function activate() {
      // Not inside a `<b-tabs>` component or tab is disabled
      var activateTab = this.bvTabs.activateTab;
      return activateTab && !this.disabled ? activateTab(this) : false;
    },
    deactivate: function deactivate() {
      // Not inside a `<b-tabs>` component or not active to begin with
      var deactivateTab = this.bvTabs.deactivateTab;
      return deactivateTab && this.localActive ? deactivateTab(this) : false;
    }
  },
  render: function render(h) {
    var localActive = this.localActive;
    var $content = h(this.tag, {
      staticClass: 'tab-pane',
      class: this.tabClasses,
      directives: [{
        name: 'show',
        value: localActive
      }],
      attrs: {
        role: 'tabpanel',
        id: this.safeId(),
        'aria-hidden': localActive ? 'false' : 'true',
        'aria-labelledby': this.controlledBy || null
      },
      ref: 'panel'
    }, // Render content lazily if requested
    [localActive || !this.computedLazy ? this.normalizeSlot() : h()]);
    return h(BVTransition, {
      props: {
        mode: 'out-in',
        noFade: this.computedNoFade
      }
    }, [$content]);
  }
});