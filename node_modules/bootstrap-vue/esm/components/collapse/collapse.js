var _watch;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_COLLAPSE } from '../../constants/components';
import { CLASS_NAME_SHOW } from '../../constants/classes';
import { IS_BROWSER } from '../../constants/env';
import { EVENT_NAME_HIDDEN, EVENT_NAME_HIDE, EVENT_NAME_SHOW, EVENT_NAME_SHOWN, EVENT_OPTIONS_NO_CAPTURE } from '../../constants/events';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_DEFAULT } from '../../constants/slots';
import { addClass, hasClass, removeClass, closest, matches, getCS } from '../../utils/dom';
import { getRootActionEventName, getRootEventName, eventOnOff } from '../../utils/events';
import { makeModelMixin } from '../../utils/model';
import { sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { idMixin, props as idProps } from '../../mixins/id';
import { listenOnRootMixin } from '../../mixins/listen-on-root';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BVCollapse } from './helpers/bv-collapse'; // --- Constants ---

var ROOT_ACTION_EVENT_NAME_TOGGLE = getRootActionEventName(NAME_COLLAPSE, 'toggle');
var ROOT_ACTION_EVENT_NAME_REQUEST_STATE = getRootActionEventName(NAME_COLLAPSE, 'request-state');
var ROOT_EVENT_NAME_ACCORDION = getRootEventName(NAME_COLLAPSE, 'accordion');
var ROOT_EVENT_NAME_STATE = getRootEventName(NAME_COLLAPSE, 'state');
var ROOT_EVENT_NAME_SYNC_STATE = getRootEventName(NAME_COLLAPSE, 'sync-state');

var _makeModelMixin = makeModelMixin('visible', {
  type: PROP_TYPE_BOOLEAN,
  defaultValue: false
}),
    modelMixin = _makeModelMixin.mixin,
    modelProps = _makeModelMixin.props,
    MODEL_PROP_NAME = _makeModelMixin.prop,
    MODEL_EVENT_NAME = _makeModelMixin.event; // --- Props ---


export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread({}, idProps), modelProps), {}, {
  // If `true` (and `visible` is `true` on mount), animate initially visible
  accordion: makeProp(PROP_TYPE_STRING),
  appear: makeProp(PROP_TYPE_BOOLEAN, false),
  isNav: makeProp(PROP_TYPE_BOOLEAN, false),
  tag: makeProp(PROP_TYPE_STRING, 'div')
})), NAME_COLLAPSE); // --- Main component ---
// @vue/component

export var BCollapse = /*#__PURE__*/Vue.extend({
  name: NAME_COLLAPSE,
  mixins: [idMixin, modelMixin, normalizeSlotMixin, listenOnRootMixin],
  props: props,
  data: function data() {
    return {
      show: this[MODEL_PROP_NAME],
      transitioning: false
    };
  },
  computed: {
    classObject: function classObject() {
      var transitioning = this.transitioning;
      return {
        'navbar-collapse': this.isNav,
        collapse: !transitioning,
        show: this.show && !transitioning
      };
    },
    slotScope: function slotScope() {
      var _this = this;

      return {
        visible: this.show,
        close: function close() {
          _this.show = false;
        }
      };
    }
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME, function (newValue) {
    if (newValue !== this.show) {
      this.show = newValue;
    }
  }), _defineProperty(_watch, "show", function show(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.emitState();
    }
  }), _watch),
  created: function created() {
    this.show = this[MODEL_PROP_NAME];
  },
  mounted: function mounted() {
    var _this2 = this;

    this.show = this[MODEL_PROP_NAME]; // Listen for toggle events to open/close us

    this.listenOnRoot(ROOT_ACTION_EVENT_NAME_TOGGLE, this.handleToggleEvt); // Listen to other collapses for accordion events

    this.listenOnRoot(ROOT_EVENT_NAME_ACCORDION, this.handleAccordionEvt);

    if (this.isNav) {
      // Set up handlers
      this.setWindowEvents(true);
      this.handleResize();
    }

    this.$nextTick(function () {
      _this2.emitState();
    }); // Listen for "Sync state" requests from `v-b-toggle`

    this.listenOnRoot(ROOT_ACTION_EVENT_NAME_REQUEST_STATE, function (id) {
      if (id === _this2.safeId()) {
        _this2.$nextTick(_this2.emitSync);
      }
    });
  },
  updated: function updated() {
    // Emit a private event every time this component updates to ensure
    // the toggle button is in sync with the collapse's state
    // It is emitted regardless if the visible state changes
    this.emitSync();
  },

  /* istanbul ignore next */
  deactivated: function deactivated() {
    if (this.isNav) {
      this.setWindowEvents(false);
    }
  },

  /* istanbul ignore next */
  activated: function activated() {
    if (this.isNav) {
      this.setWindowEvents(true);
    }

    this.emitSync();
  },
  beforeDestroy: function beforeDestroy() {
    // Trigger state emit if needed
    this.show = false;

    if (this.isNav && IS_BROWSER) {
      this.setWindowEvents(false);
    }
  },
  methods: {
    setWindowEvents: function setWindowEvents(on) {
      eventOnOff(on, window, 'resize', this.handleResize, EVENT_OPTIONS_NO_CAPTURE);
      eventOnOff(on, window, 'orientationchange', this.handleResize, EVENT_OPTIONS_NO_CAPTURE);
    },
    toggle: function toggle() {
      this.show = !this.show;
    },
    onEnter: function onEnter() {
      this.transitioning = true; // This should be moved out so we can add cancellable events

      this.$emit(EVENT_NAME_SHOW);
    },
    onAfterEnter: function onAfterEnter() {
      this.transitioning = false;
      this.$emit(EVENT_NAME_SHOWN);
    },
    onLeave: function onLeave() {
      this.transitioning = true; // This should be moved out so we can add cancellable events

      this.$emit(EVENT_NAME_HIDE);
    },
    onAfterLeave: function onAfterLeave() {
      this.transitioning = false;
      this.$emit(EVENT_NAME_HIDDEN);
    },
    emitState: function emitState() {
      var show = this.show,
          accordion = this.accordion;
      var id = this.safeId();
      this.$emit(MODEL_EVENT_NAME, show); // Let `v-b-toggle` know the state of this collapse

      this.emitOnRoot(ROOT_EVENT_NAME_STATE, id, show);

      if (accordion && show) {
        // Tell the other collapses in this accordion to close
        this.emitOnRoot(ROOT_EVENT_NAME_ACCORDION, id, accordion);
      }
    },
    emitSync: function emitSync() {
      // Emit a private event every time this component updates to ensure
      // the toggle button is in sync with the collapse's state
      // It is emitted regardless if the visible state changes
      this.emitOnRoot(ROOT_EVENT_NAME_SYNC_STATE, this.safeId(), this.show);
    },
    checkDisplayBlock: function checkDisplayBlock() {
      // Check to see if the collapse has `display: block !important` set
      // We can't set `display: none` directly on `this.$el`, as it would
      // trigger a new transition to start (or cancel a current one)
      var $el = this.$el;
      var restore = hasClass($el, CLASS_NAME_SHOW);
      removeClass($el, CLASS_NAME_SHOW);
      var isBlock = getCS($el).display === 'block';

      if (restore) {
        addClass($el, CLASS_NAME_SHOW);
      }

      return isBlock;
    },
    clickHandler: function clickHandler(event) {
      var el = event.target; // If we are in a nav/navbar, close the collapse when non-disabled link clicked

      /* istanbul ignore next: can't test `getComputedStyle()` in JSDOM */

      if (!this.isNav || !el || getCS(this.$el).display !== 'block') {
        return;
      } // Only close the collapse if it is not forced to be `display: block !important`


      if ((matches(el, '.nav-link,.dropdown-item') || closest('.nav-link,.dropdown-item', el)) && !this.checkDisplayBlock()) {
        this.show = false;
      }
    },
    handleToggleEvt: function handleToggleEvt(id) {
      if (id === this.safeId()) {
        this.toggle();
      }
    },
    handleAccordionEvt: function handleAccordionEvt(openedId, openAccordion) {
      var accordion = this.accordion,
          show = this.show;

      if (!accordion || accordion !== openAccordion) {
        return;
      }

      var isThis = openedId === this.safeId(); // Open this collapse if not shown or
      // close this collapse if shown

      if (isThis && !show || !isThis && show) {
        this.toggle();
      }
    },
    handleResize: function handleResize() {
      // Handler for orientation/resize to set collapsed state in nav/navbar
      this.show = getCS(this.$el).display === 'block';
    }
  },
  render: function render(h) {
    var appear = this.appear;
    var $content = h(this.tag, {
      class: this.classObject,
      directives: [{
        name: 'show',
        value: this.show
      }],
      attrs: {
        id: this.safeId()
      },
      on: {
        click: this.clickHandler
      }
    }, this.normalizeSlot(SLOT_NAME_DEFAULT, this.slotScope));
    return h(BVCollapse, {
      props: {
        appear: appear
      },
      on: {
        enter: this.onEnter,
        afterEnter: this.onAfterEnter,
        leave: this.onLeave,
        afterLeave: this.onAfterLeave
      }
    }, [$content]);
  }
});