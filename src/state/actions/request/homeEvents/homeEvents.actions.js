import { createRequestResponseActionSet } from '../../generic';
import {
  homeEventsType,
} from '../../../types/listener/listener';

export const homeEventsActions = createRequestResponseActionSet(homeEventsType);
