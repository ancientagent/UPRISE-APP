import { createRequestResponseActionSet } from '../../generic';
import {
  mostPopularAlbumsType,
} from '../../../types/listener/listener';

export const mostPopularAlbumsActions = createRequestResponseActionSet(mostPopularAlbumsType);
