import { createRequestResponseActionSet } from '../../generic';
import {
  getRadioStationsSongsType,
} from '../../../types/listener/listener';

export const getRadioStationsSongsActions = createRequestResponseActionSet(getRadioStationsSongsType);
