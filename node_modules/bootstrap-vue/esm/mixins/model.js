import { makeModelMixin } from '../utils/model';

var _makeModelMixin = makeModelMixin('value'),
    mixin = _makeModelMixin.mixin,
    props = _makeModelMixin.props,
    prop = _makeModelMixin.prop,
    event = _makeModelMixin.event;

export { mixin as modelMixin, props, prop as MODEL_PROP_NAME, event as MODEL_EVENT_NAME };