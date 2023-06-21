import { createRequestResponseActionSet } from '../../generic';
import {
  removeEventType,
} from '../../../types/listener/listener';

export const removeEventActions = createRequestResponseActionSet(removeEventType);
