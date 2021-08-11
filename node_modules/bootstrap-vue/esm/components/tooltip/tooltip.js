var _makePropsConfigurabl, _watch;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_TOOLTIP } from '../../constants/components';
import { EVENT_NAME_CLOSE, EVENT_NAME_DISABLE, EVENT_NAME_DISABLED, EVENT_NAME_ENABLE, EVENT_NAME_ENABLED, EVENT_NAME_HIDDEN, EVENT_NAME_HIDE, EVENT_NAME_OPEN, EVENT_NAME_SHOW, EVENT_NAME_SHOWN, MODEL_EVENT_NAME_PREFIX } from '../../constants/events';
import { PROP_TYPE_ARRAY_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_FUNCTION, PROP_TYPE_NUMBER_OBJECT_STRING, PROP_TYPE_NUMBER_STRING, PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '../../constants/props';
import { HTMLElement, SVGElement } from '../../constants/safe-types';
import { getScopeId } from '../../utils/get-scope-id';
import { isUndefinedOrNull } from '../../utils/inspect';
import { pick } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BVTooltip } from './helpers/bv-tooltip'; // --- Constants ---

var MODEL_PROP_NAME_ENABLED = 'disabled';
var MODEL_EVENT_NAME_ENABLED = MODEL_EVENT_NAME_PREFIX + MODEL_PROP_NAME_ENABLED;
var MODEL_PROP_NAME_SHOW = 'show';
var MODEL_EVENT_NAME_SHOW = MODEL_EVENT_NAME_PREFIX + MODEL_PROP_NAME_SHOW; // --- Props ---

export var props = makePropsConfigurable((_makePropsConfigurabl = {
  // String: scrollParent, window, or viewport
  // Element: element reference
  // Object: Vue component
  boundary: makeProp([HTMLElement, PROP_TYPE_OBJECT, PROP_TYPE_STRING], 'scrollParent'),
  boundaryPadding: makeProp(PROP_TYPE_NUMBER_STRING, 50),
  // String: HTML ID of container, if null body is used (default)
  // HTMLElement: element reference reference
  // Object: Vue Component
  container: makeProp([HTMLElement, PROP_TYPE_OBJECT, PROP_TYPE_STRING]),
  customClass: makeProp(PROP_TYPE_STRING),
  delay: makeProp(PROP_TYPE_NUMBER_OBJECT_STRING, 50)
}, _defineProperty(_makePropsConfigurabl, MODEL_PROP_NAME_ENABLED, makeProp(PROP_TYPE_BOOLEAN, false)), _defineProperty(_makePropsConfigurabl, "fallbackPlacement", makeProp(PROP_TYPE_ARRAY_STRING, 'flip')), _defineProperty(_makePropsConfigurabl, "id", makeProp(PROP_TYPE_STRING)), _defineProperty(_makePropsConfigurabl, "noFade", makeProp(PROP_TYPE_BOOLEAN, false)), _defineProperty(_makePropsConfigurabl, "noninteractive", makeProp(PROP_TYPE_BOOLEAN, false)), _defineProperty(_makePropsConfigurabl, "offset", makeProp(PROP_TYPE_NUMBER_STRING, 0)), _defineProperty(_makePropsConfigurabl, "placement", makeProp(PROP_TYPE_STRING, 'top')), _defineProperty(_makePropsConfigurabl, MODEL_PROP_NAME_SHOW, makeProp(PROP_TYPE_BOOLEAN, false)), _defineProperty(_makePropsConfigurabl, "target", makeProp([HTMLElement, SVGElement, PROP_TYPE_FUNCTION, PROP_TYPE_OBJECT, PROP_TYPE_STRING], undefined, true)), _defineProperty(_makePropsConfigurabl, "title", makeProp(PROP_TYPE_STRING)), _defineProperty(_makePropsConfigurabl, "triggers", makeProp(PROP_TYPE_ARRAY_STRING, 'hover focus')), _defineProperty(_makePropsConfigurabl, "variant", makeProp(PROP_TYPE_STRING)), _makePropsConfigurabl), NAME_TOOLTIP); // --- Main component ---
// @vue/component

export var BTooltip = /*#__PURE__*/Vue.extend({
  name: NAME_TOOLTIP,
  mixins: [normalizeSlotMixin],
  inheritAttrs: false,
  props: props,
  data: function data() {
    return {
      localShow: this[MODEL_PROP_NAME_SHOW],
      localTitle: '',
      localContent: ''
    };
  },
  computed: {
    // Data that will be passed to the template and popper
    templateData: function templateData() {
      return _objectSpread({
        title: this.localTitle,
        content: this.localContent,
        interactive: !this.noninteractive
      }, pick(this.$props, ['boundary', 'boundaryPadding', 'container', 'customClass', 'delay', 'fallbackPlacement', 'id', 'noFade', 'offset', 'placement', 'target', 'target', 'triggers', 'variant', MODEL_PROP_NAME_ENABLED]));
    },
    // Used to watch for changes to the title and content props
    templateTitleContent: function templateTitleContent() {
      var title = this.title,
          content = this.content;
      return {
        title: title,
        content: content
      };
    }
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME_SHOW, function (newValue, oldValue) {
    if (newValue !== oldValue && newValue !== this.localShow && this.$_toolpop) {
      if (newValue) {
        this.$_toolpop.show();
      } else {
        // We use `forceHide()` to override any active triggers
        this.$_toolpop.forceHide();
      }
    }
  }), _defineProperty(_watch, MODEL_PROP_NAME_ENABLED, function (newValue) {
    if (newValue) {
      this.doDisable();
    } else {
      this.doEnable();
    }
  }), _defineProperty(_watch, "localShow", function localShow(newValue) {
    // TODO: May need to be done in a `$nextTick()`
    this.$emit(MODEL_EVENT_NAME_SHOW, newValue);
  }), _defineProperty(_watch, "templateData", function templateData() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.$_toolpop) {
        _this.$_toolpop.updateData(_this.templateData);
      }
    });
  }), _defineProperty(_watch, "templateTitleContent", function templateTitleContent() {
    this.$nextTick(this.updateContent);
  }), _watch),
  created: function created() {
    // Create private non-reactive props
    this.$_toolpop = null;
  },
  updated: function updated() {
    // Update the `propData` object
    // Done in a `$nextTick()` to ensure slot(s) have updated
    this.$nextTick(this.updateContent);
  },
  beforeDestroy: function beforeDestroy() {
    // Shutdown our local event listeners
    this.$off(EVENT_NAME_OPEN, this.doOpen);
    this.$off(EVENT_NAME_CLOSE, this.doClose);
    this.$off(EVENT_NAME_DISABLE, this.doDisable);
    this.$off(EVENT_NAME_ENABLE, this.doEnable); // Destroy the tip instance

    if (this.$_toolpop) {
      this.$_toolpop.$destroy();
      this.$_toolpop = null;
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    // Instantiate a new BVTooltip instance
    // Done in a `$nextTick()` to ensure DOM has completed rendering
    // so that target can be found
    this.$nextTick(function () {
      // Load the on demand child instance
      var Component = _this2.getComponent(); // Ensure we have initial content


      _this2.updateContent(); // Pass down the scoped style attribute if available


      var scopeId = getScopeId(_this2) || getScopeId(_this2.$parent); // Create the instance

      var $toolpop = _this2.$_toolpop = new Component({
        parent: _this2,
        // Pass down the scoped style ID
        _scopeId: scopeId || undefined
      }); // Set the initial data

      $toolpop.updateData(_this2.templateData); // Set listeners

      $toolpop.$on(EVENT_NAME_SHOW, _this2.onShow);
      $toolpop.$on(EVENT_NAME_SHOWN, _this2.onShown);
      $toolpop.$on(EVENT_NAME_HIDE, _this2.onHide);
      $toolpop.$on(EVENT_NAME_HIDDEN, _this2.onHidden);
      $toolpop.$on(EVENT_NAME_DISABLED, _this2.onDisabled);
      $toolpop.$on(EVENT_NAME_ENABLED, _this2.onEnabled); // Initially disabled?

      if (_this2[MODEL_PROP_NAME_ENABLED]) {
        // Initially disabled
        _this2.doDisable();
      } // Listen to open signals from others


      _this2.$on(EVENT_NAME_OPEN, _this2.doOpen); // Listen to close signals from others


      _this2.$on(EVENT_NAME_CLOSE, _this2.doClose); // Listen to disable signals from others


      _this2.$on(EVENT_NAME_DISABLE, _this2.doDisable); // Listen to enable signals from others


      _this2.$on(EVENT_NAME_ENABLE, _this2.doEnable); // Initially show tooltip?


      if (_this2.localShow) {
        $toolpop.show();
      }
    });
  },
  methods: {
    getComponent: function getComponent() {
      // Overridden by BPopover
      return BVTooltip;
    },
    updateContent: function updateContent() {
      // Overridden by BPopover
      // Tooltip: Default slot is `title`
      // Popover: Default slot is `content`, `title` slot is title
      // We pass a scoped slot function reference by default (Vue v2.6x)
      // And pass the title prop as a fallback
      this.setTitle(this.normalizeSlot() || this.title);
    },
    // Helper methods for `updateContent()`
    setTitle: function setTitle(value) {
      value = isUndefinedOrNull(value) ? '' : value; // We only update the value if it has changed

      if (this.localTitle !== value) {
        this.localTitle = value;
      }
    },
    setContent: function setContent(value) {
      value = isUndefinedOrNull(value) ? '' : value; // We only update the value if it has changed

      if (this.localContent !== value) {
        this.localContent = value;
      }
    },
    // --- Template event handlers ---
    onShow: function onShow(bvEvent) {
      // Placeholder
      this.$emit(EVENT_NAME_SHOW, bvEvent);

      if (bvEvent) {
        this.localShow = !bvEvent.defaultPrevented;
      }
    },
    onShown: function onShown(bvEvent) {
      // Tip is now showing
      this.localShow = true;
      this.$emit(EVENT_NAME_SHOWN, bvEvent);
    },
    onHide: function onHide(bvEvent) {
      this.$emit(EVENT_NAME_HIDE, bvEvent);
    },
    onHidden: function onHidden(bvEvent) {
      // Tip is no longer showing
      this.$emit(EVENT_NAME_HIDDEN, bvEvent);
      this.localShow = false;
    },
    onDisabled: function onDisabled(bvEvent) {
      // Prevent possible endless loop if user mistakenly
      // fires `disabled` instead of `disable`
      if (bvEvent && bvEvent.type === EVENT_NAME_DISABLED) {
        this.$emit(MODEL_EVENT_NAME_ENABLED, true);
        this.$emit(EVENT_NAME_DISABLED, bvEvent);
      }
    },
    onEnabled: function onEnabled(bvEvent) {
      // Prevent possible endless loop if user mistakenly
      // fires `enabled` instead of `enable`
      if (bvEvent && bvEvent.type === EVENT_NAME_ENABLED) {
        this.$emit(MODEL_EVENT_NAME_ENABLED, false);
        this.$emit(EVENT_NAME_ENABLED, bvEvent);
      }
    },
    // --- Local event listeners ---
    doOpen: function doOpen() {
      !this.localShow && this.$_toolpop && this.$_toolpop.show();
    },
    doClose: function doClose() {
      this.localShow && this.$_toolpop && this.$_toolpop.hide();
    },
    doDisable: function doDisable() {
      this.$_toolpop && this.$_toolpop.disable();
    },
    doEnable: function doEnable() {
      this.$_toolpop && this.$_toolpop.enable();
    }
  },
  render: function render(h) {
    // Always renders a comment node
    // TODO:
    //   Future: Possibly render a target slot (single root element)
    //   which we can apply the listeners to (pass `this.$el` to BVTooltip)
    return h();
  }
});