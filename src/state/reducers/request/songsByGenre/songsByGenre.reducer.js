import { createRequestResponseReducer } from '../../generic';
import { getSongsByGenreType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getSongsByGenreType);
