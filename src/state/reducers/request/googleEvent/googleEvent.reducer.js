import { createRequestResponseReducer } from '../../generic';
import { googleEventType } from '../../../types/listener/listener';

export default createRequestResponseReducer(googleEventType);
