import { createRequestResponseActionSet } from '../../generic';
import {
  getBandSongListType,
} from '../../../types/listener/listener';

export const getBandSongListRequestActions = createRequestResponseActionSet(getBandSongListType);
