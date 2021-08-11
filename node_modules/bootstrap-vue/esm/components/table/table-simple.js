function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_TABLE_SIMPLE } from '../../constants/components';
import { sortKeys } from '../../utils/object';
import { makePropsConfigurable } from '../../utils/props';
import { attrsMixin } from '../../mixins/attrs';
import { hasListenerMixin } from '../../mixins/has-listener';
import { idMixin, props as idProps } from '../../mixins/id';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { stackedMixin, props as stackedProps } from './helpers/mixin-stacked';
import { tableRendererMixin, props as tableRendererProps } from './helpers/mixin-table-renderer'; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread({}, idProps), stackedProps), tableRendererProps)), NAME_TABLE_SIMPLE); // --- Main component ---
// @vue/component

export var BTableSimple = /*#__PURE__*/Vue.extend({
  name: NAME_TABLE_SIMPLE,
  // Order of mixins is important!
  // They are merged from first to last, followed by this component
  mixins: [// General mixins
  attrsMixin, hasListenerMixin, idMixin, normalizeSlotMixin, // Required table mixins
  tableRendererMixin, // Table features mixins
  // Stacked requires extra handling by users via
  // the table cell `stacked-heading` prop
  stackedMixin],
  props: props,
  computed: {
    isTableSimple: function isTableSimple() {
      return true;
    }
  } // Render function is provided by `tableRendererMixin`

});