function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../../../vue';
import { EVENT_NAME_HEAD_CLICKED } from '../../../constants/events';
import { CODE_ENTER, CODE_SPACE } from '../../../constants/key-codes';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_STRING } from '../../../constants/props';
import { SLOT_NAME_THEAD_TOP } from '../../../constants/slots';
import { stopEvent } from '../../../utils/events';
import { htmlOrText } from '../../../utils/html';
import { identity } from '../../../utils/identity';
import { isUndefinedOrNull } from '../../../utils/inspect';
import { noop } from '../../../utils/noop';
import { makeProp } from '../../../utils/props';
import { startCase } from '../../../utils/string';
import { BThead } from '../thead';
import { BTfoot } from '../tfoot';
import { BTr } from '../tr';
import { BTh } from '../th';
import { filterEvent } from './filter-event';
import { textSelectionActive } from './text-selection-active'; // --- Helper methods ---

var getHeadSlotName = function getHeadSlotName(value) {
  return "head(".concat(value || '', ")");
};

var getFootSlotName = function getFootSlotName(value) {
  return "foot(".concat(value || '', ")");
}; // --- Props ---


export var props = {
  // Any Bootstrap theme variant (or custom)
  headRowVariant: makeProp(PROP_TYPE_STRING),
  // 'light', 'dark' or `null` (or custom)
  headVariant: makeProp(PROP_TYPE_STRING),
  theadClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  theadTrClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING)
}; // --- Mixin ---
// @vue/component

export var theadMixin = Vue.extend({
  props: props,
  methods: {
    fieldClasses: function fieldClasses(field) {
      // Header field (<th>) classes
      return [field.class ? field.class : '', field.thClass ? field.thClass : ''];
    },
    headClicked: function headClicked(event, field, isFoot) {
      if (this.stopIfBusy && this.stopIfBusy(event)) {
        // If table is busy (via provider) then don't propagate
        return;
      } else if (filterEvent(event)) {
        // Clicked on a non-disabled control so ignore
        return;
      } else if (textSelectionActive(this.$el)) {
        // User is selecting text, so ignore

        /* istanbul ignore next: JSDOM doesn't support getSelection() */
        return;
      }

      stopEvent(event);
      this.$emit(EVENT_NAME_HEAD_CLICKED, field.key, field, event, isFoot);
    },
    renderThead: function renderThead() {
      var _this = this;

      var isFoot = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var fields = this.computedFields,
          isSortable = this.isSortable,
          isSelectable = this.isSelectable,
          headVariant = this.headVariant,
          footVariant = this.footVariant,
          headRowVariant = this.headRowVariant,
          footRowVariant = this.footRowVariant;
      var h = this.$createElement; // In always stacked mode, we don't bother rendering the head/foot
      // Or if no field headings (empty table)

      if (this.isStackedAlways || fields.length === 0) {
        return h();
      }

      var hasHeadClickListener = isSortable || this.hasListener(EVENT_NAME_HEAD_CLICKED); // Reference to `selectAllRows` and `clearSelected()`, if table is selectable

      var selectAllRows = isSelectable ? this.selectAllRows : noop;
      var clearSelected = isSelectable ? this.clearSelected : noop; // Helper function to generate a field <th> cell

      var makeCell = function makeCell(field, colIndex) {
        var label = field.label,
            labelHtml = field.labelHtml,
            variant = field.variant,
            stickyColumn = field.stickyColumn,
            key = field.key;
        var ariaLabel = null;

        if (!field.label.trim() && !field.headerTitle) {
          // In case field's label and title are empty/blank
          // We need to add a hint about what the column is about for non-sighted users

          /* istanbul ignore next */
          ariaLabel = startCase(field.key);
        }

        var on = {};

        if (hasHeadClickListener) {
          on.click = function (event) {
            _this.headClicked(event, field, isFoot);
          };

          on.keydown = function (event) {
            var keyCode = event.keyCode;

            if (keyCode === CODE_ENTER || keyCode === CODE_SPACE) {
              _this.headClicked(event, field, isFoot);
            }
          };
        }

        var sortAttrs = isSortable ? _this.sortTheadThAttrs(key, field, isFoot) : {};
        var sortClass = isSortable ? _this.sortTheadThClasses(key, field, isFoot) : null;
        var sortLabel = isSortable ? _this.sortTheadThLabel(key, field, isFoot) : null;
        var data = {
          class: [_this.fieldClasses(field), sortClass],
          props: {
            variant: variant,
            stickyColumn: stickyColumn
          },
          style: field.thStyle || {},
          attrs: _objectSpread(_objectSpread({
            // We only add a `tabindex` of `0` if there is a head-clicked listener
            // and the current field is sortable
            tabindex: hasHeadClickListener && field.sortable ? '0' : null,
            abbr: field.headerAbbr || null,
            title: field.headerTitle || null,
            'aria-colindex': colIndex + 1,
            'aria-label': ariaLabel
          }, _this.getThValues(null, key, field.thAttr, isFoot ? 'foot' : 'head', {})), sortAttrs),
          on: on,
          key: key
        }; // Handle edge case where in-document templates are used with new
        // `v-slot:name` syntax where the browser lower-cases the v-slot's
        // name (attributes become lower cased when parsed by the browser)
        // We have replaced the square bracket syntax with round brackets
        // to prevent confusion with dynamic slot names

        var slotNames = [getHeadSlotName(key), getHeadSlotName(key.toLowerCase()), getHeadSlotName()]; // Footer will fallback to header slot names

        if (isFoot) {
          slotNames = [getFootSlotName(key), getFootSlotName(key.toLowerCase()), getFootSlotName()].concat(_toConsumableArray(slotNames));
        }

        var scope = {
          label: label,
          column: key,
          field: field,
          isFoot: isFoot,
          // Add in row select methods
          selectAllRows: selectAllRows,
          clearSelected: clearSelected
        };
        var $content = _this.normalizeSlot(slotNames, scope) || h('div', {
          domProps: htmlOrText(labelHtml, label)
        });
        var $srLabel = sortLabel ? h('span', {
          staticClass: 'sr-only'
        }, " (".concat(sortLabel, ")")) : null; // Return the header cell

        return h(BTh, data, [$content, $srLabel].filter(identity));
      }; // Generate the array of <th> cells


      var $cells = fields.map(makeCell).filter(identity); // Generate the row(s)

      var $trs = [];

      if (isFoot) {
        $trs.push(h(BTr, {
          class: this.tfootTrClass,
          props: {
            variant: isUndefinedOrNull(footRowVariant) ? headRowVariant :
            /* istanbul ignore next */
            footRowVariant
          }
        }, $cells));
      } else {
        var scope = {
          columns: fields.length,
          fields: fields,
          // Add in row select methods
          selectAllRows: selectAllRows,
          clearSelected: clearSelected
        };
        $trs.push(this.normalizeSlot(SLOT_NAME_THEAD_TOP, scope) || h());
        $trs.push(h(BTr, {
          class: this.theadTrClass,
          props: {
            variant: headRowVariant
          }
        }, $cells));
      }

      return h(isFoot ? BTfoot : BThead, {
        class: (isFoot ? this.tfootClass : this.theadClass) || null,
        props: isFoot ? {
          footVariant: footVariant || headVariant || null
        } : {
          headVariant: headVariant || null
        },
        key: isFoot ? 'bv-tfoot' : 'bv-thead'
      }, $trs);
    }
  }
});