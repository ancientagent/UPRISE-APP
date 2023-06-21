import { createRequestResponseActionSet } from '../../generic';
import {
  songReportType,
} from '../../../types/listener/listener';

export const songReportActions = createRequestResponseActionSet(songReportType);
