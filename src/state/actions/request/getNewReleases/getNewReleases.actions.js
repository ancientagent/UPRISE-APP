import { createRequestResponseActionSet } from '../../generic';
import {
  getNewReleasesType,
} from '../../../types/listener/listener';

export const getNewReleasesActions = createRequestResponseActionSet(getNewReleasesType);
