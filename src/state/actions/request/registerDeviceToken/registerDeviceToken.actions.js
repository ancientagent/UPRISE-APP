import { createRequestResponseActionSet } from '../../generic';
import {
  registerDeviceTokenType,
} from '../../../types/listener/listener';

export const registerDeviceTokenRequestActions = createRequestResponseActionSet(registerDeviceTokenType);
