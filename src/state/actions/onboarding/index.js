import { Onboarding as OnboardingTypes } from '../../types';

// Get Super Genres
export const getSuperGenres = () => ({
  type: OnboardingTypes.GET_SUPER_GENRES_REQUEST,
});

export const getSuperGenresSuccess = (payload) => ({
  type: OnboardingTypes.GET_SUPER_GENRES_SUCCESS,
  payload,
});

export const getSuperGenresFailure = (error) => ({
  type: OnboardingTypes.GET_SUPER_GENRES_FAILURE,
  error,
});


// Get City Suggestions
export const getCitySuggestions = (query) => ({
  type: OnboardingTypes.GET_CITY_SUGGESTIONS_REQUEST,
  payload: { query },
});

export const getCitySuggestionsSuccess = (payload) => ({
  type: OnboardingTypes.GET_CITY_SUGGESTIONS_SUCCESS,
  payload,
});

export const getCitySuggestionsFailure = (error) => ({
  type: OnboardingTypes.GET_CITY_SUGGESTIONS_FAILURE,
  error,
});


// Validate Community
export const validateCommunity = (data) => ({
  type: OnboardingTypes.VALIDATE_COMMUNITY_REQUEST,
  payload: { data },
});

export const validateCommunitySuccess = (payload) => ({
  type: OnboardingTypes.VALIDATE_COMMUNITY_SUCCESS,
  payload,
});

export const validateCommunityFailure = (error) => ({
  type: OnboardingTypes.VALIDATE_COMMUNITY_FAILURE,
  error,
}); 