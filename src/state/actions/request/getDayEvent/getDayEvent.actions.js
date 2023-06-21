import { createRequestResponseActionSet } from '../../generic';
import {
  getDayEventType,
} from '../../../types/listener/listener';

export const getDayEventActions = createRequestResponseActionSet(getDayEventType);
