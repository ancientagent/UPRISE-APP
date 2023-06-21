import { createRequestResponseActionSet } from '../../generic';
import {
  albumsListType,
} from '../../../types/listener/listener';

export const albumsListActions = createRequestResponseActionSet(albumsListType);
