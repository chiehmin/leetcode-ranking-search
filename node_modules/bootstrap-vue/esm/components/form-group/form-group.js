function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { NAME_FORM_GROUP } from '../../constants/components';
import { IS_BROWSER } from '../../constants/env';
import { PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_BOOLEAN_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { RX_SPACE_SPLIT } from '../../constants/regex';
import { SLOT_NAME_DEFAULT, SLOT_NAME_DESCRIPTION, SLOT_NAME_INVALID_FEEDBACK, SLOT_NAME_LABEL, SLOT_NAME_VALID_FEEDBACK } from '../../constants/slots';
import { arrayIncludes } from '../../utils/array';
import { getBreakpointsUpCached } from '../../utils/config';
import { cssEscape } from '../../utils/css-escape';
import { select, selectAll, isVisible, setAttr, removeAttr, getAttr, attemptFocus } from '../../utils/dom';
import { identity } from '../../utils/identity';
import { isBoolean } from '../../utils/inspect';
import { toInteger } from '../../utils/number';
import { create, keys, sortKeys } from '../../utils/object';
import { makeProp, makePropsConfigurable, suffixPropName } from '../../utils/props';
import { formStateMixin, props as formStateProps } from '../../mixins/form-state';
import { idMixin, props as idProps } from '../../mixins/id';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BCol } from '../layout/col';
import { BFormRow } from '../layout/form-row';
import { BFormText } from '../form/form-text';
import { BFormInvalidFeedback } from '../form/form-invalid-feedback';
import { BFormValidFeedback } from '../form/form-valid-feedback'; // --- Constants ---

var INPUTS = ['input', 'select', 'textarea']; // Selector for finding first input in the form group

var INPUT_SELECTOR = INPUTS.map(function (v) {
  return "".concat(v, ":not([disabled])");
}).join(); // A list of interactive elements (tag names) inside `<b-form-group>`'s legend

var LEGEND_INTERACTIVE_ELEMENTS = [].concat(INPUTS, ['a', 'button', 'label']); // --- Props ---
// Prop generator for lazy generation of props

export var generateProps = function generateProps() {
  return makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, idProps), formStateProps), getBreakpointsUpCached().reduce(function (props, breakpoint) {
    // i.e. 'content-cols', 'content-cols-sm', 'content-cols-md', ...
    props[suffixPropName(breakpoint, 'contentCols')] = makeProp(PROP_TYPE_BOOLEAN_NUMBER_STRING); // i.e. 'label-align', 'label-align-sm', 'label-align-md', ...

    props[suffixPropName(breakpoint, 'labelAlign')] = makeProp(PROP_TYPE_STRING); // i.e. 'label-cols', 'label-cols-sm', 'label-cols-md', ...

    props[suffixPropName(breakpoint, 'labelCols')] = makeProp(PROP_TYPE_BOOLEAN_NUMBER_STRING);
    return props;
  }, create(null))), {}, {
    description: makeProp(PROP_TYPE_STRING),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    feedbackAriaLive: makeProp(PROP_TYPE_STRING, 'assertive'),
    invalidFeedback: makeProp(PROP_TYPE_STRING),
    label: makeProp(PROP_TYPE_STRING),
    labelClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
    labelFor: makeProp(PROP_TYPE_STRING),
    labelSize: makeProp(PROP_TYPE_STRING),
    labelSrOnly: makeProp(PROP_TYPE_BOOLEAN, false),
    tooltip: makeProp(PROP_TYPE_BOOLEAN, false),
    validFeedback: makeProp(PROP_TYPE_STRING),
    validated: makeProp(PROP_TYPE_BOOLEAN, false)
  })), NAME_FORM_GROUP);
}; // --- Main component ---
// We do not use `Vue.extend()` here as that would evaluate the props
// immediately, which we do not want to happen
// @vue/component

export var BFormGroup = {
  name: NAME_FORM_GROUP,
  mixins: [idMixin, formStateMixin, normalizeSlotMixin],

  get props() {
    // Allow props to be lazy evaled on first access and
    // then they become a non-getter afterwards
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#Smart_self-overwriting_lazy_getters
    delete this.props; // eslint-disable-next-line no-return-assign

    return this.props = generateProps();
  },

  data: function data() {
    return {
      ariaDescribedby: null
    };
  },
  computed: {
    contentColProps: function contentColProps() {
      return this.getColProps(this.$props, 'content');
    },
    labelAlignClasses: function labelAlignClasses() {
      return this.getAlignClasses(this.$props, 'label');
    },
    labelColProps: function labelColProps() {
      return this.getColProps(this.$props, 'label');
    },
    isHorizontal: function isHorizontal() {
      // Determine if the form group will be rendered horizontal
      // based on the existence of 'content-col' or 'label-col' props
      return keys(this.contentColProps).length > 0 || keys(this.labelColProps).length > 0;
    }
  },
  watch: {
    ariaDescribedby: function ariaDescribedby(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.updateAriaDescribedby(newValue, oldValue);
      }
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      // Set `aria-describedby` on the input specified by `labelFor`
      // We do this in a `$nextTick()` to ensure the children have finished rendering
      _this.updateAriaDescribedby(_this.ariaDescribedby);
    });
  },
  methods: {
    getAlignClasses: function getAlignClasses(props, prefix) {
      return getBreakpointsUpCached().reduce(function (result, breakpoint) {
        var propValue = props[suffixPropName(breakpoint, "".concat(prefix, "Align"))] || null;

        if (propValue) {
          result.push(['text', breakpoint, propValue].filter(identity).join('-'));
        }

        return result;
      }, []);
    },
    getColProps: function getColProps(props, prefix) {
      return getBreakpointsUpCached().reduce(function (result, breakpoint) {
        var propValue = props[suffixPropName(breakpoint, "".concat(prefix, "Cols"))]; // Handle case where the prop's value is an empty string,
        // which represents `true`

        propValue = propValue === '' ? true : propValue || false;

        if (!isBoolean(propValue) && propValue !== 'auto') {
          // Convert to column size to number
          propValue = toInteger(propValue, 0); // Ensure column size is greater than `0`

          propValue = propValue > 0 ? propValue : false;
        } // Add the prop to the list of props to give to `<b-col>`
        // If breakpoint is '' (`${prefix}Cols` is `true`), then we use
        // the 'col' prop to make equal width at 'xs'


        if (propValue) {
          result[breakpoint || (isBoolean(propValue) ? 'col' : 'cols')] = propValue;
        }

        return result;
      }, {});
    },
    // Sets the `aria-describedby` attribute on the input if `labelFor` is set
    // Optionally accepts a string of IDs to remove as the second parameter
    // Preserves any `aria-describedby` value(s) user may have on input
    updateAriaDescribedby: function updateAriaDescribedby(newValue, oldValue) {
      var labelFor = this.labelFor;

      if (IS_BROWSER && labelFor) {
        // We need to escape `labelFor` since it can be user-provided
        var $input = select("#".concat(cssEscape(labelFor)), this.$refs.content);

        if ($input) {
          var attr = 'aria-describedby';
          var newIds = (newValue || '').split(RX_SPACE_SPLIT);
          var oldIds = (oldValue || '').split(RX_SPACE_SPLIT); // Update ID list, preserving any original IDs
          // and ensuring the ID's are unique

          var ids = (getAttr($input, attr) || '').split(RX_SPACE_SPLIT).filter(function (id) {
            return !arrayIncludes(oldIds, id);
          }).concat(newIds).filter(function (id, index, ids) {
            return ids.indexOf(id) === index;
          }).filter(identity).join(' ').trim();

          if (ids) {
            setAttr($input, attr, ids);
          } else {
            removeAttr($input, attr);
          }
        }
      }
    },
    onLegendClick: function onLegendClick(event) {
      // Don't do anything if `labelFor` is set

      /* istanbul ignore next: clicking a label will focus the input, so no need to test */
      if (this.labelFor) {
        return;
      }

      var target = event.target;
      var tagName = target ? target.tagName : ''; // If clicked an interactive element inside legend,
      // we just let the default happen

      /* istanbul ignore next */

      if (LEGEND_INTERACTIVE_ELEMENTS.indexOf(tagName) !== -1) {
        return;
      } // If only a single input, focus it, emulating label behaviour


      var inputs = selectAll(INPUT_SELECTOR, this.$refs.content).filter(isVisible);

      if (inputs.length === 1) {
        attemptFocus(inputs[0]);
      }
    }
  },
  render: function render(h) {
    var state = this.computedState,
        feedbackAriaLive = this.feedbackAriaLive,
        isHorizontal = this.isHorizontal,
        labelFor = this.labelFor,
        normalizeSlot = this.normalizeSlot,
        safeId = this.safeId,
        tooltip = this.tooltip;
    var id = safeId();
    var isFieldset = !labelFor;
    var $label = h();
    var labelContent = normalizeSlot(SLOT_NAME_LABEL) || this.label;
    var labelId = labelContent ? safeId('_BV_label_') : null;

    if (labelContent || isHorizontal) {
      var labelSize = this.labelSize,
          labelColProps = this.labelColProps;
      var labelTag = isFieldset ? 'legend' : 'label';

      if (this.labelSrOnly) {
        if (labelContent) {
          $label = h(labelTag, {
            class: 'sr-only',
            attrs: {
              id: labelId,
              for: labelFor || null
            }
          }, [labelContent]);
        }

        $label = h(isHorizontal ? BCol : 'div', {
          props: isHorizontal ? labelColProps : {}
        }, [$label]);
      } else {
        $label = h(isHorizontal ? BCol : labelTag, {
          on: isFieldset ? {
            click: this.onLegendClick
          } : {},
          props: isHorizontal ? _objectSpread(_objectSpread({}, labelColProps), {}, {
            tag: labelTag
          }) : {},
          attrs: {
            id: labelId,
            for: labelFor || null,
            // We add a `tabindex` to legend so that screen readers
            // will properly read the `aria-labelledby` in IE
            tabindex: isFieldset ? '-1' : null
          },
          class: [// Hide the focus ring on the legend
          isFieldset ? 'bv-no-focus-ring' : '', // When horizontal or if a legend is rendered, add 'col-form-label' class
          // for correct sizing as Bootstrap has inconsistent font styling for
          // legend in non-horizontal form groups
          // See: https://github.com/twbs/bootstrap/issues/27805
          isHorizontal || isFieldset ? 'col-form-label' : '', // Emulate label padding top of `0` on legend when not horizontal
          !isHorizontal && isFieldset ? 'pt-0' : '', // If not horizontal and not a legend, we add 'd-block' class to label
          // so that label-align works
          !isHorizontal && !isFieldset ? 'd-block' : '', labelSize ? "col-form-label-".concat(labelSize) : '', this.labelAlignClasses, this.labelClass]
        }, [labelContent]);
      }
    }

    var $invalidFeedback = h();
    var invalidFeedbackContent = normalizeSlot(SLOT_NAME_INVALID_FEEDBACK) || this.invalidFeedback;
    var invalidFeedbackId = invalidFeedbackContent ? safeId('_BV_feedback_invalid_') : null;

    if (invalidFeedbackContent) {
      $invalidFeedback = h(BFormInvalidFeedback, {
        props: {
          ariaLive: feedbackAriaLive,
          id: invalidFeedbackId,
          role: feedbackAriaLive ? 'alert' : null,
          // If state is explicitly `false`, always show the feedback
          state: state,
          tooltip: tooltip
        },
        attrs: {
          tabindex: invalidFeedbackContent ? '-1' : null
        }
      }, [invalidFeedbackContent]);
    }

    var $validFeedback = h();
    var validFeedbackContent = normalizeSlot(SLOT_NAME_VALID_FEEDBACK) || this.validFeedback;
    var validFeedbackId = validFeedbackContent ? safeId('_BV_feedback_valid_') : null;

    if (validFeedbackContent) {
      $validFeedback = h(BFormValidFeedback, {
        props: {
          ariaLive: feedbackAriaLive,
          id: validFeedbackId,
          role: feedbackAriaLive ? 'alert' : null,
          // If state is explicitly `true`, always show the feedback
          state: state,
          tooltip: tooltip
        },
        attrs: {
          tabindex: validFeedbackContent ? '-1' : null
        }
      }, [validFeedbackContent]);
    }

    var $description = h();
    var descriptionContent = normalizeSlot(SLOT_NAME_DESCRIPTION) || this.description;
    var descriptionId = descriptionContent ? safeId('_BV_description_') : null;

    if (descriptionContent) {
      $description = h(BFormText, {
        attrs: {
          id: descriptionId,
          tabindex: '-1'
        }
      }, [descriptionContent]);
    } // Update `ariaDescribedby`
    // Screen readers will read out any content linked to by `aria-describedby`
    // even if the content is hidden with `display: none;`, hence we only include
    // feedback IDs if the form group's state is explicitly valid or invalid


    var ariaDescribedby = this.ariaDescribedby = [descriptionId, state === false ? invalidFeedbackId : null, state === true ? validFeedbackId : null].filter(identity).join(' ') || null;
    var $content = h(isHorizontal ? BCol : 'div', {
      props: isHorizontal ? this.contentColProps : {},
      ref: 'content'
    }, [normalizeSlot(SLOT_NAME_DEFAULT, {
      ariaDescribedby: ariaDescribedby,
      descriptionId: descriptionId,
      id: id,
      labelId: labelId
    }) || h(), $invalidFeedback, $validFeedback, $description]); // Return it wrapped in a form group
    // Note: Fieldsets do not support adding `row` or `form-row` directly
    // to them due to browser specific render issues, so we move the `form-row`
    // to an inner wrapper div when horizontal and using a fieldset

    return h(isFieldset ? 'fieldset' : isHorizontal ? BFormRow : 'div', {
      staticClass: 'form-group',
      class: [{
        'was-validated': this.validated
      }, this.stateClass],
      attrs: {
        id: id,
        disabled: isFieldset ? this.disabled : null,
        role: isFieldset ? null : 'group',
        'aria-invalid': this.computedAriaInvalid,
        // Only apply `aria-labelledby` if we are a horizontal fieldset
        // as the legend is no longer a direct child of fieldset
        'aria-labelledby': isFieldset && isHorizontal ? labelId : null
      }
    }, isHorizontal && isFieldset ? [h(BFormRow, [$label, $content])] : [$label, $content]);
  }
};