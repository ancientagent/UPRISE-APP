import { createRequestResponseActionSet } from '../../generic';
import {
  getUserAvatarType,
} from '../../../types/listener/listener';

export const getUserAvatarActions = createRequestResponseActionSet(getUserAvatarType);
