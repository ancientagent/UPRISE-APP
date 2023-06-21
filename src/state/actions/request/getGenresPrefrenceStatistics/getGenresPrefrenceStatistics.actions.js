import { createRequestResponseActionSet } from '../../generic';
import {
  getGenresPrefrenceStatisticsType,
} from '../../../types/listener/listener';

export const getGenresPrefrenceStatisticsRequestActions = createRequestResponseActionSet(
  getGenresPrefrenceStatisticsType,
);
