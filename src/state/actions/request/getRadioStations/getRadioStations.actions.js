import { createRequestResponseActionSet } from '../../generic';
import {
  getRadioStationsType,
} from '../../../types/listener/listener';

export const getRadioStationsActions = createRequestResponseActionSet(getRadioStationsType);
