import { createRequestResponseActionSet } from '../../generic';
import {
  nearestLocationsType,
} from '../../../types/listener/listener';

export const nearestLocationsActions = createRequestResponseActionSet(nearestLocationsType);
