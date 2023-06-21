import { App } from '../../types';

const currentSongDataReducer = (state = {}, action) => {
  switch (action.type) {
    case App.currentSongData:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default currentSongDataReducer;
