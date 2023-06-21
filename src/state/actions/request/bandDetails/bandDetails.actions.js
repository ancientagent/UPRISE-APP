import { createRequestResponseActionSet } from '../../generic';
import {
  bandDetailsType,
} from '../../../types/listener/listener';

export const bandDetailsActions = createRequestResponseActionSet(bandDetailsType);
