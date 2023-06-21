import { createRequestResponseActionSet } from '../../generic';
import {
  deleteFollowersType,
} from '../../../types/listener/listener';

export const deleteFollowersActions = createRequestResponseActionSet(deleteFollowersType);
