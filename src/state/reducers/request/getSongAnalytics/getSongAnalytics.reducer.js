import {createRequestResponseReducer} from '../../generic';
import {getSongAnalyticsType} from '../../../types/listener/listener';

export default createRequestResponseReducer(getSongAnalyticsType);
