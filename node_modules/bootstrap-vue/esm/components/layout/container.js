function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_CONTAINER } from '../../constants/components';
import { PROP_TYPE_BOOLEAN_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  // String breakpoint name new in Bootstrap v4.4.x
  fluid: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
  tag: makeProp(PROP_TYPE_STRING, 'div')
}, NAME_CONTAINER); // --- Main component ---
// @vue/component

export var BContainer = /*#__PURE__*/Vue.extend({
  name: NAME_CONTAINER,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var fluid = props.fluid;
    return h(props.tag, mergeData(data, {
      class: _defineProperty({
        container: !(fluid || fluid === ''),
        'container-fluid': fluid === true || fluid === ''
      }, "container-".concat(fluid), fluid && fluid !== true)
    }), children);
  }
});