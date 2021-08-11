import { BAvatar } from './avatar';
import { BAvatarGroup } from './avatar-group';
import { pluginFactory } from '../../utils/plugins';
var AvatarPlugin = /*#__PURE__*/pluginFactory({
  components: {
    BAvatar: BAvatar,
    BAvatarGroup: BAvatarGroup
  }
});
export { AvatarPlugin, BAvatar, BAvatarGroup };