import { createRequestResponseReducer } from '../../generic';
import { favoriteSongListType } from '../../../types/listener/listener';

export default createRequestResponseReducer(favoriteSongListType);
