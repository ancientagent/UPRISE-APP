import { createRequestResponseReducer } from '../../generic';
import { getUserStatisticsType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getUserStatisticsType);
