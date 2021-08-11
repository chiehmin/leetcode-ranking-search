import { Vue } from '../../../vue';
import { NAME_POPOVER_TEMPLATE } from '../../../constants/components';
import { isFunction, isUndefinedOrNull } from '../../../utils/inspect';
import { BVTooltipTemplate } from '../../tooltip/helpers/bv-tooltip-template'; // @vue/component

export var BVPopoverTemplate = /*#__PURE__*/Vue.extend({
  name: NAME_POPOVER_TEMPLATE,
  extends: BVTooltipTemplate,
  computed: {
    templateType: function templateType() {
      return 'popover';
    }
  },
  methods: {
    renderTemplate: function renderTemplate(h) {
      var title = this.title,
          content = this.content; // Title and content could be a scoped slot function

      var $title = isFunction(title) ? title({}) : title;
      var $content = isFunction(content) ? content({}) : content; // Directive usage only

      var titleDomProps = this.html && !isFunction(title) ? {
        innerHTML: title
      } : {};
      var contentDomProps = this.html && !isFunction(content) ? {
        innerHTML: content
      } : {};
      return h('div', {
        staticClass: 'popover b-popover',
        class: this.templateClasses,
        attrs: this.templateAttributes,
        on: this.templateListeners
      }, [h('div', {
        staticClass: 'arrow',
        ref: 'arrow'
      }), isUndefinedOrNull($title) || $title === '' ?
      /* istanbul ignore next */
      h() : h('h3', {
        staticClass: 'popover-header',
        domProps: titleDomProps
      }, [$title]), isUndefinedOrNull($content) || $content === '' ?
      /* istanbul ignore next */
      h() : h('div', {
        staticClass: 'popover-body',
        domProps: contentDomProps
      }, [$content])]);
    }
  }
});