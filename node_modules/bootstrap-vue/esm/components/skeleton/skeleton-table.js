function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_SKELETON_TABLE } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_NUMBER, PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '../../constants/props';
import { createArray } from '../../utils/array';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { BSkeleton } from './skeleton';
import { BTableSimple } from '../table'; // --- Helper methods ---

var isPositiveNumber = function isPositiveNumber(value) {
  return value > 0;
}; // --- Props ---


export var props = makePropsConfigurable({
  animation: makeProp(PROP_TYPE_STRING),
  columns: makeProp(PROP_TYPE_NUMBER, 5, isPositiveNumber),
  hideHeader: makeProp(PROP_TYPE_BOOLEAN, false),
  rows: makeProp(PROP_TYPE_NUMBER, 3, isPositiveNumber),
  showFooter: makeProp(PROP_TYPE_BOOLEAN, false),
  tableProps: makeProp(PROP_TYPE_OBJECT, {})
}, NAME_SKELETON_TABLE); // --- Main component ---
// @vue/component

export var BSkeletonTable = /*#__PURE__*/Vue.extend({
  name: NAME_SKELETON_TABLE,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props;
    var animation = props.animation,
        columns = props.columns;
    var $th = h('th', [h(BSkeleton, {
      props: {
        animation: animation
      }
    })]);
    var $thTr = h('tr', createArray(columns, $th));
    var $td = h('td', [h(BSkeleton, {
      props: {
        width: '75%',
        animation: animation
      }
    })]);
    var $tdTr = h('tr', createArray(columns, $td));
    var $tbody = h('tbody', createArray(props.rows, $tdTr));
    var $thead = !props.hideHeader ? h('thead', [$thTr]) : h();
    var $tfoot = props.showFooter ? h('tfoot', [$thTr]) : h();
    return h(BTableSimple, {
      props: _objectSpread({}, props.tableProps)
    }, [$thead, $tbody, $tfoot]);
  }
});