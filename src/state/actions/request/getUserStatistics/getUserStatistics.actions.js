import { createRequestResponseActionSet } from '../../generic';
import {
  getUserStatisticsType,
} from '../../../types/listener/listener';

export const getUserStatisticsActions = createRequestResponseActionSet(getUserStatisticsType);
