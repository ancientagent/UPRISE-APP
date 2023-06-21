import { createRequestResponseActionSet } from '../../generic';
import {
  mostPopularGenresType,
} from '../../../types/listener/listener';

export const mostPopularGenresActions = createRequestResponseActionSet(mostPopularGenresType);
