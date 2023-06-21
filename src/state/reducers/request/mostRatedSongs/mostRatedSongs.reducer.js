import { createRequestResponseReducer } from '../../generic';
import { mostRatedSongsType } from '../../../types/listener/listener';

export default createRequestResponseReducer(mostRatedSongsType);
