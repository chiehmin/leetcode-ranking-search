function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_LINK } from '../../constants/components';
import { EVENT_NAME_CLICK } from '../../constants/events';
import { PROP_TYPE_ARRAY_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_OBJECT_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { concat } from '../../utils/array';
import { attemptBlur, attemptFocus, isTag } from '../../utils/dom';
import { getRootEventName, stopEvent } from '../../utils/events';
import { isBoolean, isEvent, isFunction, isUndefined } from '../../utils/inspect';
import { sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable, pluckProps } from '../../utils/props';
import { computeHref, computeRel, computeTag, isRouterLink as _isRouterLink } from '../../utils/router';
import { attrsMixin } from '../../mixins/attrs';
import { listenOnRootMixin } from '../../mixins/listen-on-root';
import { listenersMixin } from '../../mixins/listeners';
import { normalizeSlotMixin } from '../../mixins/normalize-slot'; // --- Constants ---

var ROOT_EVENT_NAME_CLICKED = getRootEventName(NAME_LINK, 'clicked'); // --- Props ---
// `<router-link>` specific props

export var routerLinkProps = {
  activeClass: makeProp(PROP_TYPE_STRING),
  append: makeProp(PROP_TYPE_BOOLEAN, false),
  event: makeProp(PROP_TYPE_ARRAY_STRING, EVENT_NAME_CLICK),
  exact: makeProp(PROP_TYPE_BOOLEAN, false),
  exactActiveClass: makeProp(PROP_TYPE_STRING),
  replace: makeProp(PROP_TYPE_BOOLEAN, false),
  routerTag: makeProp(PROP_TYPE_STRING, 'a'),
  to: makeProp(PROP_TYPE_OBJECT_STRING)
}; // `<nuxt-link>` specific props

export var nuxtLinkProps = {
  noPrefetch: makeProp(PROP_TYPE_BOOLEAN, false),
  // Must be `null` to fall back to the value defined in the
  // `nuxt.config.js` configuration file for `router.prefetchLinks`
  // We convert `null` to `undefined`, so that Nuxt.js will use the
  // compiled default
  // Vue treats `undefined` as default of `false` for Boolean props,
  // so we must set it as `null` here to be a true tri-state prop
  prefetch: makeProp(PROP_TYPE_BOOLEAN, null)
}; // All `<b-link>` props

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread({}, nuxtLinkProps), routerLinkProps), {}, {
  active: makeProp(PROP_TYPE_BOOLEAN, false),
  disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  href: makeProp(PROP_TYPE_STRING),
  // Must be `null` if no value provided
  rel: makeProp(PROP_TYPE_STRING, null),
  // To support 3rd party router links based on `<router-link>` (i.e. `g-link` for Gridsome)
  // Default is to auto choose between `<router-link>` and `<nuxt-link>`
  // Gridsome doesn't provide a mechanism to auto detect and has caveats
  // such as not supporting FQDN URLs or hash only URLs
  routerComponentName: makeProp(PROP_TYPE_STRING),
  target: makeProp(PROP_TYPE_STRING, '_self')
})), NAME_LINK); // --- Main component ---
// @vue/component

export var BLink = /*#__PURE__*/Vue.extend({
  name: NAME_LINK,
  // Mixin order is important!
  mixins: [attrsMixin, listenersMixin, listenOnRootMixin, normalizeSlotMixin],
  inheritAttrs: false,
  props: props,
  computed: {
    computedTag: function computedTag() {
      // We don't pass `this` as the first arg as we need reactivity of the props
      var to = this.to,
          disabled = this.disabled,
          routerComponentName = this.routerComponentName;
      return computeTag({
        to: to,
        disabled: disabled,
        routerComponentName: routerComponentName
      }, this);
    },
    isRouterLink: function isRouterLink() {
      return _isRouterLink(this.computedTag);
    },
    computedRel: function computedRel() {
      // We don't pass `this` as the first arg as we need reactivity of the props
      var target = this.target,
          rel = this.rel;
      return computeRel({
        target: target,
        rel: rel
      });
    },
    computedHref: function computedHref() {
      // We don't pass `this` as the first arg as we need reactivity of the props
      var to = this.to,
          href = this.href;
      return computeHref({
        to: to,
        href: href
      }, this.computedTag);
    },
    computedProps: function computedProps() {
      var prefetch = this.prefetch;
      return this.isRouterLink ? _objectSpread(_objectSpread({}, pluckProps(_objectSpread(_objectSpread({}, routerLinkProps), nuxtLinkProps), this)), {}, {
        // Coerce `prefetch` value `null` to be `undefined`
        prefetch: isBoolean(prefetch) ? prefetch : undefined,
        // Pass `router-tag` as `tag` prop
        tag: this.routerTag
      }) : {};
    },
    computedAttrs: function computedAttrs() {
      var bvAttrs = this.bvAttrs,
          href = this.computedHref,
          rel = this.computedRel,
          disabled = this.disabled,
          target = this.target,
          routerTag = this.routerTag,
          isRouterLink = this.isRouterLink;
      return _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, bvAttrs), href ? {
        href: href
      } : {}), isRouterLink && !isTag(routerTag, 'a') ? {} : {
        rel: rel,
        target: target
      }), {}, {
        tabindex: disabled ? '-1' : isUndefined(bvAttrs.tabindex) ? null : bvAttrs.tabindex,
        'aria-disabled': disabled ? 'true' : null
      });
    },
    computedListeners: function computedListeners() {
      return _objectSpread(_objectSpread({}, this.bvListeners), {}, {
        // We want to overwrite any click handler since our callback
        // will invoke the user supplied handler(s) if `!this.disabled`
        click: this.onClick
      });
    }
  },
  methods: {
    onClick: function onClick(event) {
      var _arguments = arguments;
      var eventIsEvent = isEvent(event);
      var isRouterLink = this.isRouterLink;
      var suppliedHandler = this.bvListeners.click;

      if (eventIsEvent && this.disabled) {
        // Stop event from bubbling up
        // Kill the event loop attached to this specific `EventTarget`
        // Needed to prevent `vue-router` for doing its thing
        stopEvent(event, {
          immediatePropagation: true
        });
      } else {
        /* istanbul ignore next: difficult to test, but we know it works */
        if (isRouterLink && event.currentTarget.__vue__) {
          // Router links do not emit instance `click` events, so we
          // add in an `$emit('click', event)` on its Vue instance
          event.currentTarget.__vue__.$emit(EVENT_NAME_CLICK, event);
        } // Call the suppliedHandler(s), if any provided


        concat(suppliedHandler).filter(function (h) {
          return isFunction(h);
        }).forEach(function (handler) {
          handler.apply(void 0, _toConsumableArray(_arguments));
        }); // Emit the global `$root` click event

        this.emitOnRoot(ROOT_EVENT_NAME_CLICKED, event); // TODO: Remove deprecated 'clicked::link' event with next major release

        this.emitOnRoot('clicked::link', event);
      } // Stop scroll-to-top behavior or navigation on
      // regular links when href is just '#'


      if (eventIsEvent && !isRouterLink && this.computedHref === '#') {
        stopEvent(event, {
          propagation: false
        });
      }
    },
    focus: function focus() {
      attemptFocus(this.$el);
    },
    blur: function blur() {
      attemptBlur(this.$el);
    }
  },
  render: function render(h) {
    var active = this.active,
        disabled = this.disabled;
    return h(this.computedTag, _defineProperty({
      class: {
        active: active,
        disabled: disabled
      },
      attrs: this.computedAttrs,
      props: this.computedProps
    }, this.isRouterLink ? 'nativeOn' : 'on', this.computedListeners), this.normalizeSlot());
  }
});