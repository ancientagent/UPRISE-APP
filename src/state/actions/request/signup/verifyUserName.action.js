import { createRequestResponseActionSet } from '../../generic';
import {
  verifyUserNameTypes,
} from '../../../types/listener/listener';

export const verifyUserNameRequestAction = createRequestResponseActionSet(verifyUserNameTypes);
