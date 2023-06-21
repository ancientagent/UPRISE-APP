import { createRequestResponseActionSet } from '../../generic';
import {
  getSongsByGenreType,
} from '../../../types/listener/listener';

export const getSongsByGenreActions = createRequestResponseActionSet(getSongsByGenreType);
