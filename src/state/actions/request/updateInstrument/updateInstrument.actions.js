import { createRequestResponseActionSet } from '../../generic';
import {
  updateInstrumentType,
} from '../../../types/listener/listener';

export const updateInstrumentRequestActions = createRequestResponseActionSet(updateInstrumentType);
