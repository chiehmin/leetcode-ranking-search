function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_PROGRESS } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { omit, sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable, pluckProps } from '../../utils/props';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BProgressBar, props as BProgressBarProps } from './progress-bar'; // --- Props ---

var progressBarProps = omit(BProgressBarProps, ['label', 'labelHtml']);
export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, progressBarProps), {}, {
  animated: makeProp(PROP_TYPE_BOOLEAN, false),
  height: makeProp(PROP_TYPE_STRING),
  max: makeProp(PROP_TYPE_NUMBER_STRING, 100),
  precision: makeProp(PROP_TYPE_NUMBER_STRING, 0),
  showProgress: makeProp(PROP_TYPE_BOOLEAN, false),
  showValue: makeProp(PROP_TYPE_BOOLEAN, false),
  striped: makeProp(PROP_TYPE_BOOLEAN, false)
})), NAME_PROGRESS); // --- Main component ---
// @vue/component

export var BProgress = /*#__PURE__*/Vue.extend({
  name: NAME_PROGRESS,
  mixins: [normalizeSlotMixin],
  provide: function provide() {
    return {
      bvProgress: this
    };
  },
  props: props,
  computed: {
    progressHeight: function progressHeight() {
      return {
        height: this.height || null
      };
    }
  },
  render: function render(h) {
    var $childNodes = this.normalizeSlot();

    if (!$childNodes) {
      $childNodes = h(BProgressBar, {
        props: pluckProps(progressBarProps, this.$props)
      });
    }

    return h('div', {
      staticClass: 'progress',
      style: this.progressHeight
    }, [$childNodes]);
  }
});