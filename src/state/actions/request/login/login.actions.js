import { createRequestResponseActionSet } from '../../generic';
import {
  LoginRequestTypes,
} from '../../../types/listener/listener';

export const loginRequestActions = createRequestResponseActionSet(LoginRequestTypes);
