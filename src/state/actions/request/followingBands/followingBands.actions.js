import { createRequestResponseActionSet } from '../../generic';
import {
  followingBandsType,
} from '../../../types/listener/listener';

export const followingBandsActions = createRequestResponseActionSet(followingBandsType);
