import { createRequestResponseReducer } from '../../generic';
import { getPopularArtistGenresStatisticsType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getPopularArtistGenresStatisticsType);
