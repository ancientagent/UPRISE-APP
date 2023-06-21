import { createRequestResponseReducer } from '../../generic';
import { getRadioStationsSongsType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getRadioStationsSongsType);
