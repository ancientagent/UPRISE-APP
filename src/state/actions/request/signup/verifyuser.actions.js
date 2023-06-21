import { createRequestResponseActionSet } from '../../generic';
import {
  verifyUserTypes,
} from '../../../types/listener/listener';

export const verifyUserRequestAction = createRequestResponseActionSet(verifyUserTypes);
