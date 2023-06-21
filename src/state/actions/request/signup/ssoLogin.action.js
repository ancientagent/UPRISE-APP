import { createRequestResponseActionSet } from '../../generic';
import {
  SSOLoginTypes,
} from '../../../types/listener/listener';

export const ssoLoginRequestAction = createRequestResponseActionSet(SSOLoginTypes);
