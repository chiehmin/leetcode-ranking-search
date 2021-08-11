function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_NAV } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props';
import { makeProp, makePropsConfigurable } from '../../utils/props'; // --- Helper methods ---

var computeJustifyContent = function computeJustifyContent(value) {
  value = value === 'left' ? 'start' : value === 'right' ? 'end' : value;
  return "justify-content-".concat(value);
}; // --- Props ---


export var props = makePropsConfigurable({
  align: makeProp(PROP_TYPE_STRING),
  // Set to `true` if placing in a card header
  cardHeader: makeProp(PROP_TYPE_BOOLEAN, false),
  fill: makeProp(PROP_TYPE_BOOLEAN, false),
  justified: makeProp(PROP_TYPE_BOOLEAN, false),
  pills: makeProp(PROP_TYPE_BOOLEAN, false),
  small: makeProp(PROP_TYPE_BOOLEAN, false),
  tabs: makeProp(PROP_TYPE_BOOLEAN, false),
  tag: makeProp(PROP_TYPE_STRING, 'ul'),
  vertical: makeProp(PROP_TYPE_BOOLEAN, false)
}, NAME_NAV); // --- Main component ---
// @vue/component

export var BNav = /*#__PURE__*/Vue.extend({
  name: NAME_NAV,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var _class;

    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var tabs = props.tabs,
        pills = props.pills,
        vertical = props.vertical,
        align = props.align,
        cardHeader = props.cardHeader;
    return h(props.tag, mergeData(data, {
      staticClass: 'nav',
      class: (_class = {
        'nav-tabs': tabs,
        'nav-pills': pills && !tabs,
        'card-header-tabs': !vertical && cardHeader && tabs,
        'card-header-pills': !vertical && cardHeader && pills && !tabs,
        'flex-column': vertical,
        'nav-fill': !vertical && props.fill,
        'nav-justified': !vertical && props.justified
      }, _defineProperty(_class, computeJustifyContent(align), !vertical && align), _defineProperty(_class, "small", props.small), _class)
    }), children);
  }
});