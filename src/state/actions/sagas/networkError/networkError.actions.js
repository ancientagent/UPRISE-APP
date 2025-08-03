import {createAction} from 'redux-actions';
import {NETWORK_ERROR} from '../../../types/ActionTypes';

export const networkError = createAction(NETWORK_ERROR);
