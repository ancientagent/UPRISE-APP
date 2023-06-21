import { createRequestResponseActionSet } from '../../generic';
import {
  postSongIdType,
} from '../../../types/listener/listener';

export const postSongIdRequestActions = createRequestResponseActionSet(postSongIdType);
