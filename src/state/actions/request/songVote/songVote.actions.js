import { createRequestResponseActionSet } from '../../generic';
import {
  songVoteType,
} from '../../../types/listener/listener';

export const songVoteActions = createRequestResponseActionSet(songVoteType);
