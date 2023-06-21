import { createRequestResponseReducer } from '../../generic';
import { SSOLoginTypes } from '../../../types/listener/listener';

export default createRequestResponseReducer(SSOLoginTypes);
