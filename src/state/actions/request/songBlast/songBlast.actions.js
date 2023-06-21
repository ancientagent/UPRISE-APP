import { createRequestResponseActionSet } from '../../generic';
import {
  songBlastType,
} from '../../../types/listener/listener';

export const songBlastActions = createRequestResponseActionSet(songBlastType);
