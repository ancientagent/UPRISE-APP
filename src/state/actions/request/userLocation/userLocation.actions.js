import { createRequestResponseActionSet } from '../../generic';
import {
  userLocationType,
} from '../../../types/listener/listener';

export const userLocationRequestAction = createRequestResponseActionSet(userLocationType);
