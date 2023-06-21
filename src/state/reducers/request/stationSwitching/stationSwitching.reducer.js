import { createRequestResponseReducer } from '../../generic';
import { stationSwitchingType } from '../../../types/listener/listener';

export default createRequestResponseReducer(stationSwitchingType);
