import { App } from '../../types';

const initialState = {
  showIntro: true,
};

const welcomeSlideReducer = (state = initialState, action) => {
  switch (action.type) {
    case App.welcomeSlide:
      return {
        ...state,
        showIntro: action.payload.showIntro,
      };
    default:
      return state;
  }
};

export default welcomeSlideReducer;
