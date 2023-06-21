import { createRequestResponseActionSet } from '../../generic';
import {
  followersListType,
} from '../../../types/listener/listener';

export const followersListActions = createRequestResponseActionSet(followersListType);
