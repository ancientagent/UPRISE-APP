import { createRequestResponseActionSet } from '../../generic';
import {
  SignupRequestTypes,
} from '../../../types/listener/listener';

export const signupRequestActions = createRequestResponseActionSet(SignupRequestTypes);
