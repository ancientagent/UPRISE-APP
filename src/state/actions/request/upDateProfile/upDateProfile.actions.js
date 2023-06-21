import { createRequestResponseActionSet } from '../../generic';
import {
  upDateProfileType,
} from '../../../types/listener/listener';

export const upDateProfileRequestActions = createRequestResponseActionSet(upDateProfileType);
