import { createRequestResponseActionSet } from '../../generic';
import {
  followType,
} from '../../../types/listener/listener';

export const followRequestActions = createRequestResponseActionSet(followType);
