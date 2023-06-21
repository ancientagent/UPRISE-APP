import { createRequestResponseActionSet } from '../../generic';
import {
  userGenresType,
} from '../../../types/listener/listener';

export const userGenresRequestActions = createRequestResponseActionSet(userGenresType);
