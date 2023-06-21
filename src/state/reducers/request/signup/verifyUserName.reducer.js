import { createRequestResponseReducer } from '../../generic';
import { verifyUserNameTypes } from '../../../types/listener/listener';

export default createRequestResponseReducer(verifyUserNameTypes);
