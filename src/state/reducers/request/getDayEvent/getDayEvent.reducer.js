import { createRequestResponseReducer } from '../../generic';
import { getDayEventType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getDayEventType);
