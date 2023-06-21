import { createRequestResponseActionSet } from '../../generic';
import {
  changePasswordType,
} from '../../../types/listener/listener';

export const changePasswordActions = createRequestResponseActionSet(changePasswordType);
