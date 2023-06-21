import { createRequestResponseActionSet } from '../../generic';
import {
  albumDetailsType,
} from '../../../types/listener/listener';

export const albumDetailsActions = createRequestResponseActionSet(albumDetailsType);
