function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * Plugin for adding `$bvToast` property to all Vue instances
 */
import { NAME_TOAST, NAME_TOASTER, NAME_TOAST_POP } from '../../../constants/components';
import { EVENT_NAME_DESTROYED, EVENT_NAME_HIDDEN, EVENT_NAME_HIDE, EVENT_NAME_SHOW, HOOK_EVENT_NAME_DESTROYED } from '../../../constants/events';
import { concat } from '../../../utils/array';
import { getComponentConfig } from '../../../utils/config';
import { requestAF } from '../../../utils/dom';
import { getRootEventName, getRootActionEventName } from '../../../utils/events';
import { isUndefined, isString } from '../../../utils/inspect';
import { assign, defineProperties, defineProperty, hasOwnProperty, keys, omit, readonlyDescriptor } from '../../../utils/object';
import { pluginFactory } from '../../../utils/plugins';
import { warn, warnNotClient } from '../../../utils/warn';
import { BToast, props as toastProps } from '../toast'; // --- Constants ---

var PROP_NAME = '$bvToast';
var PROP_NAME_PRIV = '_bv__toast'; // Base toast props that are allowed
// Some may be ignored or overridden on some message boxes
// Prop ID is allowed, but really only should be used for testing
// We need to add it in explicitly as it comes from the `idMixin`

var BASE_PROPS = ['id'].concat(_toConsumableArray(keys(omit(toastProps, ['static', 'visible'])))); // Map prop names to toast slot names

var propsToSlots = {
  toastContent: 'default',
  title: 'toast-title'
}; // --- Helper methods ---
// Method to filter only recognized props that are not undefined

var filterOptions = function filterOptions(options) {
  return BASE_PROPS.reduce(function (memo, key) {
    if (!isUndefined(options[key])) {
      memo[key] = options[key];
    }

    return memo;
  }, {});
}; // Method to install `$bvToast` VM injection


var plugin = function plugin(Vue) {
  // Create a private sub-component constructor that
  // extends BToast and self-destructs after hidden
  // @vue/component
  var BVToastPop = Vue.extend({
    name: NAME_TOAST_POP,
    extends: BToast,
    destroyed: function destroyed() {
      // Make sure we not in document any more
      var $el = this.$el;

      if ($el && $el.parentNode) {
        $el.parentNode.removeChild($el);
      }
    },
    mounted: function mounted() {
      var _this = this;

      // Self destruct handler
      var handleDestroy = function handleDestroy() {
        // Ensure the toast has been force hidden
        _this.localShow = false;
        _this.doRender = false;

        _this.$nextTick(function () {
          _this.$nextTick(function () {
            // In a `requestAF()` to release control back to application
            // and to allow the portal-target time to remove the content
            requestAF(function () {
              _this.$destroy();
            });
          });
        });
      }; // Self destruct if parent destroyed


      this.$parent.$once(HOOK_EVENT_NAME_DESTROYED, handleDestroy); // Self destruct after hidden

      this.$once(EVENT_NAME_HIDDEN, handleDestroy); // Self destruct when toaster is destroyed

      this.listenOnRoot(getRootEventName(NAME_TOASTER, EVENT_NAME_DESTROYED), function (toaster) {
        /* istanbul ignore next: hard to test */
        if (toaster === _this.toaster) {
          handleDestroy();
        }
      });
    }
  }); // Private method to generate the on-demand toast

  var makeToast = function makeToast(props, $parent) {
    if (warnNotClient(PROP_NAME)) {
      /* istanbul ignore next */
      return;
    } // Create an instance of `BVToastPop` component


    var toast = new BVToastPop({
      // We set parent as the local VM so these toasts can emit events on the
      // app `$root`, and it ensures `BToast` is destroyed when parent is destroyed
      parent: $parent,
      propsData: _objectSpread(_objectSpread(_objectSpread({}, filterOptions(getComponentConfig(NAME_TOAST))), omit(props, keys(propsToSlots))), {}, {
        // Props that can't be overridden
        static: false,
        visible: true
      })
    }); // Convert certain props to slots

    keys(propsToSlots).forEach(function (prop) {
      var value = props[prop];

      if (!isUndefined(value)) {
        // Can be a string, or array of VNodes
        if (prop === 'title' && isString(value)) {
          // Special case for title if it is a string, we wrap in a <strong>
          value = [$parent.$createElement('strong', {
            class: 'mr-2'
          }, value)];
        }

        toast.$slots[propsToSlots[prop]] = concat(value);
      }
    }); // Create a mount point (a DIV) and mount it (which triggers the show)

    var div = document.createElement('div');
    document.body.appendChild(div);
    toast.$mount(div);
  }; // Declare BvToast instance property class


  var BvToast = /*#__PURE__*/function () {
    function BvToast(vm) {
      _classCallCheck(this, BvToast);

      // Assign the new properties to this instance
      assign(this, {
        _vm: vm,
        _root: vm.$root
      }); // Set these properties as read-only and non-enumerable

      defineProperties(this, {
        _vm: readonlyDescriptor(),
        _root: readonlyDescriptor()
      });
    } // --- Public Instance methods ---
    // Opens a user defined toast and returns immediately


    _createClass(BvToast, [{
      key: "toast",
      value: function toast(content) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!content || warnNotClient(PROP_NAME)) {
          /* istanbul ignore next */
          return;
        }

        makeToast(_objectSpread(_objectSpread({}, filterOptions(options)), {}, {
          toastContent: content
        }), this._vm);
      } // shows a `<b-toast>` component with the specified ID

    }, {
      key: "show",
      value: function show(id) {
        if (id) {
          this._root.$emit(getRootActionEventName(NAME_TOAST, EVENT_NAME_SHOW), id);
        }
      } // Hide a toast with specified ID, or if not ID all toasts

    }, {
      key: "hide",
      value: function hide() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        this._root.$emit(getRootActionEventName(NAME_TOAST, EVENT_NAME_HIDE), id);
      }
    }]);

    return BvToast;
  }(); // Add our instance mixin


  Vue.mixin({
    beforeCreate: function beforeCreate() {
      // Because we need access to `$root` for `$emits`, and VM for parenting,
      // we have to create a fresh instance of `BvToast` for each VM
      this[PROP_NAME_PRIV] = new BvToast(this);
    }
  }); // Define our read-only `$bvToast` instance property
  // Placed in an if just in case in HMR mode

  if (!hasOwnProperty(Vue.prototype, PROP_NAME)) {
    defineProperty(Vue.prototype, PROP_NAME, {
      get: function get() {
        /* istanbul ignore next */
        if (!this || !this[PROP_NAME_PRIV]) {
          warn("\"".concat(PROP_NAME, "\" must be accessed from a Vue instance \"this\" context."), NAME_TOAST);
        }

        return this[PROP_NAME_PRIV];
      }
    });
  }
};

export var BVToastPlugin = /*#__PURE__*/pluginFactory({
  plugins: {
    plugin: plugin
  }
});