import { App } from '../../types';

const initialState = {
  screen: null,
  selectedTabId: 1,
  ondemandPlayerClose: false,
  userProfileEdit: false,
};

const currentScreenReducer = (state = initialState, action) => {
  switch (action.type) {
    case App.currentScreen:
      return {
        ...state,
        screen: action.payload.screen,
        selectedTabId: action.payload.selectedTabId,
        ondemandPlayerClose: action.payload.ondemandPlayerClose,
        userProfileEdit: action.payload.userProfileEdit,
      };
    default:
      return state;
  }
};

export default currentScreenReducer;
