import { createRequestResponseActionSet } from '../../generic';
import {
  followingType,
} from '../../../types/listener/listener';

export const followingActions = createRequestResponseActionSet(followingType);
