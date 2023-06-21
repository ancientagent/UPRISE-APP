import { createRequestResponseActionSet } from '../../generic';
import {
  mostPlayedSongsType,
} from '../../../types/listener/listener';

export const mostPlayedSongsActions = createRequestResponseActionSet(mostPlayedSongsType);
