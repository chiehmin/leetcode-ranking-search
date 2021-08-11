function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_DROPDOWN_FORM } from '../../constants/components';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_BOOLEAN } from '../../constants/props';
import { omit, sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { BForm, props as formControlProps } from '../form/form'; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, formControlProps), {}, {
  disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  formClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING)
})), NAME_DROPDOWN_FORM); // --- Main component ---
// @vue/component

export var BDropdownForm = /*#__PURE__*/Vue.extend({
  name: NAME_DROPDOWN_FORM,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        listeners = _ref.listeners,
        children = _ref.children;
    return h('li', mergeData(omit(data, ['attrs', 'on']), {
      attrs: {
        role: 'presentation'
      }
    }), [h(BForm, {
      staticClass: 'b-dropdown-form',
      class: [props.formClass, {
        disabled: props.disabled
      }],
      props: props,
      attrs: _objectSpread(_objectSpread({}, data.attrs || {}), {}, {
        disabled: props.disabled,
        // Tab index of -1 for keyboard navigation
        tabindex: props.disabled ? null : '-1'
      }),
      on: listeners,
      ref: 'form'
    }, children)]);
  }
});