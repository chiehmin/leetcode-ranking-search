var _watch;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { COMPONENT_UID_KEY, Vue } from '../../vue';
import { NAME_TABS, NAME_TAB_BUTTON_HELPER } from '../../constants/components';
import { IS_BROWSER } from '../../constants/env';
import { EVENT_NAME_ACTIVATE_TAB, EVENT_NAME_CHANGED, EVENT_NAME_CLICK, EVENT_NAME_FIRST, EVENT_NAME_LAST, EVENT_NAME_NEXT, EVENT_NAME_PREV } from '../../constants/events';
import { CODE_DOWN, CODE_END, CODE_HOME, CODE_LEFT, CODE_RIGHT, CODE_SPACE, CODE_UP } from '../../constants/key-codes';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_NUMBER, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_EMPTY, SLOT_NAME_TABS_END, SLOT_NAME_TABS_START, SLOT_NAME_TITLE } from '../../constants/slots';
import { arrayIncludes } from '../../utils/array';
import { BvEvent } from '../../utils/bv-event.class';
import { attemptFocus, selectAll, requestAF } from '../../utils/dom';
import { stopEvent } from '../../utils/events';
import { identity } from '../../utils/identity';
import { isEvent } from '../../utils/inspect';
import { looseEqual } from '../../utils/loose-equal';
import { mathMax } from '../../utils/math';
import { makeModelMixin } from '../../utils/model';
import { toInteger } from '../../utils/number';
import { omit, sortKeys } from '../../utils/object';
import { observeDom } from '../../utils/observe-dom';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { stableSort } from '../../utils/stable-sort';
import { idMixin, props as idProps } from '../../mixins/id';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BLink } from '../link/link';
import { BNav, props as BNavProps } from '../nav/nav'; // --- Constants ---

var _makeModelMixin = makeModelMixin('value', {
  type: PROP_TYPE_NUMBER
}),
    modelMixin = _makeModelMixin.mixin,
    modelProps = _makeModelMixin.props,
    MODEL_PROP_NAME = _makeModelMixin.prop,
    MODEL_EVENT_NAME = _makeModelMixin.event; // --- Helper methods ---
// Filter function to filter out disabled tabs


var notDisabled = function notDisabled(tab) {
  return !tab.disabled;
}; // --- Helper components ---
// @vue/component


var BVTabButton = /*#__PURE__*/Vue.extend({
  name: NAME_TAB_BUTTON_HELPER,
  inject: {
    bvTabs: {
      default:
      /* istanbul ignore next */
      function _default() {
        return {};
      }
    }
  },
  props: {
    controls: makeProp(PROP_TYPE_STRING),
    id: makeProp(PROP_TYPE_STRING),
    noKeyNav: makeProp(PROP_TYPE_BOOLEAN, false),
    posInSet: makeProp(PROP_TYPE_NUMBER),
    setSize: makeProp(PROP_TYPE_NUMBER),
    // Reference to the child <b-tab> instance
    tab: makeProp(),
    tabIndex: makeProp(PROP_TYPE_NUMBER)
  },
  methods: {
    focus: function focus() {
      attemptFocus(this.$refs.link);
    },
    handleEvt: function handleEvt(event) {
      /* istanbul ignore next */
      if (this.tab.disabled) {
        return;
      }

      var type = event.type,
          keyCode = event.keyCode,
          shiftKey = event.shiftKey;

      if (type === 'click') {
        stopEvent(event);
        this.$emit(EVENT_NAME_CLICK, event);
      } else if (type === 'keydown' && keyCode === CODE_SPACE) {
        // For ARIA tabs the SPACE key will also trigger a click/select
        // Even with keyboard navigation disabled, SPACE should "click" the button
        // See: https://github.com/bootstrap-vue/bootstrap-vue/issues/4323
        stopEvent(event);
        this.$emit(EVENT_NAME_CLICK, event);
      } else if (type === 'keydown' && !this.noKeyNav) {
        // For keyboard navigation
        if ([CODE_UP, CODE_LEFT, CODE_HOME].indexOf(keyCode) !== -1) {
          stopEvent(event);

          if (shiftKey || keyCode === CODE_HOME) {
            this.$emit(EVENT_NAME_FIRST, event);
          } else {
            this.$emit(EVENT_NAME_PREV, event);
          }
        } else if ([CODE_DOWN, CODE_RIGHT, CODE_END].indexOf(keyCode) !== -1) {
          stopEvent(event);

          if (shiftKey || keyCode === CODE_END) {
            this.$emit(EVENT_NAME_LAST, event);
          } else {
            this.$emit(EVENT_NAME_NEXT, event);
          }
        }
      }
    }
  },
  render: function render(h) {
    var id = this.id,
        tabIndex = this.tabIndex,
        setSize = this.setSize,
        posInSet = this.posInSet,
        controls = this.controls,
        handleEvt = this.handleEvt;
    var _this$tab = this.tab,
        title = _this$tab.title,
        localActive = _this$tab.localActive,
        disabled = _this$tab.disabled,
        titleItemClass = _this$tab.titleItemClass,
        titleLinkClass = _this$tab.titleLinkClass,
        titleLinkAttributes = _this$tab.titleLinkAttributes;
    var $link = h(BLink, {
      staticClass: 'nav-link',
      class: [{
        active: localActive && !disabled,
        disabled: disabled
      }, titleLinkClass, // Apply <b-tabs> `activeNavItemClass` styles when the tab is active
      localActive ? this.bvTabs.activeNavItemClass : null],
      props: {
        disabled: disabled
      },
      attrs: _objectSpread(_objectSpread({}, titleLinkAttributes), {}, {
        id: id,
        role: 'tab',
        // Roving tab index when keynav enabled
        tabindex: tabIndex,
        'aria-selected': localActive && !disabled ? 'true' : 'false',
        'aria-setsize': setSize,
        'aria-posinset': posInSet,
        'aria-controls': controls
      }),
      on: {
        click: handleEvt,
        keydown: handleEvt
      },
      ref: 'link'
    }, [this.tab.normalizeSlot(SLOT_NAME_TITLE) || title]);
    return h('li', {
      staticClass: 'nav-item',
      class: [titleItemClass],
      attrs: {
        role: 'presentation'
      }
    }, [$link]);
  }
}); // --- Props ---

var navProps = omit(BNavProps, ['tabs', 'isNavBar', 'cardHeader']);
export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, idProps), modelProps), navProps), {}, {
  // Only applied to the currently active `<b-nav-item>`
  activeNavItemClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  // Only applied to the currently active `<b-tab>`
  // This prop is sniffed by the `<b-tab>` child
  activeTabClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  card: makeProp(PROP_TYPE_BOOLEAN, false),
  contentClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  // Synonym for 'bottom'
  end: makeProp(PROP_TYPE_BOOLEAN, false),
  // This prop is sniffed by the `<b-tab>` child
  lazy: makeProp(PROP_TYPE_BOOLEAN, false),
  navClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  navWrapperClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  noFade: makeProp(PROP_TYPE_BOOLEAN, false),
  noKeyNav: makeProp(PROP_TYPE_BOOLEAN, false),
  noNavStyle: makeProp(PROP_TYPE_BOOLEAN, false),
  tag: makeProp(PROP_TYPE_STRING, 'div')
})), NAME_TABS); // --- Main component ---
// @vue/component

export var BTabs = /*#__PURE__*/Vue.extend({
  name: NAME_TABS,
  mixins: [idMixin, modelMixin, normalizeSlotMixin],
  provide: function provide() {
    return {
      bvTabs: this
    };
  },
  props: props,
  data: function data() {
    return {
      // Index of current tab
      currentTab: toInteger(this[MODEL_PROP_NAME], -1),
      // Array of direct child `<b-tab>` instances, in DOM order
      tabs: [],
      // Array of child instances registered (for triggering reactive updates)
      registeredTabs: []
    };
  },
  computed: {
    fade: function fade() {
      // This computed prop is sniffed by the tab child
      return !this.noFade;
    },
    localNavClass: function localNavClass() {
      var classes = [];

      if (this.card && this.vertical) {
        classes.push('card-header', 'h-100', 'border-bottom-0', 'rounded-0');
      }

      return [].concat(classes, [this.navClass]);
    }
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME, function (newValue, oldValue) {
    if (newValue !== oldValue) {
      newValue = toInteger(newValue, -1);
      oldValue = toInteger(oldValue, 0);
      var $tab = this.tabs[newValue];

      if ($tab && !$tab.disabled) {
        this.activateTab($tab);
      } else {
        // Try next or prev tabs
        if (newValue < oldValue) {
          this.previousTab();
        } else {
          this.nextTab();
        }
      }
    }
  }), _defineProperty(_watch, "currentTab", function currentTab(newValue) {
    var index = -1; // Ensure only one tab is active at most

    this.tabs.forEach(function ($tab, i) {
      if (i === newValue && !$tab.disabled) {
        $tab.localActive = true;
        index = i;
      } else {
        $tab.localActive = false;
      }
    }); // Update the v-model

    this.$emit(MODEL_EVENT_NAME, index);
  }), _defineProperty(_watch, "tabs", function tabs(newValue, oldValue) {
    var _this = this;

    // We use `_uid` instead of `safeId()`, as the later is changed in a `$nextTick()`
    // if no explicit ID is provided, causing duplicate emits
    if (!looseEqual(newValue.map(function ($tab) {
      return $tab[COMPONENT_UID_KEY];
    }), oldValue.map(function ($tab) {
      return $tab[COMPONENT_UID_KEY];
    }))) {
      // In a `$nextTick()` to ensure `currentTab` has been set first
      this.$nextTick(function () {
        // We emit shallow copies of the new and old arrays of tabs,
        // to prevent users from potentially mutating the internal arrays
        _this.$emit(EVENT_NAME_CHANGED, newValue.slice(), oldValue.slice());
      });
    }
  }), _defineProperty(_watch, "registeredTabs", function registeredTabs() {
    this.updateTabs();
  }), _watch),
  created: function created() {
    // Create private non-reactive props
    this.$_observer = null;
  },
  mounted: function mounted() {
    this.setObserver(true);
  },
  beforeDestroy: function beforeDestroy() {
    this.setObserver(false); // Ensure no references to child instances exist

    this.tabs = [];
  },
  methods: {
    registerTab: function registerTab($tab) {
      if (!arrayIncludes(this.registeredTabs, $tab)) {
        this.registeredTabs.push($tab);
      }
    },
    unregisterTab: function unregisterTab($tab) {
      this.registeredTabs = this.registeredTabs.slice().filter(function ($t) {
        return $t !== $tab;
      });
    },
    // DOM observer is needed to detect changes in order of tabs
    setObserver: function setObserver() {
      var _this2 = this;

      var on = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.$_observer && this.$_observer.disconnect();
      this.$_observer = null;

      if (on) {
        /* istanbul ignore next: difficult to test mutation observer in JSDOM */
        var handler = function handler() {
          _this2.$nextTick(function () {
            requestAF(function () {
              _this2.updateTabs();
            });
          });
        }; // Watch for changes to `<b-tab>` sub components


        this.$_observer = observeDom(this.$refs.content, handler, {
          childList: true,
          subtree: false,
          attributes: true,
          attributeFilter: ['id']
        });
      }
    },
    getTabs: function getTabs() {
      var $tabs = this.registeredTabs.filter(function ($tab) {
        return $tab.$children.filter(function ($t) {
          return $t._isTab;
        }).length === 0;
      }); // DOM Order of Tabs

      var order = [];
      /* istanbul ignore next: too difficult to test */

      if (IS_BROWSER && $tabs.length > 0) {
        // We rely on the DOM when mounted to get the "true" order of the `<b-tab>` children
        // `querySelectorAll()` always returns elements in document order, regardless of
        // order specified in the selector
        var selector = $tabs.map(function ($tab) {
          return "#".concat($tab.safeId());
        }).join(', ');
        order = selectAll(selector, this.$el).map(function ($el) {
          return $el.id;
        }).filter(identity);
      } // Stable sort keeps the original order if not found in the `order` array,
      // which will be an empty array before mount


      return stableSort($tabs, function (a, b) {
        return order.indexOf(a.safeId()) - order.indexOf(b.safeId());
      });
    },
    updateTabs: function updateTabs() {
      var $tabs = this.getTabs(); // Find last active non-disabled tab in current tabs
      // We trust tab state over `currentTab`, in case tabs were added/removed/re-ordered

      var tabIndex = $tabs.indexOf($tabs.slice().reverse().find(function ($tab) {
        return $tab.localActive && !$tab.disabled;
      })); // Else try setting to `currentTab`

      if (tabIndex < 0) {
        var currentTab = this.currentTab;

        if (currentTab >= $tabs.length) {
          // Handle last tab being removed, so find the last non-disabled tab
          tabIndex = $tabs.indexOf($tabs.slice().reverse().find(notDisabled));
        } else if ($tabs[currentTab] && !$tabs[currentTab].disabled) {
          // Current tab is not disabled
          tabIndex = currentTab;
        }
      } // Else find first non-disabled tab in current tabs


      if (tabIndex < 0) {
        tabIndex = $tabs.indexOf($tabs.find(notDisabled));
      } // Ensure only one tab is active at a time


      $tabs.forEach(function ($tab, index) {
        $tab.localActive = index === tabIndex;
      });
      this.tabs = $tabs;
      this.currentTab = tabIndex;
    },
    // Find a button that controls a tab, given the tab reference
    // Returns the button vm instance
    getButtonForTab: function getButtonForTab($tab) {
      return (this.$refs.buttons || []).find(function ($btn) {
        return $btn.tab === $tab;
      });
    },
    // Force a button to re-render its content, given a `<b-tab>` instance
    // Called by `<b-tab>` on `update()`
    updateButton: function updateButton($tab) {
      var $button = this.getButtonForTab($tab);

      if ($button && $button.$forceUpdate) {
        $button.$forceUpdate();
      }
    },
    // Activate a tab given a `<b-tab>` instance
    // Also accessed by `<b-tab>`
    activateTab: function activateTab($tab) {
      var currentTab = this.currentTab,
          $tabs = this.tabs;
      var result = false;

      if ($tab) {
        var index = $tabs.indexOf($tab);

        if (index !== currentTab && index > -1 && !$tab.disabled) {
          var tabEvent = new BvEvent(EVENT_NAME_ACTIVATE_TAB, {
            cancelable: true,
            vueTarget: this,
            componentId: this.safeId()
          });
          this.$emit(tabEvent.type, index, currentTab, tabEvent);

          if (!tabEvent.defaultPrevented) {
            this.currentTab = index;
            result = true;
          }
        }
      } // Couldn't set tab, so ensure v-model is up to date

      /* istanbul ignore next: should rarely happen */


      if (!result && this[MODEL_PROP_NAME] !== currentTab) {
        this.$emit(MODEL_EVENT_NAME, currentTab);
      }

      return result;
    },
    // Deactivate a tab given a `<b-tab>` instance
    // Accessed by `<b-tab>`
    deactivateTab: function deactivateTab($tab) {
      if ($tab) {
        // Find first non-disabled tab that isn't the one being deactivated
        // If no tabs are available, then don't deactivate current tab
        return this.activateTab(this.tabs.filter(function ($t) {
          return $t !== $tab;
        }).find(notDisabled));
      }
      /* istanbul ignore next: should never/rarely happen */


      return false;
    },
    // Focus a tab button given its `<b-tab>` instance
    focusButton: function focusButton($tab) {
      var _this3 = this;

      // Wrap in `$nextTick()` to ensure DOM has completed rendering
      this.$nextTick(function () {
        attemptFocus(_this3.getButtonForTab($tab));
      });
    },
    // Emit a click event on a specified `<b-tab>` component instance
    emitTabClick: function emitTabClick(tab, event) {
      if (isEvent(event) && tab && tab.$emit && !tab.disabled) {
        tab.$emit(EVENT_NAME_CLICK, event);
      }
    },
    // Click handler
    clickTab: function clickTab($tab, event) {
      this.activateTab($tab);
      this.emitTabClick($tab, event);
    },
    // Move to first non-disabled tab
    firstTab: function firstTab(focus) {
      var $tab = this.tabs.find(notDisabled);

      if (this.activateTab($tab) && focus) {
        this.focusButton($tab);
        this.emitTabClick($tab, focus);
      }
    },
    // Move to previous non-disabled tab
    previousTab: function previousTab(focus) {
      var currentIndex = mathMax(this.currentTab, 0);
      var $tab = this.tabs.slice(0, currentIndex).reverse().find(notDisabled);

      if (this.activateTab($tab) && focus) {
        this.focusButton($tab);
        this.emitTabClick($tab, focus);
      }
    },
    // Move to next non-disabled tab
    nextTab: function nextTab(focus) {
      var currentIndex = mathMax(this.currentTab, -1);
      var $tab = this.tabs.slice(currentIndex + 1).find(notDisabled);

      if (this.activateTab($tab) && focus) {
        this.focusButton($tab);
        this.emitTabClick($tab, focus);
      }
    },
    // Move to last non-disabled tab
    lastTab: function lastTab(focus) {
      var $tab = this.tabs.slice().reverse().find(notDisabled);

      if (this.activateTab($tab) && focus) {
        this.focusButton($tab);
        this.emitTabClick($tab, focus);
      }
    }
  },
  render: function render(h) {
    var _this4 = this;

    var align = this.align,
        card = this.card,
        end = this.end,
        fill = this.fill,
        firstTab = this.firstTab,
        justified = this.justified,
        lastTab = this.lastTab,
        nextTab = this.nextTab,
        noKeyNav = this.noKeyNav,
        noNavStyle = this.noNavStyle,
        pills = this.pills,
        previousTab = this.previousTab,
        small = this.small,
        $tabs = this.tabs,
        vertical = this.vertical; // Currently active tab

    var $activeTab = $tabs.find(function ($tab) {
      return $tab.localActive && !$tab.disabled;
    }); // Tab button to allow focusing when no active tab found (keynav only)

    var $fallbackTab = $tabs.find(function ($tab) {
      return !$tab.disabled;
    }); // For each `<b-tab>` found create the tab buttons

    var $buttons = $tabs.map(function ($tab, index) {
      var _on;

      var safeId = $tab.safeId; // Ensure at least one tab button is focusable when keynav enabled (if possible)

      var tabIndex = null;

      if (!noKeyNav) {
        // Buttons are not in tab index unless active, or a fallback tab
        tabIndex = -1;

        if ($tab === $activeTab || !$activeTab && $tab === $fallbackTab) {
          // Place tab button in tab sequence
          tabIndex = null;
        }
      }

      return h(BVTabButton, {
        props: {
          controls: safeId ? safeId() : null,
          id: $tab.controlledBy || (safeId ? safeId("_BV_tab_button_") : null),
          noKeyNav: noKeyNav,
          posInSet: index + 1,
          setSize: $tabs.length,
          tab: $tab,
          tabIndex: tabIndex
        },
        on: (_on = {}, _defineProperty(_on, EVENT_NAME_CLICK, function (event) {
          _this4.clickTab($tab, event);
        }), _defineProperty(_on, EVENT_NAME_FIRST, firstTab), _defineProperty(_on, EVENT_NAME_PREV, previousTab), _defineProperty(_on, EVENT_NAME_NEXT, nextTab), _defineProperty(_on, EVENT_NAME_LAST, lastTab), _on),
        key: $tab[COMPONENT_UID_KEY] || index,
        ref: 'buttons',
        // Needed to make `this.$refs.buttons` an array
        refInFor: true
      });
    });
    var $nav = h(BNav, {
      class: this.localNavClass,
      attrs: {
        role: 'tablist',
        id: this.safeId('_BV_tab_controls_')
      },
      props: {
        fill: fill,
        justified: justified,
        align: align,
        tabs: !noNavStyle && !pills,
        pills: !noNavStyle && pills,
        vertical: vertical,
        small: small,
        cardHeader: card && !vertical
      },
      ref: 'nav'
    }, [this.normalizeSlot(SLOT_NAME_TABS_START) || h(), $buttons, this.normalizeSlot(SLOT_NAME_TABS_END) || h()]);
    $nav = h('div', {
      class: [{
        'card-header': card && !vertical && !end,
        'card-footer': card && !vertical && end,
        'col-auto': vertical
      }, this.navWrapperClass],
      key: 'bv-tabs-nav'
    }, [$nav]);
    var $children = this.normalizeSlot() || [];
    var $empty = h();

    if ($children.length === 0) {
      $empty = h('div', {
        class: ['tab-pane', 'active', {
          'card-body': card
        }],
        key: 'bv-empty-tab'
      }, this.normalizeSlot(SLOT_NAME_EMPTY));
    }

    var $content = h('div', {
      staticClass: 'tab-content',
      class: [{
        col: vertical
      }, this.contentClass],
      attrs: {
        id: this.safeId('_BV_tab_container_')
      },
      key: 'bv-content',
      ref: 'content'
    }, [$children, $empty]); // Render final output

    return h(this.tag, {
      staticClass: 'tabs',
      class: {
        row: vertical,
        'no-gutters': vertical && card
      },
      attrs: {
        id: this.safeId()
      }
    }, [end ? $content : h(), $nav, end ? h() : $content]);
  }
});