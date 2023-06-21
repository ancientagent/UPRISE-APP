import { createRequestResponseReducer } from '../../generic';
import { removeEventType } from '../../../types/listener/listener';

export default createRequestResponseReducer(removeEventType);
