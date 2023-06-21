import { createRequestResponseReducer } from '../../generic';
import { getRadioSongType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getRadioSongType);
