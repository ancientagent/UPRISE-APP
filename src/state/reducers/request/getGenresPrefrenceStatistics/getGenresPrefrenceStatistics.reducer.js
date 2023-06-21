import { createRequestResponseReducer } from '../../generic';
import { getGenresPrefrenceStatisticsType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getGenresPrefrenceStatisticsType);
