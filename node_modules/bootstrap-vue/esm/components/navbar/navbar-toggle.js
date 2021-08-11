import { Vue } from '../../vue';
import { NAME_COLLAPSE, NAME_NAVBAR_TOGGLE } from '../../constants/components';
import { EVENT_NAME_CLICK } from '../../constants/events';
import { PROP_TYPE_ARRAY_STRING, PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_DEFAULT } from '../../constants/slots';
import { getRootEventName } from '../../utils/events';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { listenOnRootMixin } from '../../mixins/listen-on-root';
import { normalizeSlotMixin } from '../../mixins/normalize-slot';
import { VBToggle } from '../../directives/toggle/toggle'; // --- Constants ---

var CLASS_NAME = 'navbar-toggler';
var ROOT_EVENT_NAME_STATE = getRootEventName(NAME_COLLAPSE, 'state');
var ROOT_EVENT_NAME_SYNC_STATE = getRootEventName(NAME_COLLAPSE, 'sync-state'); // --- Props ---

export var props = makePropsConfigurable({
  disabled: makeProp(PROP_TYPE_BOOLEAN, false),
  label: makeProp(PROP_TYPE_STRING, 'Toggle navigation'),
  target: makeProp(PROP_TYPE_ARRAY_STRING, undefined, true) // Required

}, NAME_NAVBAR_TOGGLE); // --- Main component ---
// @vue/component

export var BNavbarToggle = /*#__PURE__*/Vue.extend({
  name: NAME_NAVBAR_TOGGLE,
  directives: {
    VBToggle: VBToggle
  },
  mixins: [listenOnRootMixin, normalizeSlotMixin],
  props: props,
  data: function data() {
    return {
      toggleState: false
    };
  },
  created: function created() {
    this.listenOnRoot(ROOT_EVENT_NAME_STATE, this.handleStateEvt);
    this.listenOnRoot(ROOT_EVENT_NAME_SYNC_STATE, this.handleStateEvt);
  },
  methods: {
    onClick: function onClick(event) {
      if (!this.disabled) {
        // Emit courtesy `click` event
        this.$emit(EVENT_NAME_CLICK, event);
      }
    },
    handleStateEvt: function handleStateEvt(id, state) {
      // We listen for state events so that we can pass the
      // boolean expanded state to the default scoped slot
      if (id === this.target) {
        this.toggleState = state;
      }
    }
  },
  render: function render(h) {
    var disabled = this.disabled;
    return h('button', {
      staticClass: CLASS_NAME,
      class: {
        disabled: disabled
      },
      directives: [{
        name: 'VBToggle',
        value: this.target
      }],
      attrs: {
        type: 'button',
        disabled: disabled,
        'aria-label': this.label
      },
      on: {
        click: this.onClick
      }
    }, [this.normalizeSlot(SLOT_NAME_DEFAULT, {
      expanded: this.toggleState
    }) || h('span', {
      staticClass: "".concat(CLASS_NAME, "-icon")
    })]);
  }
});