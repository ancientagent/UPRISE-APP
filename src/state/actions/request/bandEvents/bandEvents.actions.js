import { createRequestResponseActionSet } from '../../generic';
import {
  bandEventsType,
} from '../../../types/listener/listener';

export const bandEventsActions = createRequestResponseActionSet(bandEventsType);
