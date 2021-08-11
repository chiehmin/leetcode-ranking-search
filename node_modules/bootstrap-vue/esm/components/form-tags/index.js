import { BFormTags } from './form-tags';
import { BFormTag } from './form-tag';
import { pluginFactory } from '../../utils/plugins';
var FormTagsPlugin = /*#__PURE__*/pluginFactory({
  components: {
    BFormTags: BFormTags,
    BTags: BFormTags,
    BFormTag: BFormTag,
    BTag: BFormTag
  }
});
export { FormTagsPlugin, BFormTags, BFormTag };