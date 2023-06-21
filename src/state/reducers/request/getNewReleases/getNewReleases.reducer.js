import { createRequestResponseReducer } from '../../generic';
import { getNewReleasesType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getNewReleasesType);
