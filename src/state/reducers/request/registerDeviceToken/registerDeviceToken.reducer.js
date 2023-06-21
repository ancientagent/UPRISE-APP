import { createRequestResponseReducer } from '../../generic';
import { registerDeviceTokenType } from '../../../types/listener/listener';

export default createRequestResponseReducer(registerDeviceTokenType);
