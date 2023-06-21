import { createRequestResponseActionSet } from '../../generic';
import {
  googleEventType,
} from '../../../types/listener/listener';

export const googleEventActions = createRequestResponseActionSet(googleEventType);
