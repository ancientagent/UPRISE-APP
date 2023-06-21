import _ from 'lodash';

export const RequestResponseSubactions = _.mapKeys(['Start', 'Fail', 'Succeed', 'Update', 'Reset']);

export function createRequestResponseActionTypeSet(base) {
  return _.mapValues(RequestResponseSubactions, subaction => `${base}/${subaction.toUpperCase()}`);
}
