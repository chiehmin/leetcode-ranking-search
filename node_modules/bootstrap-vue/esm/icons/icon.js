function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../vue';
import { NAME_ICON } from '../constants/components';
import { PROP_TYPE_STRING } from '../constants/props';
import { RX_ICON_PREFIX } from '../constants/regex';
import { omit, sortKeys } from '../utils/object';
import { makeProp, makePropsConfigurable, pluckProps } from '../utils/props';
import { pascalCase, trim } from '../utils/string';
import { BIconBlank } from './icons';
import { props as BVIconBaseProps } from './helpers/icon-base'; // --- Helper methods ---

var findIconComponent = function findIconComponent(ctx, iconName) {
  if (!ctx) {
    return null;
  }

  var components = (ctx.$options || {}).components;
  var iconComponent = components[iconName];
  return iconComponent || findIconComponent(ctx.$parent, iconName);
}; // --- Props ---


var iconProps = omit(BVIconBaseProps, ['content']);
export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, iconProps), {}, {
  icon: makeProp(PROP_TYPE_STRING)
})), NAME_ICON); // --- Main component ---
// Helper BIcon component
// Requires the requested icon component to be installed
// @vue/component

export var BIcon = /*#__PURE__*/Vue.extend({
  name: NAME_ICON,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var data = _ref.data,
        props = _ref.props,
        parent = _ref.parent;
    var icon = pascalCase(trim(props.icon || '')).replace(RX_ICON_PREFIX, ''); // If parent context exists, we check to see if the icon has been registered
    // either locally in the parent component, or globally at the `$root` level
    // If not registered, we render a blank icon

    return h(icon ? findIconComponent(parent, "BIcon".concat(icon)) || BIconBlank : BIconBlank, mergeData(data, {
      props: pluckProps(iconProps, props)
    }));
  }
});