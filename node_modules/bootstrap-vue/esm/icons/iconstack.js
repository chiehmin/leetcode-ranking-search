import { Vue, mergeData } from '../vue';
import { NAME_ICONSTACK } from '../constants/components';
import { omit } from '../utils/object';
import { makePropsConfigurable } from '../utils/props';
import { BVIconBase, props as BVIconBaseProps } from './helpers/icon-base'; // --- Props ---

export var props = makePropsConfigurable(omit(BVIconBaseProps, ['content', 'stacked']), NAME_ICONSTACK); // --- Main component ---
// @vue/component

export var BIconstack = /*#__PURE__*/Vue.extend({
  name: NAME_ICONSTACK,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var data = _ref.data,
        props = _ref.props,
        children = _ref.children;
    return h(BVIconBase, mergeData(data, {
      staticClass: 'b-iconstack',
      props: props
    }), children);
  }
});