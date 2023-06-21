import { createRequestResponseActionSet } from '../../generic';
import {
  getUserGenresType,
} from '../../../types/listener/listener';

export const getUserGenresActions = createRequestResponseActionSet(getUserGenresType);
