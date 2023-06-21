import { App } from '../../types';

const initialState = {
  accessToken: '',
  refreshToken: '',
};

function userAuth(state = initialState, action) {
  switch (action.type) {
    case App.userAuth:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default userAuth;
