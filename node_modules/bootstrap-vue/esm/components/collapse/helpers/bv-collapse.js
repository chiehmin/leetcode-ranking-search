// Generic collapse transion helper component
//
// Note:
//   Applies the classes `collapse`, `show` and `collapsing`
//   during the enter/leave transition phases only
//   Although it appears that Vue may be leaving the classes
//   in-place after the transition completes
import { Vue, mergeData } from '../../../vue';
import { NAME_COLLAPSE_HELPER } from '../../../constants/components';
import { PROP_TYPE_BOOLEAN } from '../../../constants/props';
import { getBCR, reflow, removeStyle, requestAF, setStyle } from '../../../utils/dom';
import { makeProp } from '../../../utils/props'; // --- Helper methods ---
// Transition event handler helpers

var onEnter = function onEnter(el) {
  setStyle(el, 'height', 0); // In a `requestAF()` for `appear` to work

  requestAF(function () {
    reflow(el);
    setStyle(el, 'height', "".concat(el.scrollHeight, "px"));
  });
};

var onAfterEnter = function onAfterEnter(el) {
  removeStyle(el, 'height');
};

var onLeave = function onLeave(el) {
  setStyle(el, 'height', 'auto');
  setStyle(el, 'display', 'block');
  setStyle(el, 'height', "".concat(getBCR(el).height, "px"));
  reflow(el);
  setStyle(el, 'height', 0);
};

var onAfterLeave = function onAfterLeave(el) {
  removeStyle(el, 'height');
}; // --- Constants ---
// Default transition props
// `appear` will use the enter classes


var TRANSITION_PROPS = {
  css: true,
  enterClass: '',
  enterActiveClass: 'collapsing',
  enterToClass: 'collapse show',
  leaveClass: 'collapse show',
  leaveActiveClass: 'collapsing',
  leaveToClass: 'collapse'
}; // Default transition handlers
// `appear` will use the enter handlers

var TRANSITION_HANDLERS = {
  enter: onEnter,
  afterEnter: onAfterEnter,
  leave: onLeave,
  afterLeave: onAfterLeave
}; // --- Main component ---

export var props = {
  // // If `true` (and `visible` is `true` on mount), animate initially visible
  appear: makeProp(PROP_TYPE_BOOLEAN, false)
}; // --- Main component ---
// @vue/component

export var BVCollapse = /*#__PURE__*/Vue.extend({
  name: NAME_COLLAPSE_HELPER,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    return h('transition', // We merge in the `appear` prop last
    mergeData(data, {
      props: TRANSITION_PROPS,
      on: TRANSITION_HANDLERS
    }, {
      props: props
    }), // Note: `<transition>` supports a single root element only
    children);
  }
});