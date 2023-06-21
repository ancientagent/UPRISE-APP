import { createRequestResponseActionSet } from '../../generic';
import {
  songUnfavoriteType,
} from '../../../types/listener/listener';

export const songUnfavoriteActions = createRequestResponseActionSet(songUnfavoriteType);
