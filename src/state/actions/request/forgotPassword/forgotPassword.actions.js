import { createRequestResponseActionSet } from '../../generic';
import {
  ForgotPasswordReqSagaType,
} from '../../../types/listener/listener';

export const forgotPasswordRequestActions = createRequestResponseActionSet(ForgotPasswordReqSagaType);
