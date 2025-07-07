import { Onboarding as OnboardingTypes } from '../../types';

const initialState = {
  superGenres: [],
  citySuggestions: [],
  communityValidation: null,
  error: null,
};

const onboardingReducer = (state = initialState, action) => {
  switch (action.type) {
    // Super Genres
    case OnboardingTypes.GET_SUPER_GENRES_SUCCESS:
      return {
        ...state,
        superGenres: action.payload.super_genres || [],
        error: null,
      };
    case OnboardingTypes.GET_SUPER_GENRES_FAILURE:
      return {
        ...state,
        superGenres: [],
        error: action.error,
      };

    // City Suggestions
    case OnboardingTypes.GET_CITY_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        citySuggestions: action.payload.cities || [],
        error: null,
      };
    case OnboardingTypes.GET_CITY_SUGGESTIONS_FAILURE:
      return {
        ...state,
        citySuggestions: [],
        error: action.error,
      };
    
    // Validate Community
    case OnboardingTypes.VALIDATE_COMMUNITY_SUCCESS:
      return {
        ...state,
        communityValidation: action.payload,
        error: null,
      };
    case OnboardingTypes.VALIDATE_COMMUNITY_FAILURE:
      return {
        ...state,
        communityValidation: null,
        error: action.error,
      };

    default:
      return state;
  }
};

export default onboardingReducer; 