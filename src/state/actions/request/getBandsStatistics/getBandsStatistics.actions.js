import { createRequestResponseActionSet } from '../../generic';
import {
  getBandsStatisticsType,
} from '../../../types/listener/listener';

export const getBandsStatisticsRequestActions = createRequestResponseActionSet(getBandsStatisticsType);
