function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue } from '../vue';
import { getScopeId } from '../utils/get-scope-id'; // @vue/component

export var scopedStyleMixin = Vue.extend({
  computed: {
    scopedStyleAttrs: function scopedStyleAttrs() {
      var scopeId = getScopeId(this.$parent);
      return scopeId ? _defineProperty({}, scopeId, '') : {};
    }
  }
});