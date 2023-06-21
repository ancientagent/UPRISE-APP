import { createRequestResponseReducer } from '../../generic';
import { unRegisterDeviceTokenType } from '../../../types/listener/listener';

export default createRequestResponseReducer(unRegisterDeviceTokenType);
