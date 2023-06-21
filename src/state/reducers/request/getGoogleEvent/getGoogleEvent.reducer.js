import { createRequestResponseReducer } from '../../generic';
import { getGoogleEventType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getGoogleEventType);
