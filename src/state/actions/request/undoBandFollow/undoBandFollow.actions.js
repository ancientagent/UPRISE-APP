import { createRequestResponseActionSet } from '../../generic';
import {
  undoBandFollowType,
} from '../../../types/listener/listener';

export const undoBandFollowRequestActions = createRequestResponseActionSet(undoBandFollowType);
