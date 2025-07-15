import { createRequestResponseActionSet } from '../../generic';
import {
  getSongAnalyticsType,
} from '../../../types/listener/listener';

export const getSongAnalyticsActions = createRequestResponseActionSet(getSongAnalyticsType); 