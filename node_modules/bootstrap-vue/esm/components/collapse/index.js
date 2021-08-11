import { BCollapse } from './collapse';
import { VBTogglePlugin } from '../../directives/toggle';
import { pluginFactory } from '../../utils/plugins';
var CollapsePlugin = /*#__PURE__*/pluginFactory({
  components: {
    BCollapse: BCollapse
  },
  plugins: {
    VBTogglePlugin: VBTogglePlugin
  }
});
export { CollapsePlugin, BCollapse };