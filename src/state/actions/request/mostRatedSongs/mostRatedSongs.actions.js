import { createRequestResponseActionSet } from '../../generic';
import {
  mostRatedSongsType,
} from '../../../types/listener/listener';

export const mostRatedSongsActions = createRequestResponseActionSet(mostRatedSongsType);
