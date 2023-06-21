import { createRequestResponseActionSet } from '../../generic';
import {
  songDownVoteType,
} from '../../../types/listener/listener';

export const songDownVoteActions = createRequestResponseActionSet(songDownVoteType);
