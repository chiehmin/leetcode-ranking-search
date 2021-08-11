import { NAME_COLLAPSE } from '../../constants/components';
import { IS_BROWSER } from '../../constants/env';
import { EVENT_OPTIONS_PASSIVE } from '../../constants/events';
import { CODE_ENTER, CODE_SPACE } from '../../constants/key-codes';
import { RX_HASH, RX_HASH_ID, RX_SPACE_SPLIT } from '../../constants/regex';
import { arrayIncludes, concat } from '../../utils/array';
import { addClass, getAttr, hasAttr, isDisabled, isTag, removeAttr, removeClass, removeStyle, requestAF, setAttr, setStyle } from '../../utils/dom';
import { getRootActionEventName, getRootEventName, eventOn, eventOff } from '../../utils/events';
import { isString } from '../../utils/inspect';
import { looseEqual } from '../../utils/loose-equal';
import { keys } from '../../utils/object'; // --- Constants ---
// Classes to apply to trigger element

var CLASS_BV_TOGGLE_COLLAPSED = 'collapsed';
var CLASS_BV_TOGGLE_NOT_COLLAPSED = 'not-collapsed'; // Property key for handler storage

var BV_BASE = '__BV_toggle'; // Root event listener property (Function)

var BV_TOGGLE_ROOT_HANDLER = "".concat(BV_BASE, "_HANDLER__"); // Trigger element click handler property (Function)

var BV_TOGGLE_CLICK_HANDLER = "".concat(BV_BASE, "_CLICK__"); // Target visibility state property (Boolean)

var BV_TOGGLE_STATE = "".concat(BV_BASE, "_STATE__"); // Target ID list property (Array)

var BV_TOGGLE_TARGETS = "".concat(BV_BASE, "_TARGETS__"); // Commonly used strings

var STRING_FALSE = 'false';
var STRING_TRUE = 'true'; // Commonly used attribute names

var ATTR_ARIA_CONTROLS = 'aria-controls';
var ATTR_ARIA_EXPANDED = 'aria-expanded';
var ATTR_ROLE = 'role';
var ATTR_TABINDEX = 'tabindex'; // Commonly used style properties

var STYLE_OVERFLOW_ANCHOR = 'overflow-anchor'; // Emitted control event for collapse (emitted to collapse)

var ROOT_ACTION_EVENT_NAME_TOGGLE = getRootActionEventName(NAME_COLLAPSE, 'toggle'); // Listen to event for toggle state update (emitted by collapse)

var ROOT_EVENT_NAME_STATE = getRootEventName(NAME_COLLAPSE, 'state'); // Private event emitted on `$root` to ensure the toggle state is always synced
// Gets emitted even if the state of b-collapse has not changed
// This event is NOT to be documented as people should not be using it

var ROOT_EVENT_NAME_SYNC_STATE = getRootEventName(NAME_COLLAPSE, 'sync-state'); // Private event we send to collapse to request state update sync event

var ROOT_ACTION_EVENT_NAME_REQUEST_STATE = getRootActionEventName(NAME_COLLAPSE, 'request-state');
var KEYDOWN_KEY_CODES = [CODE_ENTER, CODE_SPACE]; // --- Helper methods ---

var isNonStandardTag = function isNonStandardTag(el) {
  return !arrayIncludes(['button', 'a'], el.tagName.toLowerCase());
};

var getTargets = function getTargets(_ref, el) {
  var modifiers = _ref.modifiers,
      arg = _ref.arg,
      value = _ref.value;
  // Any modifiers are considered target IDs
  var targets = keys(modifiers || {}); // If value is a string, split out individual targets (if space delimited)

  value = isString(value) ? value.split(RX_SPACE_SPLIT) : value; // Support target ID as link href (`href="#id"`)

  if (isTag(el.tagName, 'a')) {
    var href = getAttr(el, 'href') || '';

    if (RX_HASH_ID.test(href)) {
      targets.push(href.replace(RX_HASH, ''));
    }
  } // Add ID from `arg` (if provided), and support value
  // as a single string ID or an array of string IDs
  // If `value` is not an array or string, then it gets filtered out


  concat(arg, value).forEach(function (t) {
    return isString(t) && targets.push(t);
  }); // Return only unique and truthy target IDs

  return targets.filter(function (t, index, arr) {
    return t && arr.indexOf(t) === index;
  });
};

var removeClickListener = function removeClickListener(el) {
  var handler = el[BV_TOGGLE_CLICK_HANDLER];

  if (handler) {
    eventOff(el, 'click', handler, EVENT_OPTIONS_PASSIVE);
    eventOff(el, 'keydown', handler, EVENT_OPTIONS_PASSIVE);
  }

  el[BV_TOGGLE_CLICK_HANDLER] = null;
};

var addClickListener = function addClickListener(el, vnode) {
  removeClickListener(el);

  if (vnode.context) {
    var handler = function handler(event) {
      if (!(event.type === 'keydown' && !arrayIncludes(KEYDOWN_KEY_CODES, event.keyCode)) && !isDisabled(el)) {
        var targets = el[BV_TOGGLE_TARGETS] || [];
        targets.forEach(function (target) {
          vnode.context.$root.$emit(ROOT_ACTION_EVENT_NAME_TOGGLE, target);
        });
      }
    };

    el[BV_TOGGLE_CLICK_HANDLER] = handler;
    eventOn(el, 'click', handler, EVENT_OPTIONS_PASSIVE);

    if (isNonStandardTag(el)) {
      eventOn(el, 'keydown', handler, EVENT_OPTIONS_PASSIVE);
    }
  }
};

var removeRootListeners = function removeRootListeners(el, vnode) {
  if (el[BV_TOGGLE_ROOT_HANDLER] && vnode.context) {
    vnode.context.$root.$off([ROOT_EVENT_NAME_STATE, ROOT_EVENT_NAME_SYNC_STATE], el[BV_TOGGLE_ROOT_HANDLER]);
  }

  el[BV_TOGGLE_ROOT_HANDLER] = null;
};

var addRootListeners = function addRootListeners(el, vnode) {
  removeRootListeners(el, vnode);

  if (vnode.context) {
    var handler = function handler(id, state) {
      // `state` will be `true` if target is expanded
      if (arrayIncludes(el[BV_TOGGLE_TARGETS] || [], id)) {
        // Set/Clear 'collapsed' visibility class state
        el[BV_TOGGLE_STATE] = state; // Set `aria-expanded` and class state on trigger element

        setToggleState(el, state);
      }
    };

    el[BV_TOGGLE_ROOT_HANDLER] = handler; // Listen for toggle state changes (public) and sync (private)

    vnode.context.$root.$on([ROOT_EVENT_NAME_STATE, ROOT_EVENT_NAME_SYNC_STATE], handler);
  }
};

var setToggleState = function setToggleState(el, state) {
  // State refers to the visibility of the collapse/sidebar
  if (state) {
    removeClass(el, CLASS_BV_TOGGLE_COLLAPSED);
    addClass(el, CLASS_BV_TOGGLE_NOT_COLLAPSED);
    setAttr(el, ATTR_ARIA_EXPANDED, STRING_TRUE);
  } else {
    removeClass(el, CLASS_BV_TOGGLE_NOT_COLLAPSED);
    addClass(el, CLASS_BV_TOGGLE_COLLAPSED);
    setAttr(el, ATTR_ARIA_EXPANDED, STRING_FALSE);
  }
}; // Reset and remove a property from the provided element


var resetProp = function resetProp(el, prop) {
  el[prop] = null;
  delete el[prop];
}; // Handle directive updates


var handleUpdate = function handleUpdate(el, binding, vnode) {
  /* istanbul ignore next: should never happen */
  if (!IS_BROWSER || !vnode.context) {
    return;
  } // If element is not a button or link, we add `role="button"`
  // and `tabindex="0"` for accessibility reasons


  if (isNonStandardTag(el)) {
    if (!hasAttr(el, ATTR_ROLE)) {
      setAttr(el, ATTR_ROLE, 'button');
    }

    if (!hasAttr(el, ATTR_TABINDEX)) {
      setAttr(el, ATTR_TABINDEX, '0');
    }
  } // Ensure the collapse class and `aria-*` attributes persist
  // after element is updated (either by parent re-rendering
  // or changes to this element or its contents)


  setToggleState(el, el[BV_TOGGLE_STATE]); // Parse list of target IDs

  var targets = getTargets(binding, el); // Ensure the `aria-controls` hasn't been overwritten
  // or removed when vnode updates
  // Also ensure to set `overflow-anchor` to `none` to prevent
  // the browser's scroll anchoring behavior

  /* istanbul ignore else */

  if (targets.length > 0) {
    setAttr(el, ATTR_ARIA_CONTROLS, targets.join(' '));
    setStyle(el, STYLE_OVERFLOW_ANCHOR, 'none');
  } else {
    removeAttr(el, ATTR_ARIA_CONTROLS);
    removeStyle(el, STYLE_OVERFLOW_ANCHOR);
  } // Add/Update our click listener(s)
  // Wrap in a `requestAF()` to allow any previous
  // click handling to occur first


  requestAF(function () {
    addClickListener(el, vnode);
  }); // If targets array has changed, update

  if (!looseEqual(targets, el[BV_TOGGLE_TARGETS])) {
    // Update targets array to element storage
    el[BV_TOGGLE_TARGETS] = targets; // Ensure `aria-controls` is up to date
    // Request a state update from targets so that we can
    // ensure expanded state is correct (in most cases)

    targets.forEach(function (target) {
      vnode.context.$root.$emit(ROOT_ACTION_EVENT_NAME_REQUEST_STATE, target);
    });
  }
};
/*
 * Export our directive
 */


export var VBToggle = {
  bind: function bind(el, binding, vnode) {
    // State is initially collapsed until we receive a state event
    el[BV_TOGGLE_STATE] = false; // Assume no targets initially

    el[BV_TOGGLE_TARGETS] = []; // Add our root listeners

    addRootListeners(el, vnode); // Initial update of trigger

    handleUpdate(el, binding, vnode);
  },
  componentUpdated: handleUpdate,
  updated: handleUpdate,
  unbind: function unbind(el, binding, vnode) {
    removeClickListener(el); // Remove our $root listener

    removeRootListeners(el, vnode); // Reset custom props

    resetProp(el, BV_TOGGLE_ROOT_HANDLER);
    resetProp(el, BV_TOGGLE_CLICK_HANDLER);
    resetProp(el, BV_TOGGLE_STATE);
    resetProp(el, BV_TOGGLE_TARGETS); // Reset classes/attrs/styles

    removeClass(el, CLASS_BV_TOGGLE_COLLAPSED);
    removeClass(el, CLASS_BV_TOGGLE_NOT_COLLAPSED);
    removeAttr(el, ATTR_ARIA_EXPANDED);
    removeAttr(el, ATTR_ARIA_CONTROLS);
    removeAttr(el, ATTR_ROLE);
    removeStyle(el, STYLE_OVERFLOW_ANCHOR);
  }
};