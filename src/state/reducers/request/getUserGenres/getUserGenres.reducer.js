import { createRequestResponseReducer } from '../../generic';
import { getUserGenresType } from '../../../types/listener/listener';

export default createRequestResponseReducer(getUserGenresType);
