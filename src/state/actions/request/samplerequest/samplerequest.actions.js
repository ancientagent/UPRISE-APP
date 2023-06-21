import { createRequestResponseActionSet } from '../../generic';
import {
  SampleRequestTypes,
} from '../../../types/listener/listener';

export const sampleRequestActions = createRequestResponseActionSet(SampleRequestTypes);
