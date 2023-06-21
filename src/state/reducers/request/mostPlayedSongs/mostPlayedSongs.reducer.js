import { createRequestResponseReducer } from '../../generic';
import { mostPlayedSongsType } from '../../../types/listener/listener';

export default createRequestResponseReducer(mostPlayedSongsType);
