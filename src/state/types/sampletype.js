import { createRequestResponseActionTypeSet } from './generic/requestResponse.types';

const ActionNamespace = 'SAMPLE';

export const SampleRequestTypes = createRequestResponseActionTypeSet(`${ActionNamespace}/SAMPLEREQUEST`);
