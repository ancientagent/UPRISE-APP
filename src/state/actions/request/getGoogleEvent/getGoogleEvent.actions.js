import { createRequestResponseActionSet } from '../../generic';
import {
  getGoogleEventType,
} from '../../../types/listener/listener';

export const getGoogleEventActions = createRequestResponseActionSet(getGoogleEventType);
