import { createRequestResponseActionSet } from '../../generic';
import {
  getPopularArtistGenresStatisticsType,
} from '../../../types/listener/listener';

export const getPopularArtistGenresStatisticsRequestActions = createRequestResponseActionSet(
  getPopularArtistGenresStatisticsType,
);
