import { Vue } from '../vue';
import { IS_BROWSER } from '../constants/env';
import { EVENT_OPTIONS_NO_CAPTURE } from '../constants/events';
import { arrayIncludes } from '../utils/array';
import { eventOn, eventOff } from '../utils/events';
import { isString, isFunction } from '../utils/inspect';
import { keys } from '../utils/object'; // --- Constants ---

var PROP = '$_bv_windowHandlers_'; // --- Mixin ---
// @vue/component

export var listenOnWindowMixin = Vue.extend({
  beforeCreate: function beforeCreate() {
    // Declare non-reactive property
    // Object of arrays, keyed by event name,
    // where value is an array of handlers
    this[PROP] = {};
  },
  beforeDestroy: function beforeDestroy() {
    if (IS_BROWSER) {
      var items = this[PROP]; // Immediately delete this[PROP] to prevent the
      // listenOn/Off methods from running (which may occur
      // due to requestAnimationFrame delays)

      delete this[PROP]; // Remove all registered event handlers

      keys(items).forEach(function (eventName) {
        var handlers = items[eventName] || [];
        handlers.forEach(function (handler) {
          return eventOff(window, eventName, handler, EVENT_OPTIONS_NO_CAPTURE);
        });
      });
    }
  },
  methods: {
    listenWindow: function listenWindow(on, eventName, handler) {
      on ? this.listenOnWindow(eventName, handler) : this.listenOffWindow(eventName, handler);
    },
    listenOnWindow: function listenOnWindow(eventName, handler) {
      if (IS_BROWSER && this[PROP] && isString(eventName) && isFunction(handler)) {
        this[PROP][eventName] = this[PROP][eventName] || [];

        if (!arrayIncludes(this[PROP][eventName], handler)) {
          this[PROP][eventName].push(handler);
          eventOn(window, eventName, handler, EVENT_OPTIONS_NO_CAPTURE);
        }
      }
    },
    listenOffWindow: function listenOffWindow(eventName, handler) {
      if (IS_BROWSER && this[PROP] && isString(eventName) && isFunction(handler)) {
        eventOff(window, eventName, handler, EVENT_OPTIONS_NO_CAPTURE);
        this[PROP][eventName] = (this[PROP][eventName] || []).filter(function (h) {
          return h !== handler;
        });
      }
    }
  }
});