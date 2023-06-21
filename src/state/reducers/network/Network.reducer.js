import { App as NetworkStatus } from '../../types';

const initialState = {
  showPopup: true,
};

function networkPopup(state = initialState, action) {
  switch (action.type) {
    case NetworkStatus.ShowNetworkPopup:
      return {
        ...state,
        showPopup: true,
      };
    case NetworkStatus.HideNetworkPopup:
      return {
        ...state,
        showPopup: false,
      };
    default:
      return state;
  }
}

export default networkPopup;
