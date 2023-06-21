import { createRequestResponseReducer } from '../../generic';
import { verifyUserTypes } from '../../../types/listener/listener';

export default createRequestResponseReducer(verifyUserTypes);
