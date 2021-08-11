var _watch;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Tagged input form control
// Based loosely on https://adamwathan.me/renderless-components-in-vuejs/
import { Vue } from '../../vue';
import { NAME_FORM_TAGS } from '../../constants/components';
import { EVENT_NAME_TAG_STATE, EVENT_OPTIONS_PASSIVE, HOOK_EVENT_NAME_BEFORE_DESTROY } from '../../constants/events';
import { CODE_BACKSPACE, CODE_DELETE, CODE_ENTER } from '../../constants/key-codes';
import { PROP_TYPE_ARRAY, PROP_TYPE_ARRAY_OBJECT_STRING, PROP_TYPE_ARRAY_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_FUNCTION, PROP_TYPE_NUMBER, PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '../../constants/props';
import { RX_SPACES } from '../../constants/regex';
import { SLOT_NAME_DEFAULT, SLOT_NAME_ADD_BUTTON_TEXT } from '../../constants/slots';
import { arrayIncludes, concat } from '../../utils/array';
import { cssEscape } from '../../utils/css-escape';
import { attemptBlur, attemptFocus, closest, isActiveElement, matches, requestAF, select } from '../../utils/dom';
import { eventOn, eventOff, stopEvent } from '../../utils/events';
import { identity } from '../../utils/identity';
import { isEvent, isNumber, isString } from '../../utils/inspect';
import { looseEqual } from '../../utils/loose-equal';
import { makeModelMixin } from '../../utils/model';
import { pick, sortKeys } from '../../utils/object';
import { hasPropFunction, makeProp, makePropsConfigurable } from '../../utils/props';
import { escapeRegExp, toString, trim, trimLeft } from '../../utils/string';
import { formControlMixin, props as formControlProps } from '../../mixins/form-control';
import { formSizeMixin, props as formSizeProps } from '../../mixins/form-size';
import { formStateMixin, props as formStateProps } from '../../mixins/form-state';
import { idMixin, props as idProps } from '../../mixins/id';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { BButton } from '../button/button';
import { BFormInvalidFeedback } from '../form/form-invalid-feedback';
import { BFormText } from '../form/form-text';
import { BFormTag } from './form-tag'; // --- Constants ---

var _makeModelMixin = makeModelMixin('value', {
  type: PROP_TYPE_ARRAY,
  defaultValue: []
}),
    modelMixin = _makeModelMixin.mixin,
    modelProps = _makeModelMixin.props,
    MODEL_PROP_NAME = _makeModelMixin.prop,
    MODEL_EVENT_NAME = _makeModelMixin.event; // Supported input types (for built in input)


var TYPES = ['text', 'email', 'tel', 'url', 'number']; // Default ignore input focus selector

var DEFAULT_INPUT_FOCUS_SELECTOR = ['.b-form-tag', 'button', 'input', 'select'].join(' '); // --- Helper methods ---
// Escape special chars in string and replace
// contiguous spaces with a whitespace match

var escapeRegExpChars = function escapeRegExpChars(str) {
  return escapeRegExp(str).replace(RX_SPACES, '\\s');
}; // Remove leading/trailing spaces from array of tags and remove duplicates


var cleanTags = function cleanTags(tags) {
  return concat(tags).map(function (tag) {
    return trim(toString(tag));
  }).filter(function (tag, index, arr) {
    return tag.length > 0 && arr.indexOf(tag) === index;
  });
}; // Processes an input/change event, normalizing string or event argument


var processEventValue = function processEventValue(event) {
  return isString(event) ? event : isEvent(event) ? event.target.value || '' : '';
}; // Returns a fresh empty `tagsState` object


var cleanTagsState = function cleanTagsState() {
  return {
    all: [],
    valid: [],
    invalid: [],
    duplicate: []
  };
}; // --- Props ---


var props = makePropsConfigurable(sortKeys(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, idProps), modelProps), formControlProps), formSizeProps), formStateProps), {}, {
  addButtonText: makeProp(PROP_TYPE_STRING, 'Add'),
  addButtonVariant: makeProp(PROP_TYPE_STRING, 'outline-secondary'),
  // Enable change event triggering tag addition
  // Handy if using <select> as the input
  addOnChange: makeProp(PROP_TYPE_BOOLEAN, false),
  duplicateTagText: makeProp(PROP_TYPE_STRING, 'Duplicate tag(s)'),
  // Disable the input focus behavior when clicking
  // on element matching the selector (or selectors)
  ignoreInputFocusSelector: makeProp(PROP_TYPE_ARRAY_STRING, DEFAULT_INPUT_FOCUS_SELECTOR),
  // Additional attributes to add to the input element
  inputAttrs: makeProp(PROP_TYPE_OBJECT, {}),
  inputClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  inputId: makeProp(PROP_TYPE_STRING),
  inputType: makeProp(PROP_TYPE_STRING, 'text', function (value) {
    return arrayIncludes(TYPES, value);
  }),
  invalidTagText: makeProp(PROP_TYPE_STRING, 'Invalid tag(s)'),
  limit: makeProp(PROP_TYPE_NUMBER),
  limitTagsText: makeProp(PROP_TYPE_STRING, 'Tag limit reached'),
  // Disable ENTER key from triggering tag addition
  noAddOnEnter: makeProp(PROP_TYPE_BOOLEAN, false),
  // Disable the focus ring on the root element
  noOuterFocus: makeProp(PROP_TYPE_BOOLEAN, false),
  noTagRemove: makeProp(PROP_TYPE_BOOLEAN, false),
  placeholder: makeProp(PROP_TYPE_STRING, 'Add tag...'),
  // Enable deleting last tag in list when CODE_BACKSPACE is
  // pressed and input is empty
  removeOnDelete: makeProp(PROP_TYPE_BOOLEAN, false),
  // Character (or characters) that trigger adding tags
  separator: makeProp(PROP_TYPE_ARRAY_STRING),
  tagClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
  tagPills: makeProp(PROP_TYPE_BOOLEAN, false),
  tagRemoveLabel: makeProp(PROP_TYPE_STRING, 'Remove tag'),
  tagRemovedLabel: makeProp(PROP_TYPE_STRING, 'Tag removed'),
  tagValidator: makeProp(PROP_TYPE_FUNCTION),
  tagVariant: makeProp(PROP_TYPE_STRING, 'secondary')
})), NAME_FORM_TAGS); // --- Main component ---
// @vue/component

export var BFormTags = /*#__PURE__*/Vue.extend({
  name: NAME_FORM_TAGS,
  mixins: [idMixin, modelMixin, formControlMixin, formSizeMixin, formStateMixin, normalizeSlotMixin],
  props: props,
  data: function data() {
    return {
      hasFocus: false,
      newTag: '',
      tags: [],
      // Tags that were removed
      removedTags: [],
      // Populated when tags are parsed
      tagsState: cleanTagsState()
    };
  },
  computed: {
    computedInputId: function computedInputId() {
      return this.inputId || this.safeId('__input__');
    },
    computedInputType: function computedInputType() {
      // We only allow certain types
      return arrayIncludes(TYPES, this.inputType) ? this.inputType : 'text';
    },
    computedInputAttrs: function computedInputAttrs() {
      var disabled = this.disabled,
          form = this.form;
      return _objectSpread(_objectSpread({}, this.inputAttrs), {}, {
        // Must have attributes
        id: this.computedInputId,
        value: this.newTag,
        disabled: disabled,
        form: form
      });
    },
    computedInputHandlers: function computedInputHandlers() {
      return {
        input: this.onInputInput,
        change: this.onInputChange,
        keydown: this.onInputKeydown,
        reset: this.reset
      };
    },
    computedSeparator: function computedSeparator() {
      // Merge the array into a string
      return concat(this.separator).filter(isString).filter(identity).join('');
    },
    computedSeparatorRegExp: function computedSeparatorRegExp() {
      // We use a computed prop here to precompile the RegExp
      // The RegExp is a character class RE in the form of `/[abc]+/`
      // where a, b, and c are the valid separator characters
      // -> `tags = str.split(/[abc]+/).filter(t => t)`
      var separator = this.computedSeparator;
      return separator ? new RegExp("[".concat(escapeRegExpChars(separator), "]+")) : null;
    },
    computedJoiner: function computedJoiner() {
      // When tag(s) are invalid or duplicate, we leave them
      // in the input so that the user can see them
      // If there are more than one tag in the input, we use the
      // first separator character as the separator in the input
      // We append a space if the first separator is not a space
      var joiner = this.computedSeparator.charAt(0);
      return joiner !== ' ' ? "".concat(joiner, " ") : joiner;
    },
    computeIgnoreInputFocusSelector: function computeIgnoreInputFocusSelector() {
      // Normalize to an single selector with selectors separated by `,`
      return concat(this.ignoreInputFocusSelector).filter(identity).join(',').trim();
    },
    disableAddButton: function disableAddButton() {
      var _this = this;

      // If 'Add' button should be disabled
      // If the input contains at least one tag that can
      // be added, then the 'Add' button should be enabled
      var newTag = trim(this.newTag);
      return newTag === '' || !this.splitTags(newTag).some(function (t) {
        return !arrayIncludes(_this.tags, t) && _this.validateTag(t);
      });
    },
    duplicateTags: function duplicateTags() {
      return this.tagsState.duplicate;
    },
    hasDuplicateTags: function hasDuplicateTags() {
      return this.duplicateTags.length > 0;
    },
    invalidTags: function invalidTags() {
      return this.tagsState.invalid;
    },
    hasInvalidTags: function hasInvalidTags() {
      return this.invalidTags.length > 0;
    },
    isLimitReached: function isLimitReached() {
      var limit = this.limit;
      return isNumber(limit) && limit >= 0 && this.tags.length >= limit;
    }
  },
  watch: (_watch = {}, _defineProperty(_watch, MODEL_PROP_NAME, function (newValue) {
    this.tags = cleanTags(newValue);
  }), _defineProperty(_watch, "tags", function tags(newValue, oldValue) {
    // Update the `v-model` (if it differs from the value prop)
    if (!looseEqual(newValue, this[MODEL_PROP_NAME])) {
      this.$emit(MODEL_EVENT_NAME, newValue);
    }

    if (!looseEqual(newValue, oldValue)) {
      newValue = concat(newValue).filter(identity);
      oldValue = concat(oldValue).filter(identity);
      this.removedTags = oldValue.filter(function (old) {
        return !arrayIncludes(newValue, old);
      });
    }
  }), _defineProperty(_watch, "tagsState", function tagsState(newValue, oldValue) {
    // Emit a tag-state event when the `tagsState` object changes
    if (!looseEqual(newValue, oldValue)) {
      this.$emit(EVENT_NAME_TAG_STATE, newValue.valid, newValue.invalid, newValue.duplicate);
    }
  }), _watch),
  created: function created() {
    // We do this in created to make sure an input event emits
    // if the cleaned tags are not equal to the value prop
    this.tags = cleanTags(this[MODEL_PROP_NAME]);
  },
  mounted: function mounted() {
    var _this2 = this;

    // Listen for form reset events, to reset the tags input
    var $form = closest('form', this.$el);

    if ($form) {
      eventOn($form, 'reset', this.reset, EVENT_OPTIONS_PASSIVE);
      this.$on(HOOK_EVENT_NAME_BEFORE_DESTROY, function () {
        eventOff($form, 'reset', _this2.reset, EVENT_OPTIONS_PASSIVE);
      });
    }
  },
  methods: {
    addTag: function addTag(newTag) {
      newTag = isString(newTag) ? newTag : this.newTag;
      /* istanbul ignore next */

      if (this.disabled || trim(newTag) === '' || this.isLimitReached) {
        // Early exit
        return;
      }

      var parsed = this.parseTags(newTag); // Add any new tags to the `tags` array, or if the
      // array of `allTags` is empty, we clear the input

      if (parsed.valid.length > 0 || parsed.all.length === 0) {
        // Clear the user input element (and leave in any invalid/duplicate tag(s)

        /* istanbul ignore if: full testing to be added later */
        if (matches(this.getInput(), 'select')) {
          // The following is needed to properly
          // work with `<select>` elements
          this.newTag = '';
        } else {
          var invalidAndDuplicates = [].concat(_toConsumableArray(parsed.invalid), _toConsumableArray(parsed.duplicate));
          this.newTag = parsed.all.filter(function (tag) {
            return arrayIncludes(invalidAndDuplicates, tag);
          }).join(this.computedJoiner).concat(invalidAndDuplicates.length > 0 ? this.computedJoiner.charAt(0) : '');
        }
      }

      if (parsed.valid.length > 0) {
        // We add the new tags in one atomic operation
        // to trigger reactivity once (instead of once per tag)
        // We do this after we update the new tag input value
        // `concat()` can be faster than array spread, when both args are arrays
        this.tags = concat(this.tags, parsed.valid);
      }

      this.tagsState = parsed; // Attempt to re-focus the input (specifically for when using the Add
      // button, as the button disappears after successfully adding a tag

      this.focus();
    },
    removeTag: function removeTag(tag) {
      var _this3 = this;

      /* istanbul ignore next */
      if (this.disabled) {
        return;
      } // TODO:
      //   Add `onRemoveTag(tag)` user method, which if returns `false`
      //   will prevent the tag from being removed (i.e. confirmation)
      //   Or emit cancelable `BvEvent`


      this.tags = this.tags.filter(function (t) {
        return t !== tag;
      }); // Return focus to the input (if possible)

      this.$nextTick(function () {
        _this3.focus();
      });
    },
    reset: function reset() {
      var _this4 = this;

      this.newTag = '';
      this.tags = [];
      this.$nextTick(function () {
        _this4.removedTags = [];
        _this4.tagsState = cleanTagsState();
      });
    },
    // --- Input element event handlers ---
    onInputInput: function onInputInput(event) {
      /* istanbul ignore next: hard to test composition events */
      if (this.disabled || isEvent(event) && event.target.composing) {
        // `event.target.composing` is set by Vue (`v-model` directive)
        // https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/directives/model.js
        return;
      }

      var newTag = processEventValue(event);
      var separatorRe = this.computedSeparatorRegExp;

      if (this.newTag !== newTag) {
        this.newTag = newTag;
      } // We ignore leading whitespace for the following


      newTag = trimLeft(newTag);

      if (separatorRe && separatorRe.test(newTag.slice(-1))) {
        // A trailing separator character was entered, so add the tag(s)
        // Note: More than one tag on input event is possible via copy/paste
        this.addTag();
      } else {
        // Validate (parse tags) on input event
        this.tagsState = newTag === '' ? cleanTagsState() : this.parseTags(newTag);
      }
    },
    onInputChange: function onInputChange(event) {
      // Change is triggered on `<input>` blur, or `<select>` selected
      // This event is opt-in
      if (!this.disabled && this.addOnChange) {
        var newTag = processEventValue(event);
        /* istanbul ignore next */

        if (this.newTag !== newTag) {
          this.newTag = newTag;
        }

        this.addTag();
      }
    },
    onInputKeydown: function onInputKeydown(event) {
      // Early exit

      /* istanbul ignore next */
      if (this.disabled || !isEvent(event)) {
        return;
      }

      var keyCode = event.keyCode;
      var value = event.target.value || '';
      /* istanbul ignore else: testing to be added later */

      if (!this.noAddOnEnter && keyCode === CODE_ENTER) {
        // Attempt to add the tag when user presses enter
        stopEvent(event, {
          propagation: false
        });
        this.addTag();
      } else if (this.removeOnDelete && (keyCode === CODE_BACKSPACE || keyCode === CODE_DELETE) && value === '') {
        // Remove the last tag if the user pressed backspace/delete and the input is empty
        stopEvent(event, {
          propagation: false
        });
        this.tags = this.tags.slice(0, -1);
      }
    },
    // --- Wrapper event handlers ---
    onClick: function onClick(event) {
      var _this5 = this;

      var ignoreFocusSelector = this.computeIgnoreInputFocusSelector;
      var target = event.target;

      if (!this.disabled && !isActiveElement(target) && (!ignoreFocusSelector || !closest(ignoreFocusSelector, target, true))) {
        this.$nextTick(function () {
          _this5.focus();
        });
      }
    },
    onFocusin: function onFocusin() {
      this.hasFocus = true;
    },
    onFocusout: function onFocusout() {
      this.hasFocus = false;
    },
    handleAutofocus: function handleAutofocus() {
      var _this6 = this;

      this.$nextTick(function () {
        requestAF(function () {
          if (_this6.autofocus && !_this6.disabled) {
            _this6.focus();
          }
        });
      });
    },
    // --- Public methods ---
    focus: function focus() {
      if (!this.disabled) {
        attemptFocus(this.getInput());
      }
    },
    blur: function blur() {
      if (!this.disabled) {
        attemptBlur(this.getInput());
      }
    },
    // --- Private methods ---
    splitTags: function splitTags(newTag) {
      // Split the input into an array of raw tags
      newTag = toString(newTag);
      var separatorRe = this.computedSeparatorRegExp; // Split the tag(s) via the optional separator
      // Normally only a single tag is provided, but copy/paste
      // can enter multiple tags in a single operation

      return (separatorRe ? newTag.split(separatorRe) : [newTag]).map(trim).filter(identity);
    },
    parseTags: function parseTags(newTag) {
      var _this7 = this;

      // Takes `newTag` value and parses it into `validTags`,
      // `invalidTags`, and duplicate tags as an object
      // Split the input into raw tags
      var tags = this.splitTags(newTag); // Base results

      var parsed = {
        all: tags,
        valid: [],
        invalid: [],
        duplicate: []
      }; // Parse the unique tags

      tags.forEach(function (tag) {
        if (arrayIncludes(_this7.tags, tag) || arrayIncludes(parsed.valid, tag)) {
          // Unique duplicate tags
          if (!arrayIncludes(parsed.duplicate, tag)) {
            parsed.duplicate.push(tag);
          }
        } else if (_this7.validateTag(tag)) {
          // We only add unique/valid tags
          parsed.valid.push(tag);
        } else {
          // Unique invalid tags
          if (!arrayIncludes(parsed.invalid, tag)) {
            parsed.invalid.push(tag);
          }
        }
      });
      return parsed;
    },
    validateTag: function validateTag(tag) {
      var tagValidator = this.tagValidator;
      return hasPropFunction(tagValidator) ? tagValidator(tag) : true;
    },
    getInput: function getInput() {
      // Returns the input element reference (or null if not found)
      // We need to escape `computedInputId` since it can be user-provided
      return select("#".concat(cssEscape(this.computedInputId)), this.$el);
    },
    // Default User Interface render
    defaultRender: function defaultRender(_ref) {
      var addButtonText = _ref.addButtonText,
          addButtonVariant = _ref.addButtonVariant,
          addTag = _ref.addTag,
          disableAddButton = _ref.disableAddButton,
          disabled = _ref.disabled,
          duplicateTagText = _ref.duplicateTagText,
          inputAttrs = _ref.inputAttrs,
          inputClass = _ref.inputClass,
          inputHandlers = _ref.inputHandlers,
          inputType = _ref.inputType,
          invalidTagText = _ref.invalidTagText,
          isDuplicate = _ref.isDuplicate,
          isInvalid = _ref.isInvalid,
          isLimitReached = _ref.isLimitReached,
          limitTagsText = _ref.limitTagsText,
          noTagRemove = _ref.noTagRemove,
          placeholder = _ref.placeholder,
          removeTag = _ref.removeTag,
          tagClass = _ref.tagClass,
          tagPills = _ref.tagPills,
          tagRemoveLabel = _ref.tagRemoveLabel,
          tagVariant = _ref.tagVariant,
          tags = _ref.tags;
      var h = this.$createElement; // Make the list of tags

      var $tags = tags.map(function (tag) {
        tag = toString(tag);
        return h(BFormTag, {
          class: tagClass,
          // `BFormTag` will auto generate an ID
          // so we do not need to set the ID prop
          props: {
            disabled: disabled,
            noRemove: noTagRemove,
            pill: tagPills,
            removeLabel: tagRemoveLabel,
            tag: 'li',
            title: tag,
            variant: tagVariant
          },
          on: {
            remove: function remove() {
              return removeTag(tag);
            }
          },
          key: "tags_".concat(tag)
        }, tag);
      }); // Feedback IDs if needed

      var invalidFeedbackId = invalidTagText && isInvalid ? this.safeId('__invalid_feedback__') : null;
      var duplicateFeedbackId = duplicateTagText && isDuplicate ? this.safeId('__duplicate_feedback__') : null;
      var limitFeedbackId = limitTagsText && isLimitReached ? this.safeId('__limit_feedback__') : null; // Compute the `aria-describedby` attribute value

      var ariaDescribedby = [inputAttrs['aria-describedby'], invalidFeedbackId, duplicateFeedbackId, limitFeedbackId].filter(identity).join(' '); // Input

      var $input = h('input', {
        staticClass: 'b-form-tags-input w-100 flex-grow-1 p-0 m-0 bg-transparent border-0',
        class: inputClass,
        style: {
          outline: 0,
          minWidth: '5rem'
        },
        attrs: _objectSpread(_objectSpread({}, inputAttrs), {}, {
          'aria-describedby': ariaDescribedby || null,
          type: inputType,
          placeholder: placeholder || null
        }),
        domProps: {
          value: inputAttrs.value
        },
        on: inputHandlers,
        // Directive needed to get `event.target.composing` set (if needed)
        directives: [{
          name: 'model',
          value: inputAttrs.value
        }],
        ref: 'input'
      }); // Add button

      var $button = h(BButton, {
        staticClass: 'b-form-tags-button py-0',
        class: {
          // Only show the button if the tag can be added
          // We use the `invisible` class instead of not rendering
          // the button, so that we maintain layout to prevent
          // the user input from jumping around
          invisible: disableAddButton
        },
        style: {
          fontSize: '90%'
        },
        props: {
          disabled: disableAddButton || isLimitReached,
          variant: addButtonVariant
        },
        on: {
          click: function click() {
            return addTag();
          }
        },
        ref: 'button'
      }, [this.normalizeSlot(SLOT_NAME_ADD_BUTTON_TEXT) || addButtonText]); // ID of the tags + input `<ul>` list
      // Note we could concatenate `inputAttrs.id` with '__tag_list__'
      // but `inputId` may be `null` until after mount
      // `safeId()` returns `null`, if no user provided ID,
      // until after mount when a unique ID is generated

      var tagListId = this.safeId('__tag_list__');
      var $field = h('li', {
        staticClass: 'b-from-tags-field flex-grow-1',
        attrs: {
          role: 'none',
          'aria-live': 'off',
          'aria-controls': tagListId
        },
        key: 'tags_field'
      }, [h('div', {
        staticClass: 'd-flex',
        attrs: {
          role: 'group'
        }
      }, [$input, $button])]); // Wrap in an unordered list element (we use a list for accessibility)

      var $ul = h('ul', {
        staticClass: 'b-form-tags-list list-unstyled mb-0 d-flex flex-wrap align-items-center',
        attrs: {
          id: tagListId
        },
        key: 'tags_list'
      }, [$tags, $field]); // Assemble the feedback

      var $feedback = h();

      if (invalidTagText || duplicateTagText || limitTagsText) {
        // Add an aria live region for the invalid/duplicate tag
        // messages if the user has not disabled the messages
        var joiner = this.computedJoiner; // Invalid tag feedback if needed (error)

        var $invalid = h();

        if (invalidFeedbackId) {
          $invalid = h(BFormInvalidFeedback, {
            props: {
              id: invalidFeedbackId,
              forceShow: true
            },
            key: 'tags_invalid_feedback'
          }, [this.invalidTagText, ': ', this.invalidTags.join(joiner)]);
        } // Duplicate tag feedback if needed (warning, not error)


        var $duplicate = h();

        if (duplicateFeedbackId) {
          $duplicate = h(BFormText, {
            props: {
              id: duplicateFeedbackId
            },
            key: 'tags_duplicate_feedback'
          }, [this.duplicateTagText, ': ', this.duplicateTags.join(joiner)]);
        } // Limit tags feedback if needed (warning, not error)


        var $limit = h();

        if (limitFeedbackId) {
          $limit = h(BFormText, {
            props: {
              id: limitFeedbackId
            },
            key: 'tags_limit_feedback'
          }, [limitTagsText]);
        }

        $feedback = h('div', {
          attrs: {
            'aria-live': 'polite',
            'aria-atomic': 'true'
          },
          key: 'tags_feedback'
        }, [$invalid, $duplicate, $limit]);
      } // Return the content


      return [$ul, $feedback];
    }
  },
  render: function render(h) {
    var name = this.name,
        disabled = this.disabled,
        required = this.required,
        form = this.form,
        tags = this.tags,
        computedInputId = this.computedInputId,
        hasFocus = this.hasFocus,
        noOuterFocus = this.noOuterFocus; // Scoped slot properties

    var scope = _objectSpread({
      // Array of tags (shallow copy to prevent mutations)
      tags: tags.slice(),
      // <input> v-bind:inputAttrs
      inputAttrs: this.computedInputAttrs,
      // We don't include this in the attrs, as users may want to override this
      inputType: this.computedInputType,
      // <input> v-on:inputHandlers
      inputHandlers: this.computedInputHandlers,
      // Methods
      removeTag: this.removeTag,
      addTag: this.addTag,
      reset: this.reset,
      // <input> :id="inputId"
      inputId: computedInputId,
      // Invalid/Duplicate state information
      isInvalid: this.hasInvalidTags,
      invalidTags: this.invalidTags.slice(),
      isDuplicate: this.hasDuplicateTags,
      duplicateTags: this.duplicateTags.slice(),
      isLimitReached: this.isLimitReached,
      // If the 'Add' button should be disabled
      disableAddButton: this.disableAddButton
    }, pick(this.$props, ['addButtonText', 'addButtonVariant', 'disabled', 'duplicateTagText', 'form', 'inputClass', 'invalidTagText', 'limit', 'limitTagsText', 'noTagRemove', 'placeholder', 'required', 'separator', 'size', 'state', 'tagClass', 'tagPills', 'tagRemoveLabel', 'tagVariant'])); // Generate the user interface


    var $content = this.normalizeSlot(SLOT_NAME_DEFAULT, scope) || this.defaultRender(scope); // Generate the `aria-live` region for the current value(s)

    var $output = h('output', {
      staticClass: 'sr-only',
      attrs: {
        id: this.safeId('__selected_tags__'),
        role: 'status',
        for: computedInputId,
        'aria-live': hasFocus ? 'polite' : 'off',
        'aria-atomic': 'true',
        'aria-relevant': 'additions text'
      }
    }, this.tags.join(', ')); // Removed tag live region

    var $removed = h('div', {
      staticClass: 'sr-only',
      attrs: {
        id: this.safeId('__removed_tags__'),
        role: 'status',
        'aria-live': hasFocus ? 'assertive' : 'off',
        'aria-atomic': 'true'
      }
    }, this.removedTags.length > 0 ? "(".concat(this.tagRemovedLabel, ") ").concat(this.removedTags.join(', ')) : ''); // Add hidden inputs for form submission

    var $hidden = h();

    if (name && !disabled) {
      // We add hidden inputs for each tag if a name is provided
      // When there are currently no tags, a visually hidden input
      // with empty value is rendered for proper required handling
      var hasTags = tags.length > 0;
      $hidden = (hasTags ? tags : ['']).map(function (tag) {
        return h('input', {
          class: {
            'sr-only': !hasTags
          },
          attrs: {
            type: hasTags ? 'hidden' : 'text',
            value: tag,
            required: required,
            name: name,
            form: form
          },
          key: "tag_input_".concat(tag)
        });
      });
    } // Return the rendered output


    return h('div', {
      staticClass: 'b-form-tags form-control h-auto',
      class: [{
        focus: hasFocus && !noOuterFocus && !disabled,
        disabled: disabled
      }, this.sizeFormClass, this.stateClass],
      attrs: {
        id: this.safeId(),
        role: 'group',
        tabindex: disabled || noOuterFocus ? null : '-1',
        'aria-describedby': this.safeId('__selected_tags__')
      },
      on: {
        click: this.onClick,
        focusin: this.onFocusin,
        focusout: this.onFocusout
      }
    }, [$output, $removed, $content, $hidden]);
  }
});