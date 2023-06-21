import { createRequestResponseReducer } from '../../generic';
import { getPopularArtistStatisticsType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getPopularArtistStatisticsType);
