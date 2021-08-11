function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Vue, mergeData } from '../../vue';
import { NAME_JUMBOTRON } from '../../constants/components';
import { PROP_TYPE_BOOLEAN, PROP_TYPE_BOOLEAN_STRING, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '../../constants/props';
import { SLOT_NAME_DEFAULT, SLOT_NAME_HEADER, SLOT_NAME_LEAD } from '../../constants/slots';
import { htmlOrText } from '../../utils/html';
import { hasNormalizedSlot, normalizeSlot } from '../../utils/normalize-slot';
import { makeProp, makePropsConfigurable } from '../../utils/props';
import { BContainer } from '../layout/container'; // --- Props ---

export var props = makePropsConfigurable({
  bgVariant: makeProp(PROP_TYPE_STRING),
  borderVariant: makeProp(PROP_TYPE_STRING),
  containerFluid: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
  fluid: makeProp(PROP_TYPE_BOOLEAN, false),
  header: makeProp(PROP_TYPE_STRING),
  headerHtml: makeProp(PROP_TYPE_STRING),
  headerLevel: makeProp(PROP_TYPE_NUMBER_STRING, 3),
  headerTag: makeProp(PROP_TYPE_STRING, 'h1'),
  lead: makeProp(PROP_TYPE_STRING),
  leadHtml: makeProp(PROP_TYPE_STRING),
  leadTag: makeProp(PROP_TYPE_STRING, 'p'),
  tag: makeProp(PROP_TYPE_STRING, 'div'),
  textVariant: makeProp(PROP_TYPE_STRING)
}, NAME_JUMBOTRON); // --- Main component ---
// @vue/component

export var BJumbotron = /*#__PURE__*/Vue.extend({
  name: NAME_JUMBOTRON,
  functional: true,
  props: props,
  render: function render(h, _ref) {
    var _class2;

    var props = _ref.props,
        data = _ref.data,
        slots = _ref.slots,
        scopedSlots = _ref.scopedSlots;
    var header = props.header,
        headerHtml = props.headerHtml,
        lead = props.lead,
        leadHtml = props.leadHtml,
        textVariant = props.textVariant,
        bgVariant = props.bgVariant,
        borderVariant = props.borderVariant;
    var $scopedSlots = scopedSlots || {};
    var $slots = slots();
    var slotScope = {};
    var $header = h();
    var hasHeaderSlot = hasNormalizedSlot(SLOT_NAME_HEADER, $scopedSlots, $slots);

    if (hasHeaderSlot || header || headerHtml) {
      var headerLevel = props.headerLevel;
      $header = h(props.headerTag, {
        class: _defineProperty({}, "display-".concat(headerLevel), headerLevel),
        domProps: hasHeaderSlot ? {} : htmlOrText(headerHtml, header)
      }, normalizeSlot(SLOT_NAME_HEADER, slotScope, $scopedSlots, $slots));
    }

    var $lead = h();
    var hasLeadSlot = hasNormalizedSlot(SLOT_NAME_LEAD, $scopedSlots, $slots);

    if (hasLeadSlot || lead || leadHtml) {
      $lead = h(props.leadTag, {
        staticClass: 'lead',
        domProps: hasLeadSlot ? {} : htmlOrText(leadHtml, lead)
      }, normalizeSlot(SLOT_NAME_LEAD, slotScope, $scopedSlots, $slots));
    }

    var $children = [$header, $lead, normalizeSlot(SLOT_NAME_DEFAULT, slotScope, $scopedSlots, $slots)]; // If fluid, wrap content in a container

    if (props.fluid) {
      $children = [h(BContainer, {
        props: {
          fluid: props.containerFluid
        }
      }, $children)];
    }

    return h(props.tag, mergeData(data, {
      staticClass: 'jumbotron',
      class: (_class2 = {
        'jumbotron-fluid': props.fluid
      }, _defineProperty(_class2, "text-".concat(textVariant), textVariant), _defineProperty(_class2, "bg-".concat(bgVariant), bgVariant), _defineProperty(_class2, "border-".concat(borderVariant), borderVariant), _defineProperty(_class2, "border", borderVariant), _class2)
    }), $children);
  }
});