function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { Vue as OurVue } from '../vue';
import { NAME, PROP_NAME } from '../constants/config';
import { cloneDeep } from './clone-deep';
import { getRaw } from './get';
import { isArray, isPlainObject, isString, isUndefined } from './inspect';
import { getOwnPropertyNames } from './object';
import { warn } from './warn'; // Config manager class

var BvConfig = /*#__PURE__*/function () {
  function BvConfig() {
    _classCallCheck(this, BvConfig);

    this.$_config = {};
  } // Method to merge in user config parameters


  _createClass(BvConfig, [{
    key: "setConfig",
    value: function setConfig() {
      var _this = this;

      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      /* istanbul ignore next */
      if (!isPlainObject(config)) {
        return;
      }

      var configKeys = getOwnPropertyNames(config);
      configKeys.forEach(function (key) {
        /* istanbul ignore next */
        var subConfig = config[key];

        if (key === 'breakpoints') {
          /* istanbul ignore if */
          if (!isArray(subConfig) || subConfig.length < 2 || subConfig.some(function (b) {
            return !isString(b) || b.length === 0;
          })) {
            warn('"breakpoints" must be an array of at least 2 breakpoint names', NAME);
          } else {
            _this.$_config[key] = cloneDeep(subConfig);
          }
        } else if (isPlainObject(subConfig)) {
          // Component prop defaults
          _this.$_config[key] = getOwnPropertyNames(subConfig).reduce(function (config, prop) {
            if (!isUndefined(subConfig[prop])) {
              config[prop] = cloneDeep(subConfig[prop]);
            }

            return config;
          }, _this.$_config[key] || {});
        }
      });
    } // Clear the config

  }, {
    key: "resetConfig",
    value: function resetConfig() {
      this.$_config = {};
    } // Returns a deep copy of the user config

  }, {
    key: "getConfig",
    value: function getConfig() {
      return cloneDeep(this.$_config);
    } // Returns a deep copy of the config value

  }, {
    key: "getConfigValue",
    value: function getConfigValue(key) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      return cloneDeep(getRaw(this.$_config, key, defaultValue));
    }
  }]);

  return BvConfig;
}(); // Method for applying a global config


export var setConfig = function setConfig() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var Vue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : OurVue;
  // Ensure we have a `$bvConfig` Object on the Vue prototype
  // We set on Vue and OurVue just in case consumer has not set an alias of `vue`
  Vue.prototype[PROP_NAME] = OurVue.prototype[PROP_NAME] = Vue.prototype[PROP_NAME] || OurVue.prototype[PROP_NAME] || new BvConfig(); // Apply the config values

  Vue.prototype[PROP_NAME].setConfig(config);
}; // Method for resetting the user config
// Exported for testing purposes only

export var resetConfig = function resetConfig() {
  if (OurVue.prototype[PROP_NAME] && OurVue.prototype[PROP_NAME].resetConfig) {
    OurVue.prototype[PROP_NAME].resetConfig();
  }
};