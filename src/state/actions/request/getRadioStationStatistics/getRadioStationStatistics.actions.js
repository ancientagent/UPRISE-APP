import { createRequestResponseActionSet } from '../../generic';
import {
  getRadioStationStatisticsType,
} from '../../../types/listener/listener';

export const getRadioStationStatisticsRequestActions = createRequestResponseActionSet(getRadioStationStatisticsType);
