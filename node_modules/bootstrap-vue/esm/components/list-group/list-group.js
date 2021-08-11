function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_LIST_GROUP } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_BOOLEAN_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { isString } from '../../utils/inspect';
import { makeProp, makePropsConfigurable } from '../../utils/props'; // --- Props ---

export var props = makePropsConfigurable({
  flush: makeProp(PROP_TYPE_BOOLEAN, false),
  horizontal: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
  tag: makeProp(PROP_TYPE_STRING, 'div')
}, NAME_LIST_GROUP); // --- Main component ---
// @vue/component

export var BListGroup = /*#__PURE__*/Vue.extend({
  name: NAME_LIST_GROUP,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var horizontal = props.horizontal === '' ? true : props.horizontal;
    horizontal = props.flush ? false : horizontal;
    var componentData = {
      staticClass: 'list-group',
      class: _defineProperty({
        'list-group-flush': props.flush,
        'list-group-horizontal': horizontal === true
      }, "list-group-horizontal-".concat(horizontal), isString(horizontal))
    };
    return h(props.tag, mergeData(data, componentData), children);
  }
});