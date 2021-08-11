function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../vue';
import { cloneDeep } from './clone-deep';
import { looseEqual } from './loose-equal';
import { hasOwnProperty, keys } from './object';

var isEmpty = function isEmpty(value) {
  return !value || keys(value).length === 0;
};

export var makePropWatcher = function makePropWatcher(propName) {
  return {
    handler: function handler(newValue, oldValue) {
      if (looseEqual(newValue, oldValue)) {
        return;
      }

      if (isEmpty(newValue) || isEmpty(oldValue)) {
        this[propName] = cloneDeep(newValue);
        return;
      }

      for (var key in oldValue) {
        if (!hasOwnProperty(newValue, key)) {
          this.$delete(this.$data[propName], key);
        }
      }

      for (var _key in newValue) {
        this.$set(this.$data[propName], _key, newValue[_key]);
      }
    }
  };
};
export var makePropCacheMixin = function makePropCacheMixin(propName, proxyPropName) {
  return Vue.extend({
    data: function data() {
      return _defineProperty({}, proxyPropName, cloneDeep(this[propName]));
    },
    watch: _defineProperty({}, propName, makePropWatcher(proxyPropName))
  });
};