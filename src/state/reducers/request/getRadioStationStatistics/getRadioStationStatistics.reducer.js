import { createRequestResponseReducer } from '../../generic';
import { getRadioStationStatisticsType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getRadioStationStatisticsType);
