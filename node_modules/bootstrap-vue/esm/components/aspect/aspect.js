function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { Vue } from '../../vue';
import { NAME_ASPECT } from '../../constants/components';
import { PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { RX_ASPECT, RX_ASPECT_SEPARATOR } from '../../constants/regex';
import { mathAbs } from '../../utils/math';
import { toFloat } from '../../utils/number';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { normalizeSlotMixin } from '../../mixins/normalize-slot'; // --- Constants ---

var CLASS_NAME = 'b-aspect'; // --- Props ---

export var props = makePropsConfigurable({
  // Accepts a number (i.e. `16 / 9`, `1`, `4 / 3`)
  // Or a string (i.e. '16/9', '16:9', '4:3' '1:1')
  aspect: makeProp(PROP_TYPE_NUMBER_STRING, '1:1'),
  tag: makeProp(PROP_TYPE_STRING, 'div')
}, NAME_ASPECT); // --- Main component ---
// @vue/component

export var BAspect = /*#__PURE__*/Vue.extend({
  name: NAME_ASPECT,
  mixins: [normalizeSlotMixin],
  props: props,
  computed: {
    padding: function padding() {
      var aspect = this.aspect;
      var ratio = 1;

      if (RX_ASPECT.test(aspect)) {
        // Width and/or Height can be a decimal value below `1`, so
        // we only fallback to `1` if the value is `0` or `NaN`
        var _aspect$split$map = aspect.split(RX_ASPECT_SEPARATOR).map(function (v) {
          return toFloat(v) || 1;
        }),
            _aspect$split$map2 = _slicedToArray(_aspect$split$map, 2),
            width = _aspect$split$map2[0],
            height = _aspect$split$map2[1];

        ratio = width / height;
      } else {
        ratio = toFloat(aspect) || 1;
      }

      return "".concat(100 / mathAbs(ratio), "%");
    }
  },
  render: function render(h) {
    var $sizer = h('div', {
      staticClass: "".concat(CLASS_NAME, "-sizer flex-grow-1"),
      style: {
        paddingBottom: this.padding,
        height: 0
      }
    });
    var $content = h('div', {
      staticClass: "".concat(CLASS_NAME, "-content flex-grow-1 w-100 mw-100"),
      style: {
        marginLeft: '-100%'
      }
    }, this.normalizeSlot());
    return h(this.tag, {
      staticClass: "".concat(CLASS_NAME, " d-flex")
    }, [$sizer, $content]);
  }
});