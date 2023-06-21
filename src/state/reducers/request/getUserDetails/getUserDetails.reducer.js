import { createRequestResponseReducer } from '../../generic';
import { getUserDetailsType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getUserDetailsType);
