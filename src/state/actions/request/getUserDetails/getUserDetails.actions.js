import { createRequestResponseActionSet } from '../../generic';
import {
  getUserDetailsType,
} from '../../../types/listener/listener';

export const getUserDetailsActions = createRequestResponseActionSet(getUserDetailsType);
