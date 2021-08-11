import { Vue } from '../vue';
import { IS_BROWSER } from '../constants/env';
import { EVENT_OPTIONS_NO_CAPTURE, HOOK_EVENT_NAME_BEFORE_DESTROY } from '../constants/events';
import { arrayIncludes } from '../utils/array';
import { eventOn, eventOff } from '../utils/events';
import { isString, isFunction } from '../utils/inspect';
import { keys } from '../utils/object'; // --- Constants ---

var PROP = '$_bv_documentHandlers_'; // --- Mixin ---
// @vue/component

export var listenOnDocumentMixin = Vue.extend({
  created: function created() {
    var _this = this;

    /* istanbul ignore next */
    if (!IS_BROWSER) {
      return;
    } // Declare non-reactive property
    // Object of arrays, keyed by event name,
    // where value is an array of handlers
    // Prop will be defined on client only


    this[PROP] = {}; // Set up our beforeDestroy handler (client only)

    this.$once(HOOK_EVENT_NAME_BEFORE_DESTROY, function () {
      var items = _this[PROP] || {}; // Immediately delete this[PROP] to prevent the
      // listenOn/Off methods from running (which may occur
      // due to requestAnimationFrame/transition delays)

      delete _this[PROP]; // Remove all registered event handlers

      keys(items).forEach(function (eventName) {
        var handlers = items[eventName] || [];
        handlers.forEach(function (handler) {
          return eventOff(document, eventName, handler, EVENT_OPTIONS_NO_CAPTURE);
        });
      });
    });
  },
  methods: {
    listenDocument: function listenDocument(on, eventName, handler) {
      on ? this.listenOnDocument(eventName, handler) : this.listenOffDocument(eventName, handler);
    },
    listenOnDocument: function listenOnDocument(eventName, handler) {
      if (this[PROP] && isString(eventName) && isFunction(handler)) {
        this[PROP][eventName] = this[PROP][eventName] || [];

        if (!arrayIncludes(this[PROP][eventName], handler)) {
          this[PROP][eventName].push(handler);
          eventOn(document, eventName, handler, EVENT_OPTIONS_NO_CAPTURE);
        }
      }
    },
    listenOffDocument: function listenOffDocument(eventName, handler) {
      if (this[PROP] && isString(eventName) && isFunction(handler)) {
        eventOff(document, eventName, handler, EVENT_OPTIONS_NO_CAPTURE);
        this[PROP][eventName] = (this[PROP][eventName] || []).filter(function (h) {
          return h !== handler;
        });
      }
    }
  }
});