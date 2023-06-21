import { createRequestResponseReducer } from '../../generic';
import { getBandSongListType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getBandSongListType);
