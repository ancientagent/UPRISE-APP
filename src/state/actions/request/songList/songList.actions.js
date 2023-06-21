import { createRequestResponseActionSet } from '../../generic';
import {
  songListType,
} from '../../../types/listener/listener';

export const songListActions = createRequestResponseActionSet(songListType);
