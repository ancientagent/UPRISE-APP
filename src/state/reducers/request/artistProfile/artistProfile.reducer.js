import {
  artistProfileSagaType,
  updateArtistProfileSagaType,
} from '../../../types/sagas';
import {createRequestResponseActionTypeSet} from '../../../types/generic/requestResponse.types';

const artistProfileActionTypes = createRequestResponseActionTypeSet(
  artistProfileSagaType,
);
const updateArtistProfileActionTypes = createRequestResponseActionTypeSet(
  updateArtistProfileSagaType,
);

const initialState = {
  isWaiting: false,
  error: null,
  result: null,
};

const artistProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case artistProfileActionTypes.START:
      return {
        ...state,
        isWaiting: true,
        error: null,
      };
    case artistProfileActionTypes.SUCCESS:
      return {
        ...state,
        isWaiting: false,
        error: null,
        result: action.payload,
      };
    case artistProfileActionTypes.FAIL:
      return {
        ...state,
        isWaiting: false,
        error: action.payload,
        result: null,
      };
    default:
      return state;
  }
};

const updateArtistProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case updateArtistProfileActionTypes.START:
      return {
        ...state,
        isWaiting: true,
        error: null,
      };
    case updateArtistProfileActionTypes.SUCCESS:
      return {
        ...state,
        isWaiting: false,
        error: null,
        result: action.payload,
      };
    case updateArtistProfileActionTypes.FAIL:
      return {
        ...state,
        isWaiting: false,
        error: action.payload,
        result: null,
      };
    default:
      return state;
  }
};

export {artistProfileReducer, updateArtistProfileReducer};
