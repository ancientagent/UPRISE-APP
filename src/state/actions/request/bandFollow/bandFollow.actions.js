import { createRequestResponseActionSet } from '../../generic';
import {
  bandFollowType,
} from '../../../types/listener/listener';

export const bandFollowRequestActions = createRequestResponseActionSet(bandFollowType);
