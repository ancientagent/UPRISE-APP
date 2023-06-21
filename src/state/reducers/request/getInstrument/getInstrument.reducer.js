import { createRequestResponseReducer } from '../../generic';
import { getInstrumentType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getInstrumentType);
