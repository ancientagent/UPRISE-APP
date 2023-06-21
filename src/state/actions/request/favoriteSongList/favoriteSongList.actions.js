import { createRequestResponseActionSet } from '../../generic';
import {
  favoriteSongListType,
} from '../../../types/listener/listener';

export const favoriteSongListActions = createRequestResponseActionSet(favoriteSongListType);
