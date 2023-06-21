import { createRequestResponseActionSet } from '../../generic';
import {
  getEventsStatisticsType,
} from '../../../types/listener/listener';

export const getEventsStatisticsRequestActions = createRequestResponseActionSet(getEventsStatisticsType);
