var _watch;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Portal, Wormhole } from 'portal-vue';
import { COMPONENT_UID_KEY, Vue } from '../../vue';
import { NAME_TOAST, NAME_TOASTER } from '../../constants/components';
import { EVENT_NAME_CHANGE, EVENT_NAME_DESTROYED, EVENT_NAME_HIDDEN, EVENT_NAME_HIDE, EVENT_NAME_SHOW, EVENT_NAME_SHOWN, EVENT_OPTIONS_NO_CAPTURE } from '../../constants/events';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_DEFAULT, SLOT_NAME_TOAST_TITLE } from '../../constants/slots';
import { BvEvent } from '../../utils/bv-event.class';
import { requestAF } from '../../utils/dom';
import { getRootActionEventName, getRootEventName, eventOnOff } from '../../utils/events';
import { mathMax } from '../../utils/math';
import { makeModelMixin } from '../../utils/model';
import { toInteger } from '../../utils/number';
import { pick, sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable, pluckProps } from '../../utils/props';
import { isLink } from '../../utils/router';
import { attrsMixin } from '../../mixins/attrs';
import { idMixin, props as idProps } from '../../mixins/id';
import { listenOnRootMixin } from '../../mixins/listen-on-root';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { scopedStyleMixin } from '../../mixins/scoped-style';
import { BButtonClose } from '../button/button-close';
import { BLink, props as BLinkProps } from '../link/link';
import { BVTransition } from '../transition/bv-transition';
import { BToaster } from './toaster'; // --- Constants ---

var _makeModelMixin = makeModelMixin('visible', {
  type: PROP_TYPE_BOOLEAN,
  defaultValue: false,
  event: EVENT_NAME_CHANGE
}),
    modelMixin = _makeModelMixin.mixin,
    modelProps = _makeModelMixin.props,
    MODEL_PROP_NAME = _makeModelMixin.prop,
    MODEL_EVENT_NAME = _makeModelMixin.event;

var MIN_DURATION = 1000; // --- Props ---

var linkProps = pick(BLinkProps, ['href', 'to']);
export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, idProps), modelProps), linkProps), {}, {
  appendToast: makeProp(PROP_TYPE_BOOLEAN, false),
  autoHideDelay: makeProp(PROP_TYPE_NUMBER_STRING, 5000),
  bodyClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  headerClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  // Switches role to 'status' and aria-live to 'polite'
  isStatus: makeProp(PROP_TYPE_BOOLEAN, false),
  noAutoHide: makeProp(PROP_TYPE_BOOLEAN, false),
  noCloseButton: makeProp(PROP_TYPE_BOOLEAN, false),
  noFade: makeProp(PROP_TYPE_BOOLEAN, false),
  noHoverPause: makeProp(PROP_TYPE_BOOLEAN, false),
  solid: makeProp(PROP_TYPE_BOOLEAN, false),
  // Render the toast in place, rather than in a portal-target
  static: makeProp(PROP_TYPE_BOOLEAN, false),
  title: makeProp(PROP_TYPE_STRING),
  toastClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  toaster: makeProp(PROP_TYPE_STRING, 'b-toaster-top-right'),
  variant: makeProp(PROP_TYPE_STRING)
})), NAME_TOAST); // --- Main component ---
// @vue/component

export var BToast = /*#__PURE__*/Vue.extend({
  name: NAME_TOAST,
  mixins: [attrsMixin, idMixin, modelMixin, listenOnRootMixin, normalizeSlotMixin, scopedStyleMixin],
  inheritAttrs: false,
  props: props,
  data: function data() {
    return {
      isMounted: false,
      doRender: false,
      localShow: false,
      isTransitioning: false,
      isHiding: false,
      order: 0,
      dismissStarted: 0,
      resumeDismiss: 0
    };
  },
  computed: {
    toastClasses: function toastClasses() {
      var appendToast = this.appendToast,
          variant = this.variant;
      return _defineProperty({
        'b-toast-solid': this.solid,
        'b-toast-append': appendToast,
        'b-toast-prepend': !appendToast
      }, "b-toast-".concat(variant), variant);
    },
    slotScope: function slotScope() {
      var hide = this.hide;
      return {
        hide: hide
      };
    },
    computedDuration: function computedDuration() {
      // Minimum supported duration is 1 second
      return mathMax(toInteger(this.autoHideDelay, 0), MIN_DURATION);
    },
    computedToaster: function computedToaster() {
      return String(this.toaster);
    },
    transitionHandlers: function transitionHandlers() {
      return {
        beforeEnter: this.onBeforeEnter,
        afterEnter: this.onAfterEnter,
        beforeLeave: this.onBeforeLeave,
        afterLeave: this.onAfterLeave
      };
    },
    computedAttrs: function computedAttrs() {
      return _objectSpread(_objectSpread({}, this.bvAttrs), {}, {
        id: this.safeId(),
        tabindex: '0'
      });
    }
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME, function (newValue) {
    this[newValue ? 'show' : 'hide']();
  }), _defineProperty(_watch, "localShow", function localShow(newValue) {
    if (newValue !== this[MODEL_PROP_NAME]) {
      this.$emit(MODEL_EVENT_NAME, newValue);
    }
  }), _defineProperty(_watch, "toaster", function toaster() {
    // If toaster target changed, make sure toaster exists
    this.$nextTick(this.ensureToaster);
  }), _defineProperty(_watch, "static", function _static(newValue) {
    // If static changes to true, and the toast is showing,
    // ensure the toaster target exists
    if (newValue && this.localShow) {
      this.ensureToaster();
    }
  }), _watch),
  created: function created() {
    // Create private non-reactive props
    this.$_dismissTimer = null;
  },
  mounted: function mounted() {
    var _this = this;

    this.isMounted = true;
    this.$nextTick(function () {
      if (_this[MODEL_PROP_NAME]) {
        requestAF(function () {
          _this.show();
        });
      }
    }); // Listen for global $root show events

    this.listenOnRoot(getRootActionEventName(NAME_TOAST, EVENT_NAME_SHOW), function (id) {
      if (id === _this.safeId()) {
        _this.show();
      }
    }); // Listen for global $root hide events

    this.listenOnRoot(getRootActionEventName(NAME_TOAST, EVENT_NAME_HIDE), function (id) {
      if (!id || id === _this.safeId()) {
        _this.hide();
      }
    }); // Make sure we hide when toaster is destroyed

    /* istanbul ignore next: difficult to test */

    this.listenOnRoot(getRootEventName(NAME_TOASTER, EVENT_NAME_DESTROYED), function (toaster) {
      /* istanbul ignore next */
      if (toaster === _this.computedToaster) {
        _this.hide();
      }
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.clearDismissTimer();
  },
  methods: {
    show: function show() {
      var _this2 = this;

      if (!this.localShow) {
        this.ensureToaster();
        var showEvt = this.buildEvent(EVENT_NAME_SHOW);
        this.emitEvent(showEvt);
        this.dismissStarted = this.resumeDismiss = 0;
        this.order = Date.now() * (this.appendToast ? 1 : -1);
        this.isHiding = false;
        this.doRender = true;
        this.$nextTick(function () {
          // We show the toast after we have rendered the portal and b-toast wrapper
          // so that screen readers will properly announce the toast
          requestAF(function () {
            _this2.localShow = true;
          });
        });
      }
    },
    hide: function hide() {
      var _this3 = this;

      if (this.localShow) {
        var hideEvt = this.buildEvent(EVENT_NAME_HIDE);
        this.emitEvent(hideEvt);
        this.setHoverHandler(false);
        this.dismissStarted = this.resumeDismiss = 0;
        this.clearDismissTimer();
        this.isHiding = true;
        requestAF(function () {
          _this3.localShow = false;
        });
      }
    },
    buildEvent: function buildEvent(type) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return new BvEvent(type, _objectSpread(_objectSpread({
        cancelable: false,
        target: this.$el || null,
        relatedTarget: null
      }, options), {}, {
        vueTarget: this,
        componentId: this.safeId()
      }));
    },
    emitEvent: function emitEvent(bvEvent) {
      var type = bvEvent.type;
      this.emitOnRoot(getRootEventName(NAME_TOAST, type), bvEvent);
      this.$emit(type, bvEvent);
    },
    ensureToaster: function ensureToaster() {
      if (this.static) {
        return;
      }

      var computedToaster = this.computedToaster;

      if (!Wormhole.hasTarget(computedToaster)) {
        var div = document.createElement('div');
        document.body.appendChild(div);
        var toaster = new BToaster({
          parent: this.$root,
          propsData: {
            name: computedToaster
          }
        });
        toaster.$mount(div);
      }
    },
    startDismissTimer: function startDismissTimer() {
      this.clearDismissTimer();

      if (!this.noAutoHide) {
        this.$_dismissTimer = setTimeout(this.hide, this.resumeDismiss || this.computedDuration);
        this.dismissStarted = Date.now();
        this.resumeDismiss = 0;
      }
    },
    clearDismissTimer: function clearDismissTimer() {
      clearTimeout(this.$_dismissTimer);
      this.$_dismissTimer = null;
    },
    setHoverHandler: function setHoverHandler(on) {
      var el = this.$refs['b-toast'];
      eventOnOff(on, el, 'mouseenter', this.onPause, EVENT_OPTIONS_NO_CAPTURE);
      eventOnOff(on, el, 'mouseleave', this.onUnPause, EVENT_OPTIONS_NO_CAPTURE);
    },
    onPause: function onPause() {
      // Determine time remaining, and then pause timer
      if (this.noAutoHide || this.noHoverPause || !this.$_dismissTimer || this.resumeDismiss) {
        return;
      }

      var passed = Date.now() - this.dismissStarted;

      if (passed > 0) {
        this.clearDismissTimer();
        this.resumeDismiss = mathMax(this.computedDuration - passed, MIN_DURATION);
      }
    },
    onUnPause: function onUnPause() {
      // Restart timer with max of time remaining or 1 second
      if (this.noAutoHide || this.noHoverPause || !this.resumeDismiss) {
        this.resumeDismiss = this.dismissStarted = 0;
        return;
      }

      this.startDismissTimer();
    },
    onLinkClick: function onLinkClick() {
      var _this4 = this;

      // We delay the close to allow time for the
      // browser to process the link click
      this.$nextTick(function () {
        requestAF(function () {
          _this4.hide();
        });
      });
    },
    onBeforeEnter: function onBeforeEnter() {
      this.isTransitioning = true;
    },
    onAfterEnter: function onAfterEnter() {
      this.isTransitioning = false;
      var hiddenEvt = this.buildEvent(EVENT_NAME_SHOWN);
      this.emitEvent(hiddenEvt);
      this.startDismissTimer();
      this.setHoverHandler(true);
    },
    onBeforeLeave: function onBeforeLeave() {
      this.isTransitioning = true;
    },
    onAfterLeave: function onAfterLeave() {
      this.isTransitioning = false;
      this.order = 0;
      this.resumeDismiss = this.dismissStarted = 0;
      var hiddenEvt = this.buildEvent(EVENT_NAME_HIDDEN);
      this.emitEvent(hiddenEvt);
      this.doRender = false;
    },
    // Render helper for generating the toast
    makeToast: function makeToast(h) {
      var _this5 = this;

      var title = this.title,
          slotScope = this.slotScope;
      var link = isLink(this);
      var $headerContent = [];
      var $title = this.normalizeSlot(SLOT_NAME_TOAST_TITLE, slotScope);

      if ($title) {
        $headerContent.push($title);
      } else if (title) {
        $headerContent.push(h('strong', {
          staticClass: 'mr-2'
        }, title));
      }

      if (!this.noCloseButton) {
        $headerContent.push(h(BButtonClose, {
          staticClass: 'ml-auto mb-1',
          on: {
            click: function click() {
              _this5.hide();
            }
          }
        }));
      }

      var $header = h();

      if ($headerContent.length > 0) {
        $header = h('header', {
          staticClass: 'toast-header',
          class: this.headerClass
        }, $headerContent);
      }

      var $body = h(link ? BLink : 'div', {
        staticClass: 'toast-body',
        class: this.bodyClass,
        props: link ? pluckProps(linkProps, this) : {},
        on: link ? {
          click: this.onLinkClick
        } : {}
      }, this.normalizeSlot(SLOT_NAME_DEFAULT, slotScope));
      return h('div', {
        staticClass: 'toast',
        class: this.toastClass,
        attrs: this.computedAttrs,
        key: "toast-".concat(this[COMPONENT_UID_KEY]),
        ref: 'toast'
      }, [$header, $body]);
    }
  },
  render: function render(h) {
    if (!this.doRender || !this.isMounted) {
      return h();
    }

    var order = this.order,
        isStatic = this.static,
        isHiding = this.isHiding,
        isStatus = this.isStatus;
    var name = "b-toast-".concat(this[COMPONENT_UID_KEY]);
    var $toast = h('div', {
      staticClass: 'b-toast',
      class: this.toastClasses,
      attrs: _objectSpread(_objectSpread({}, isStatic ? {} : this.scopedStyleAttrs), {}, {
        id: this.safeId('_toast_outer'),
        role: isHiding ? null : isStatus ? 'status' : 'alert',
        'aria-live': isHiding ? null : isStatus ? 'polite' : 'assertive',
        'aria-atomic': isHiding ? null : 'true'
      }),
      key: name,
      ref: 'b-toast'
    }, [h(BVTransition, {
      props: {
        noFade: this.noFade
      },
      on: this.transitionHandlers
    }, [this.localShow ? this.makeToast(h) : h()])]);
    return h(Portal, {
      props: {
        name: name,
        to: this.computedToaster,
        order: order,
        slim: true,
        disabled: isStatic
      }
    }, [$toast]);
  }
});