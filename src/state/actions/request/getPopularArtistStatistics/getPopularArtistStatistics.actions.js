import { createRequestResponseActionSet } from '../../generic';
import {
  getPopularArtistStatisticsType,
} from '../../../types/listener/listener';

export const getPopularArtistStatisticsRequestActions = createRequestResponseActionSet(getPopularArtistStatisticsType);
