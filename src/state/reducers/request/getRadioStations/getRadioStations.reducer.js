import { createRequestResponseReducer } from '../../generic';
import { getRadioStationsType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getRadioStationsType);
