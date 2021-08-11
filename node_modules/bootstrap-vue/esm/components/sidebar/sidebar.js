var _watch;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_COLLAPSE, NAME_SIDEBAR } from '../../constants/components';
import { IS_BROWSER } from '../../constants/env';
import { EVENT_NAME_CHANGE, EVENT_NAME_HIDDEN, EVENT_NAME_SHOWN } from '../../constants/events';
import { CODE_ESC } from '../../constants/key-codes';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_BOOLEAN_STRING, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_DEFAULT, SLOT_NAME_FOOTER, SLOT_NAME_HEADER, SLOT_NAME_HEADER_CLOSE, SLOT_NAME_TITLE } from '../../constants/slots';
import { attemptFocus, contains, getActiveElement, getTabables } from '../../utils/dom';
import { getRootActionEventName, getRootEventName } from '../../utils/events';
import { makeModelMixin } from '../../utils/model';
import { sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { attrsMixin } from '../../mixins/attrs';
import { idMixin, props as idProps } from '../../mixins/id';
import { listenOnRootMixin } from '../../mixins/listen-on-root';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BIconX } from '../../icons/icons';
import { BButtonClose } from '../button/button-close';
import { BVTransition } from '../transition/bv-transition'; // --- Constants ---

var CLASS_NAME = 'b-sidebar';
var ROOT_ACTION_EVENT_NAME_REQUEST_STATE = getRootActionEventName(NAME_COLLAPSE, 'request-state');
var ROOT_ACTION_EVENT_NAME_TOGGLE = getRootActionEventName(NAME_COLLAPSE, 'toggle');
var ROOT_EVENT_NAME_STATE = getRootEventName(NAME_COLLAPSE, 'state');
var ROOT_EVENT_NAME_SYNC_STATE = getRootEventName(NAME_COLLAPSE, 'sync-state');

var _makeModelMixin = makeModelMixin('visible', {
  type: PROP_TYPE_BOOLEAN,
  defaultValue: false,
  event: EVENT_NAME_CHANGE
}),
    modelMixin = _makeModelMixin.mixin,
    modelProps = _makeModelMixin.props,
    MODEL_PROP_NAME = _makeModelMixin.prop,
    MODEL_EVENT_NAME = _makeModelMixin.event; // --- Props ---


export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread({}, idProps), modelProps), {}, {
  ariaLabel: makeProp(PROP_TYPE_STRING),
  ariaLabelledby: makeProp(PROP_TYPE_STRING),
  // If `true`, shows a basic backdrop
  backdrop: makeProp(PROP_TYPE_BOOLEAN, false),
  backdropVariant: makeProp(PROP_TYPE_STRING, 'dark'),
  bgVariant: makeProp(PROP_TYPE_STRING, 'light'),
  bodyClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  // `aria-label` for close button
  closeLabel: makeProp(PROP_TYPE_STRING),
  footerClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  headerClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  lazy: makeProp(PROP_TYPE_BOOLEAN, false),
  noCloseOnBackdrop: makeProp(PROP_TYPE_BOOLEAN, false),
  noCloseOnEsc: makeProp(PROP_TYPE_BOOLEAN, false),
  noCloseOnRouteChange: makeProp(PROP_TYPE_BOOLEAN, false),
  noEnforceFocus: makeProp(PROP_TYPE_BOOLEAN, false),
  noHeader: makeProp(PROP_TYPE_BOOLEAN, false),
  noHeaderClose: makeProp(PROP_TYPE_BOOLEAN, false),
  noSlide: makeProp(PROP_TYPE_BOOLEAN, false),
  right: makeProp(PROP_TYPE_BOOLEAN, false),
  shadow: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
  sidebarClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  tag: makeProp(PROP_TYPE_STRING, 'div'),
  textVariant: makeProp(PROP_TYPE_STRING, 'dark'),
  title: makeProp(PROP_TYPE_STRING),
  width: makeProp(PROP_TYPE_STRING),
  zIndex: makeProp(PROP_TYPE_NUMBER_STRING)
})), NAME_SIDEBAR); // --- Render methods ---

var renderHeaderTitle = function renderHeaderTitle(h, ctx) {
  // Render a empty `<span>` when to title was provided
  var title = ctx.normalizeSlot(SLOT_NAME_TITLE, ctx.slotScope) || ctx.title;

  if (!title) {
    return h('span');
  }

  return h('strong', {
    attrs: {
      id: ctx.safeId('__title__')
    }
  }, [title]);
};

var renderHeaderClose = function renderHeaderClose(h, ctx) {
  if (ctx.noHeaderClose) {
    return h();
  }

  var closeLabel = ctx.closeLabel,
      textVariant = ctx.textVariant,
      hide = ctx.hide;
  return h(BButtonClose, {
    props: {
      ariaLabel: closeLabel,
      textVariant: textVariant
    },
    on: {
      click: hide
    },
    ref: 'close-button'
  }, [ctx.normalizeSlot(SLOT_NAME_HEADER_CLOSE) || h(BIconX)]);
};

var renderHeader = function renderHeader(h, ctx) {
  if (ctx.noHeader) {
    return h();
  }

  var $content = ctx.normalizeSlot(SLOT_NAME_HEADER, ctx.slotScope);

  if (!$content) {
    var $title = renderHeaderTitle(h, ctx);
    var $close = renderHeaderClose(h, ctx);
    $content = ctx.right ? [$close, $title] : [$title, $close];
  }

  return h('header', {
    staticClass: "".concat(CLASS_NAME, "-header"),
    class: ctx.headerClass,
    key: 'header'
  }, $content);
};

var renderBody = function renderBody(h, ctx) {
  return h('div', {
    staticClass: "".concat(CLASS_NAME, "-body"),
    class: ctx.bodyClass,
    key: 'body'
  }, [ctx.normalizeSlot(SLOT_NAME_DEFAULT, ctx.slotScope)]);
};

var renderFooter = function renderFooter(h, ctx) {
  var $footer = ctx.normalizeSlot(SLOT_NAME_FOOTER, ctx.slotScope);

  if (!$footer) {
    return h();
  }

  return h('footer', {
    staticClass: "".concat(CLASS_NAME, "-footer"),
    class: ctx.footerClass,
    key: 'footer'
  }, [$footer]);
};

var renderContent = function renderContent(h, ctx) {
  // We render the header even if `lazy` is enabled as it
  // acts as the accessible label for the sidebar
  var $header = renderHeader(h, ctx);

  if (ctx.lazy && !ctx.isOpen) {
    return $header;
  }

  return [$header, renderBody(h, ctx), renderFooter(h, ctx)];
};

var renderBackdrop = function renderBackdrop(h, ctx) {
  if (!ctx.backdrop) {
    return h();
  }

  var backdropVariant = ctx.backdropVariant;
  return h('div', {
    directives: [{
      name: 'show',
      value: ctx.localShow
    }],
    staticClass: 'b-sidebar-backdrop',
    class: _defineProperty({}, "bg-".concat(backdropVariant), backdropVariant),
    on: {
      click: ctx.onBackdropClick
    }
  });
}; // --- Main component ---
// @vue/component


export var BSidebar = /*#__PURE__*/Vue.extend({
  name: NAME_SIDEBAR,
  mixins: [attrsMixin, idMixin, modelMixin, listenOnRootMixin, normalizeSlotMixin],
  inheritAttrs: false,
  props: props,
  data: function data() {
    var visible = !!this[MODEL_PROP_NAME];
    return {
      // Internal `v-model` state
      localShow: visible,
      // For lazy render triggering
      isOpen: visible
    };
  },
  computed: {
    transitionProps: function transitionProps() {
      return this.noSlide ?
      /* istanbul ignore next */
      {
        css: true
      } : {
        css: true,
        enterClass: '',
        enterActiveClass: 'slide',
        enterToClass: 'show',
        leaveClass: 'show',
        leaveActiveClass: 'slide',
        leaveToClass: ''
      };
    },
    slotScope: function slotScope() {
      var hide = this.hide,
          right = this.right,
          visible = this.localShow;
      return {
        hide: hide,
        right: right,
        visible: visible
      };
    },
    hasTitle: function hasTitle() {
      var $scopedSlots = this.$scopedSlots,
          $slots = this.$slots;
      return !this.noHeader && !this.hasNormalizedSlot(SLOT_NAME_HEADER) && !!(this.normalizeSlot(SLOT_NAME_TITLE, this.slotScope, $scopedSlots, $slots) || this.title);
    },
    titleId: function titleId() {
      return this.hasTitle ? this.safeId('__title__') : null;
    },
    computedAttrs: function computedAttrs() {
      return _objectSpread(_objectSpread({}, this.bvAttrs), {}, {
        id: this.safeId(),
        tabindex: '-1',
        role: 'dialog',
        'aria-modal': this.backdrop ? 'true' : 'false',
        'aria-hidden': this.localShow ? null : 'true',
        'aria-label': this.ariaLabel || null,
        'aria-labelledby': this.ariaLabelledby || this.titleId || null
      });
    }
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME, function (newValue, oldValue) {
    if (newValue !== oldValue) {
      this.localShow = newValue;
    }
  }), _defineProperty(_watch, "localShow", function localShow(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.emitState(newValue);
      this.$emit(MODEL_EVENT_NAME, newValue);
    }
  }), _defineProperty(_watch, "$route", function $route() {
    var newValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oldValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!this.noCloseOnRouteChange && newValue.fullPath !== oldValue.fullPath) {
      this.hide();
    }
  }), _watch),
  created: function created() {
    // Define non-reactive properties
    this.$_returnFocusEl = null;
  },
  mounted: function mounted() {
    var _this = this;

    // Add `$root` listeners
    this.listenOnRoot(ROOT_ACTION_EVENT_NAME_TOGGLE, this.handleToggle);
    this.listenOnRoot(ROOT_ACTION_EVENT_NAME_REQUEST_STATE, this.handleSync); // Send out a gratuitous state event to ensure toggle button is synced

    this.$nextTick(function () {
      _this.emitState(_this.localShow);
    });
  },

  /* istanbul ignore next */
  activated: function activated() {
    this.emitSync();
  },
  beforeDestroy: function beforeDestroy() {
    this.localShow = false;
    this.$_returnFocusEl = null;
  },
  methods: {
    hide: function hide() {
      this.localShow = false;
    },
    emitState: function emitState() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.localShow;
      this.emitOnRoot(ROOT_EVENT_NAME_STATE, this.safeId(), state);
    },
    emitSync: function emitSync() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.localShow;
      this.emitOnRoot(ROOT_EVENT_NAME_SYNC_STATE, this.safeId(), state);
    },
    handleToggle: function handleToggle(id) {
      // Note `safeId()` can be null until after mount
      if (id && id === this.safeId()) {
        this.localShow = !this.localShow;
      }
    },
    handleSync: function handleSync(id) {
      var _this2 = this;

      // Note `safeId()` can be null until after mount
      if (id && id === this.safeId()) {
        this.$nextTick(function () {
          _this2.emitSync(_this2.localShow);
        });
      }
    },
    onKeydown: function onKeydown(event) {
      var keyCode = event.keyCode;

      if (!this.noCloseOnEsc && keyCode === CODE_ESC && this.localShow) {
        this.hide();
      }
    },
    onBackdropClick: function onBackdropClick() {
      if (this.localShow && !this.noCloseOnBackdrop) {
        this.hide();
      }
    },

    /* istanbul ignore next */
    onTopTrapFocus: function onTopTrapFocus() {
      var tabables = getTabables(this.$refs.content);
      this.enforceFocus(tabables.reverse()[0]);
    },

    /* istanbul ignore next */
    onBottomTrapFocus: function onBottomTrapFocus() {
      var tabables = getTabables(this.$refs.content);
      this.enforceFocus(tabables[0]);
    },
    onBeforeEnter: function onBeforeEnter() {
      // Returning focus to `document.body` may cause unwanted scrolls,
      // so we exclude setting focus on body
      this.$_returnFocusEl = getActiveElement(IS_BROWSER ? [document.body] : []); // Trigger lazy render

      this.isOpen = true;
    },
    onAfterEnter: function onAfterEnter(el) {
      if (!contains(el, getActiveElement())) {
        this.enforceFocus(el);
      }

      this.$emit(EVENT_NAME_SHOWN);
    },
    onAfterLeave: function onAfterLeave() {
      this.enforceFocus(this.$_returnFocusEl);
      this.$_returnFocusEl = null; // Trigger lazy render

      this.isOpen = false;
      this.$emit(EVENT_NAME_HIDDEN);
    },
    enforceFocus: function enforceFocus(el) {
      if (!this.noEnforceFocus) {
        attemptFocus(el);
      }
    }
  },
  render: function render(h) {
    var _ref;

    var bgVariant = this.bgVariant,
        width = this.width,
        textVariant = this.textVariant,
        localShow = this.localShow;
    var shadow = this.shadow === '' ? true : this.shadow;
    var $sidebar = h(this.tag, {
      staticClass: CLASS_NAME,
      class: [(_ref = {
        shadow: shadow === true
      }, _defineProperty(_ref, "shadow-".concat(shadow), shadow && shadow !== true), _defineProperty(_ref, "".concat(CLASS_NAME, "-right"), this.right), _defineProperty(_ref, "bg-".concat(bgVariant), bgVariant), _defineProperty(_ref, "text-".concat(textVariant), textVariant), _ref), this.sidebarClass],
      style: {
        width: width
      },
      attrs: this.computedAttrs,
      directives: [{
        name: 'show',
        value: localShow
      }],
      ref: 'content'
    }, [renderContent(h, this)]);
    $sidebar = h('transition', {
      props: this.transitionProps,
      on: {
        beforeEnter: this.onBeforeEnter,
        afterEnter: this.onAfterEnter,
        afterLeave: this.onAfterLeave
      }
    }, [$sidebar]);
    var $backdrop = h(BVTransition, {
      props: {
        noFade: this.noSlide
      }
    }, [renderBackdrop(h, this)]);
    var $tabTrapTop = h();
    var $tabTrapBottom = h();

    if (this.backdrop && localShow) {
      $tabTrapTop = h('div', {
        attrs: {
          tabindex: '0'
        },
        on: {
          focus: this.onTopTrapFocus
        }
      });
      $tabTrapBottom = h('div', {
        attrs: {
          tabindex: '0'
        },
        on: {
          focus: this.onBottomTrapFocus
        }
      });
    }

    return h('div', {
      staticClass: 'b-sidebar-outer',
      style: {
        zIndex: this.zIndex
      },
      attrs: {
        tabindex: '-1'
      },
      on: {
        keydown: this.onKeydown
      }
    }, [$tabTrapTop, $sidebar, $tabTrapBottom, $backdrop]);
  }
});