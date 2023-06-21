import { createRequestResponseReducer } from '../../generic';
import { LoginRequestTypes } from '../../../types/listener/listener';

export default createRequestResponseReducer(LoginRequestTypes);
