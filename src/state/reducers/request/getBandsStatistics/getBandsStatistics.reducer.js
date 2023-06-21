import { createRequestResponseReducer } from '../../generic';
import { getBandsStatisticsType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getBandsStatisticsType);
