import { createRequestResponseActionSet } from '../../generic';
import {
  unFollowType,
} from '../../../types/listener/listener';

export const unFollowRequestActions = createRequestResponseActionSet(unFollowType);
