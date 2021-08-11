function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../vue';
import { NAME_FORM_TAG } from '../../constants/components';
import { EVENT_NAME_REMOVE } from '../../constants/events';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props';
import { CODE_DELETE } from '../../constants/key-codes';
import { sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { idMixin, props as idProps } from '../../mixins/id';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BBadge } from '../badge/badge';
import { BButtonClose } from '../button/button-close'; // --- Props ---

export var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread({}, idProps), {}, {
  disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  noRemove: makeProp(PROP_TYPE_BOOLEAN, false),
  pill: makeProp(PROP_TYPE_BOOLEAN, false),
  removeLabel: makeProp(PROP_TYPE_STRING, 'Remove tag'),
  tag: makeProp(PROP_TYPE_STRING, 'span'),
  title: makeProp(PROP_TYPE_STRING),
  variant: makeProp(PROP_TYPE_STRING, 'secondary')
})), NAME_FORM_TAG); // --- Main component ---
// @vue/component

export var BFormTag = /*#__PURE__*/Vue.extend({
  name: NAME_FORM_TAG,
  mixins: [idMixin, normalizeSlotMixin],
  props: props,
  methods: {
    onRemove: function onRemove(event) {
      var type = event.type,
          keyCode = event.keyCode;

      if (!this.disabled && (type === 'click' || type === 'keydown' && keyCode === CODE_DELETE)) {
        this.$emit(EVENT_NAME_REMOVE);
      }
    }
  },
  render: function render(h) {
    var title = this.title,
        tag = this.tag,
        variant = this.variant,
        pill = this.pill,
        disabled = this.disabled;
    var tagId = this.safeId();
    var tagLabelId = this.safeId('_taglabel_');
    var $remove = h();

    if (!this.noRemove && !disabled) {
      $remove = h(BButtonClose, {
        staticClass: 'b-form-tag-remove',
        props: {
          ariaLabel: this.removeLabel
        },
        attrs: {
          'aria-controls': tagId,
          'aria-describedby': tagLabelId,
          'aria-keyshortcuts': 'Delete'
        },
        on: {
          click: this.onRemove,
          keydown: this.onRemove
        }
      });
    }

    var $tag = h('span', {
      staticClass: 'b-form-tag-content flex-grow-1 text-truncate',
      attrs: {
        id: tagLabelId
      }
    }, this.normalizeSlot() || title);
    return h(BBadge, {
      staticClass: 'b-form-tag d-inline-flex align-items-baseline mw-100',
      class: {
        disabled: disabled
      },
      props: {
        tag: tag,
        variant: variant,
        pill: pill
      },
      attrs: {
        id: tagId,
        title: title || null,
        'aria-labelledby': tagLabelId
      }
    }, [$tag, $remove]);
  }
});