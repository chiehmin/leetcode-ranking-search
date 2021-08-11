function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_EMBED } from '../../constants/components';
import { PROP_TYPE_STRING } from '../../constants/props';
import { arrayIncludes } from '../../utils/array';
import { omit } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props'; // --- Constants ---

var TYPES = ['iframe', 'embed', 'video', 'object', 'img', 'b-img', 'b-img-lazy']; // --- Props ---

export var props = makePropsConfigurable({
  aspect: makeProp(PROP_TYPE_STRING, '16by9'),
  tag: makeProp(PROP_TYPE_STRING, 'div'),
  type: makeProp(PROP_TYPE_STRING, 'iframe', function (value) {
    return arrayIncludes(TYPES, value);
  })
}, NAME_EMBED); // --- Main component ---
// @vue/component

export var BEmbed = /*#__PURE__*/Vue.extend({
  name: NAME_EMBED,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;
    var aspect = props.aspect;
    return h(props.tag, {
      staticClass: 'embed-responsive',
      class: _defineProperty({}, "embed-responsive-".concat(aspect), aspect),
      ref: data.ref
    }, [h(props.type, mergeData(omit(data, ['ref']), {
      staticClass: 'embed-responsive-item'
    }), children)]);
  }
});