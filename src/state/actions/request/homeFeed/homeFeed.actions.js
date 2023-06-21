import { createRequestResponseActionSet } from '../../generic';
import {
  homeFeedType,
} from '../../../types/listener/listener';

export const homeFeedActions = createRequestResponseActionSet(homeFeedType);
