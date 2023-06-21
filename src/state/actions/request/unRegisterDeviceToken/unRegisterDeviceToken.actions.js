import { createRequestResponseActionSet } from '../../generic';
import {
  unRegisterDeviceTokenType,
} from '../../../types/listener/listener';

export const unRegisterDeviceTokenRequestActions = createRequestResponseActionSet(unRegisterDeviceTokenType);
