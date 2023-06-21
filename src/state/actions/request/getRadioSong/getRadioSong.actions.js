import { createRequestResponseActionSet } from '../../generic';
import {
  getRadioSongType,
} from '../../../types/listener/listener';

export const getRadioSongActions = createRequestResponseActionSet(getRadioSongType);
