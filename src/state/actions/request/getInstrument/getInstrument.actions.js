import { createRequestResponseActionSet } from '../../generic';
import {
  getInstrumentType,
} from '../../../types/listener/listener';

export const getInstrumentRequestActions = createRequestResponseActionSet(getInstrumentType);
