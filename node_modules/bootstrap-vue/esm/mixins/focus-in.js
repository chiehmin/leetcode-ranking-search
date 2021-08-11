import { Vue } from '../vue';
import { EVENT_OPTIONS_NO_CAPTURE } from '../constants/events';
import { eventOn, eventOff } from '../utils/events'; // @vue/component

export var focusInMixin = Vue.extend({
  data: function data() {
    return {
      listenForFocusIn: false
    };
  },
  watch: {
    listenForFocusIn: function listenForFocusIn(newValue, oldValue) {
      if (newValue !== oldValue) {
        eventOff(this.focusInElement, 'focusin', this._focusInHandler, EVENT_OPTIONS_NO_CAPTURE);

        if (newValue) {
          eventOn(this.focusInElement, 'focusin', this._focusInHandler, EVENT_OPTIONS_NO_CAPTURE);
        }
      }
    }
  },
  beforeCreate: function beforeCreate() {
    // Declare non-reactive properties
    this.focusInElement = null;
  },
  mounted: function mounted() {
    if (!this.focusInElement) {
      this.focusInElement = document;
    }

    if (this.listenForFocusIn) {
      eventOn(this.focusInElement, 'focusin', this._focusInHandler, EVENT_OPTIONS_NO_CAPTURE);
    }
  },
  beforeDestroy: function beforeDestroy() {
    eventOff(this.focusInElement, 'focusin', this._focusInHandler, EVENT_OPTIONS_NO_CAPTURE);
  },
  methods: {
    _focusInHandler: function _focusInHandler(event) {
      if (this.focusInHandler) {
        this.focusInHandler(event);
      }
    }
  }
});