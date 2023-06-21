import { createRequestResponseActionSet } from '../../generic';
import {
  songfavoriteType,
} from '../../../types/listener/listener';

export const songfavoriteRequestActions = createRequestResponseActionSet(songfavoriteType);
