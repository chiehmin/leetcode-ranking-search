// v-b-hover directive
import { IS_BROWSER } from '../../constants/env';
import { EVENT_OPTIONS_NO_CAPTURE } from '../../constants/events';
import { eventOnOff } from '../../utils/events';
import { isFunction } from '../../utils/inspect'; // --- Constants ---

var PROP = '__BV_hover_handler__';
var MOUSEENTER = 'mouseenter';
var MOUSELEAVE = 'mouseleave'; // --- Helper methods ---

var createListener = function createListener(handler) {
  var listener = function listener(event) {
    handler(event.type === MOUSEENTER, event);
  };

  listener.fn = handler;
  return listener;
};

var updateListeners = function updateListeners(on, el, listener) {
  eventOnOff(on, el, MOUSEENTER, listener, EVENT_OPTIONS_NO_CAPTURE);
  eventOnOff(on, el, MOUSELEAVE, listener, EVENT_OPTIONS_NO_CAPTURE);
}; // --- Directive bind/unbind/update handler ---


var directive = function directive(el, _ref) {
  var _ref$value = _ref.value,
      handler = _ref$value === void 0 ? null : _ref$value;

  if (IS_BROWSER) {
    var listener = el[PROP];
    var hasListener = isFunction(listener);
    var handlerChanged = !(hasListener && listener.fn === handler);

    if (hasListener && handlerChanged) {
      updateListeners(false, el, listener);
      delete el[PROP];
    }

    if (isFunction(handler) && handlerChanged) {
      el[PROP] = createListener(handler);
      updateListeners(true, el, el[PROP]);
    }
  }
}; // VBHover directive


export var VBHover = {
  bind: directive,
  componentUpdated: directive,
  unbind: function unbind(el) {
    directive(el, {
      value: null
    });
  }
};