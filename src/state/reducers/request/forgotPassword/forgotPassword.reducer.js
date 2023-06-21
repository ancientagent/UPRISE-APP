import { createRequestResponseReducer } from '../../generic';
import { ForgotPasswordReqSagaType } from '../../../types/listener/listener';

export default createRequestResponseReducer(ForgotPasswordReqSagaType);
