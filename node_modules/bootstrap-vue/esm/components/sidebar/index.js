import { BSidebar } from './sidebar';
import { VBTogglePlugin } from '../../directives/toggle';
import { pluginFactory } from '../../utils/plugins';
var SidebarPlugin = /*#__PURE__*/pluginFactory({
  components: {
    BSidebar: BSidebar
  },
  plugins: {
    VBTogglePlugin: VBTogglePlugin
  }
});
export { SidebarPlugin, BSidebar };