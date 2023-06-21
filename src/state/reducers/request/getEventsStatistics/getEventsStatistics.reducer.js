import { createRequestResponseReducer } from '../../generic';
import { getEventsStatisticsType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getEventsStatisticsType);
