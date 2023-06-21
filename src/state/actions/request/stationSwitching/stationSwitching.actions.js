import { createRequestResponseActionSet } from '../../generic';
import {
  stationSwitchingType,
} from '../../../types/listener/listener';

export const stationSwitchingActions = createRequestResponseActionSet(stationSwitchingType);
