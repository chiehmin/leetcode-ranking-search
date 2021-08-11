function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
 * ScrollSpy class definition
 */
import { EVENT_OPTIONS_NO_CAPTURE } from '../../../constants/events';
import { RX_HREF } from '../../../constants/regex';
import { addClass, closest, getAttr, getBCR, hasClass, isElement, isVisible, matches, offset, position, removeClass, select, selectAll } from '../../../utils/dom';
import { getRootEventName, eventOn, eventOff } from '../../../utils/events';
import { identity } from '../../../utils/identity';
import { isString, isUndefined } from '../../../utils/inspect';
import { mathMax } from '../../../utils/math';
import { toInteger } from '../../../utils/number';
import { hasOwnProperty, toString as objectToString } from '../../../utils/object';
import { observeDom } from '../../../utils/observe-dom';
import { warn } from '../../../utils/warn';
/*
 * Constants / Defaults
 */

var NAME = 'v-b-scrollspy';
var CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
var CLASS_NAME_ACTIVE = 'active';
var SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
var SELECTOR_NAV_LINKS = '.nav-link';
var SELECTOR_NAV_ITEMS = '.nav-item';
var SELECTOR_LIST_ITEMS = '.list-group-item';
var SELECTOR_DROPDOWN = '.dropdown, .dropup';
var SELECTOR_DROPDOWN_ITEMS = '.dropdown-item';
var SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
var ROOT_EVENT_NAME_ACTIVATE = getRootEventName('BVScrollspy', 'activate');
var METHOD_OFFSET = 'offset';
var METHOD_POSITION = 'position';
var Default = {
  element: 'body',
  offset: 10,
  method: 'auto',
  throttle: 75
};
var DefaultType = {
  element: '(string|element|component)',
  offset: 'number',
  method: 'string',
  throttle: 'number'
}; // Transition Events

var TransitionEndEvents = ['webkitTransitionEnd', 'transitionend', 'otransitionend', 'oTransitionEnd'];
/*
 * Utility Methods
 */
// Better var type detection

var toType = function toType(obj)
/* istanbul ignore next: not easy to test */
{
  return objectToString(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}; // Check config properties for expected types

/* istanbul ignore next */


var typeCheckConfig = function typeCheckConfig(componentName, config, configTypes)
/* istanbul ignore next: not easy to test */
{
  for (var property in configTypes) {
    if (hasOwnProperty(configTypes, property)) {
      var expectedTypes = configTypes[property];
      var value = config[property];
      var valueType = value && isElement(value) ? 'element' : toType(value); // handle Vue instances

      valueType = value && value._isVue ? 'component' : valueType;

      if (!new RegExp(expectedTypes).test(valueType)) {
        /* istanbul ignore next */
        warn("".concat(componentName, ": Option \"").concat(property, "\" provided type \"").concat(valueType, "\" but expected type \"").concat(expectedTypes, "\""));
      }
    }
  }
};
/*
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

/* istanbul ignore next: not easy to test */


export var BVScrollSpy
/* istanbul ignore next: not easy to test */
= /*#__PURE__*/function () {
  function BVScrollSpy(element, config, $root) {
    _classCallCheck(this, BVScrollSpy);

    // The element we activate links in
    this.$el = element;
    this.$scroller = null;
    this.$selector = [SELECTOR_NAV_LINKS, SELECTOR_LIST_ITEMS, SELECTOR_DROPDOWN_ITEMS].join(',');
    this.$offsets = [];
    this.$targets = [];
    this.$activeTarget = null;
    this.$scrollHeight = 0;
    this.$resizeTimeout = null;
    this.$scrollerObserver = null;
    this.$targetsObserver = null;
    this.$root = $root || null;
    this.$config = null;
    this.updateConfig(config);
  }

  _createClass(BVScrollSpy, [{
    key: "updateConfig",
    value: function updateConfig(config, $root) {
      if (this.$scroller) {
        // Just in case out scroll element has changed
        this.unlisten();
        this.$scroller = null;
      }

      var cfg = _objectSpread(_objectSpread({}, this.constructor.Default), config);

      if ($root) {
        this.$root = $root;
      }

      typeCheckConfig(this.constructor.Name, cfg, this.constructor.DefaultType);
      this.$config = cfg;

      if (this.$root) {
        var self = this;
        this.$root.$nextTick(function () {
          self.listen();
        });
      } else {
        this.listen();
      }
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.unlisten();
      clearTimeout(this.$resizeTimeout);
      this.$resizeTimeout = null;
      this.$el = null;
      this.$config = null;
      this.$scroller = null;
      this.$selector = null;
      this.$offsets = null;
      this.$targets = null;
      this.$activeTarget = null;
      this.$scrollHeight = null;
    }
  }, {
    key: "listen",
    value: function listen() {
      var _this = this;

      var scroller = this.getScroller();

      if (scroller && scroller.tagName !== 'BODY') {
        eventOn(scroller, 'scroll', this, EVENT_OPTIONS_NO_CAPTURE);
      }

      eventOn(window, 'scroll', this, EVENT_OPTIONS_NO_CAPTURE);
      eventOn(window, 'resize', this, EVENT_OPTIONS_NO_CAPTURE);
      eventOn(window, 'orientationchange', this, EVENT_OPTIONS_NO_CAPTURE);
      TransitionEndEvents.forEach(function (eventName) {
        eventOn(window, eventName, _this, EVENT_OPTIONS_NO_CAPTURE);
      });
      this.setObservers(true); // Schedule a refresh

      this.handleEvent('refresh');
    }
  }, {
    key: "unlisten",
    value: function unlisten() {
      var _this2 = this;

      var scroller = this.getScroller();
      this.setObservers(false);

      if (scroller && scroller.tagName !== 'BODY') {
        eventOff(scroller, 'scroll', this, EVENT_OPTIONS_NO_CAPTURE);
      }

      eventOff(window, 'scroll', this, EVENT_OPTIONS_NO_CAPTURE);
      eventOff(window, 'resize', this, EVENT_OPTIONS_NO_CAPTURE);
      eventOff(window, 'orientationchange', this, EVENT_OPTIONS_NO_CAPTURE);
      TransitionEndEvents.forEach(function (eventName) {
        eventOff(window, eventName, _this2, EVENT_OPTIONS_NO_CAPTURE);
      });
    }
  }, {
    key: "setObservers",
    value: function setObservers(on) {
      var _this3 = this;

      // We observe both the scroller for content changes, and the target links
      this.$scrollerObserver && this.$scrollerObserver.disconnect();
      this.$targetsObserver && this.$targetsObserver.disconnect();
      this.$scrollerObserver = null;
      this.$targetsObserver = null;

      if (on) {
        this.$targetsObserver = observeDom(this.$el, function () {
          _this3.handleEvent('mutation');
        }, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ['href']
        });
        this.$scrollerObserver = observeDom(this.getScroller(), function () {
          _this3.handleEvent('mutation');
        }, {
          subtree: true,
          childList: true,
          characterData: true,
          attributes: true,
          attributeFilter: ['id', 'style', 'class']
        });
      }
    } // General event handler

  }, {
    key: "handleEvent",
    value: function handleEvent(event) {
      var type = isString(event) ? event : event.type;
      var self = this;

      var resizeThrottle = function resizeThrottle() {
        if (!self.$resizeTimeout) {
          self.$resizeTimeout = setTimeout(function () {
            self.refresh();
            self.process();
            self.$resizeTimeout = null;
          }, self.$config.throttle);
        }
      };

      if (type === 'scroll') {
        if (!this.$scrollerObserver) {
          // Just in case we are added to the DOM before the scroll target is
          // We re-instantiate our listeners, just in case
          this.listen();
        }

        this.process();
      } else if (/(resize|orientationchange|mutation|refresh)/.test(type)) {
        // Postpone these events by throttle time
        resizeThrottle();
      }
    } // Refresh the list of target links on the element we are applied to

  }, {
    key: "refresh",
    value: function refresh() {
      var _this4 = this;

      var scroller = this.getScroller();

      if (!scroller) {
        return;
      }

      var autoMethod = scroller !== scroller.window ? METHOD_POSITION : METHOD_OFFSET;
      var method = this.$config.method === 'auto' ? autoMethod : this.$config.method;
      var methodFn = method === METHOD_POSITION ? position : offset;
      var offsetBase = method === METHOD_POSITION ? this.getScrollTop() : 0;
      this.$offsets = [];
      this.$targets = [];
      this.$scrollHeight = this.getScrollHeight(); // Find all the unique link HREFs that we will control

      selectAll(this.$selector, this.$el) // Get HREF value
      .map(function (link) {
        return getAttr(link, 'href');
      }) // Filter out HREFs that do not match our RegExp
      .filter(function (href) {
        return href && RX_HREF.test(href || '');
      }) // Find all elements with ID that match HREF hash
      .map(function (href) {
        // Convert HREF into an ID (including # at beginning)
        var id = href.replace(RX_HREF, '$1').trim();

        if (!id) {
          return null;
        } // Find the element with the ID specified by id


        var el = select(id, scroller);

        if (el && isVisible(el)) {
          return {
            offset: toInteger(methodFn(el).top, 0) + offsetBase,
            target: id
          };
        }

        return null;
      }).filter(identity) // Sort them by their offsets (smallest first)
      .sort(function (a, b) {
        return a.offset - b.offset;
      }) // record only unique targets/offsets
      .reduce(function (memo, item) {
        if (!memo[item.target]) {
          _this4.$offsets.push(item.offset);

          _this4.$targets.push(item.target);

          memo[item.target] = true;
        }

        return memo;
      }, {}); // Return this for easy chaining

      return this;
    } // Handle activating/clearing

  }, {
    key: "process",
    value: function process() {
      var scrollTop = this.getScrollTop() + this.$config.offset;
      var scrollHeight = this.getScrollHeight();
      var maxScroll = this.$config.offset + scrollHeight - this.getOffsetHeight();

      if (this.$scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        var target = this.$targets[this.$targets.length - 1];

        if (this.$activeTarget !== target) {
          this.activate(target);
        }

        return;
      }

      if (this.$activeTarget && scrollTop < this.$offsets[0] && this.$offsets[0] > 0) {
        this.$activeTarget = null;
        this.clear();
        return;
      }

      for (var i = this.$offsets.length; i--;) {
        var isActiveTarget = this.$activeTarget !== this.$targets[i] && scrollTop >= this.$offsets[i] && (isUndefined(this.$offsets[i + 1]) || scrollTop < this.$offsets[i + 1]);

        if (isActiveTarget) {
          this.activate(this.$targets[i]);
        }
      }
    }
  }, {
    key: "getScroller",
    value: function getScroller() {
      if (this.$scroller) {
        return this.$scroller;
      }

      var scroller = this.$config.element;

      if (!scroller) {
        return null;
      } else if (isElement(scroller.$el)) {
        scroller = scroller.$el;
      } else if (isString(scroller)) {
        scroller = select(scroller);
      }

      if (!scroller) {
        return null;
      }

      this.$scroller = scroller.tagName === 'BODY' ? window : scroller;
      return this.$scroller;
    }
  }, {
    key: "getScrollTop",
    value: function getScrollTop() {
      var scroller = this.getScroller();
      return scroller === window ? scroller.pageYOffset : scroller.scrollTop;
    }
  }, {
    key: "getScrollHeight",
    value: function getScrollHeight() {
      return this.getScroller().scrollHeight || mathMax(document.body.scrollHeight, document.documentElement.scrollHeight);
    }
  }, {
    key: "getOffsetHeight",
    value: function getOffsetHeight() {
      var scroller = this.getScroller();
      return scroller === window ? window.innerHeight : getBCR(scroller).height;
    }
  }, {
    key: "activate",
    value: function activate(target) {
      var _this5 = this;

      this.$activeTarget = target;
      this.clear(); // Grab the list of target links (<a href="{$target}">)

      var links = selectAll(this.$selector // Split out the base selectors
      .split(',') // Map to a selector that matches links with HREF ending in the ID (including '#')
      .map(function (selector) {
        return "".concat(selector, "[href$=\"").concat(target, "\"]");
      }) // Join back into a single selector string
      .join(','), this.$el);
      links.forEach(function (link) {
        if (hasClass(link, CLASS_NAME_DROPDOWN_ITEM)) {
          // This is a dropdown item, so find the .dropdown-toggle and set its state
          var dropdown = closest(SELECTOR_DROPDOWN, link);

          if (dropdown) {
            _this5.setActiveState(select(SELECTOR_DROPDOWN_TOGGLE, dropdown), true);
          } // Also set this link's state


          _this5.setActiveState(link, true);
        } else {
          // Set triggered link as active
          _this5.setActiveState(link, true);

          if (matches(link.parentElement, SELECTOR_NAV_ITEMS)) {
            // Handle nav-link inside nav-item, and set nav-item active
            _this5.setActiveState(link.parentElement, true);
          } // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor


          var el = link;

          while (el) {
            el = closest(SELECTOR_NAV_LIST_GROUP, el);
            var sibling = el ? el.previousElementSibling : null;

            if (sibling && matches(sibling, "".concat(SELECTOR_NAV_LINKS, ", ").concat(SELECTOR_LIST_ITEMS))) {
              _this5.setActiveState(sibling, true);
            } // Handle special case where nav-link is inside a nav-item


            if (sibling && matches(sibling, SELECTOR_NAV_ITEMS)) {
              _this5.setActiveState(select(SELECTOR_NAV_LINKS, sibling), true); // Add active state to nav-item as well


              _this5.setActiveState(sibling, true);
            }
          }
        }
      }); // Signal event to via $root, passing ID of activated target and reference to array of links

      if (links && links.length > 0 && this.$root) {
        this.$root.$emit(ROOT_EVENT_NAME_ACTIVATE, target, links);
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      var _this6 = this;

      selectAll("".concat(this.$selector, ", ").concat(SELECTOR_NAV_ITEMS), this.$el).filter(function (el) {
        return hasClass(el, CLASS_NAME_ACTIVE);
      }).forEach(function (el) {
        return _this6.setActiveState(el, false);
      });
    }
  }, {
    key: "setActiveState",
    value: function setActiveState(el, active) {
      if (!el) {
        return;
      }

      if (active) {
        addClass(el, CLASS_NAME_ACTIVE);
      } else {
        removeClass(el, CLASS_NAME_ACTIVE);
      }
    }
  }], [{
    key: "Name",
    get: function get() {
      return NAME;
    }
  }, {
    key: "Default",
    get: function get() {
      return Default;
    }
  }, {
    key: "DefaultType",
    get: function get() {
      return DefaultType;
    }
  }]);

  return BVScrollSpy;
}();