/**
 * Google Places API Service
 * Handles location autocomplete functionality for the Uprise mobile app
 * 
 * Tested and working with API key: AIzaSyDmEqT-zOSEIP_YlvyZQUAVd7SRlQvmH2g
 * 
 * @author Development Team
 * @date December 2024
 */

// Environment variables (add to .env file)
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.MAP_API_KEY || 'AIzaSyDmEqT-zOSEIP_YlvyZQUAVd7SRlQvmH2g';
const GOOGLE_PLACES_AUTOCOMPLETE_URL = process.env.GOOGLE_PLACES_AUTOCOMPLETE_URL || 'https://places.googleapis.com/v1/places:autocomplete';

/**
 * Search for locations using Google Places Autocomplete API
 * @param {string} input - The search input (e.g., "Austin")
 * @param {string} languageCode - Language code (default: 'en-US')
 * @param {string} regionCode - Region code (default: 'US')
 * @returns {Promise<Array>} Array of location suggestions
 */
export const searchLocations = async (input, languageCode = 'en-US', regionCode = 'US') => {
  try {
    if (!input || input.trim().length === 0) {
      return [];
    }

    const response = await fetch(`${GOOGLE_PLACES_AUTOCOMPLETE_URL}?key=${GOOGLE_PLACES_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: input.trim(),
        languageCode: languageCode,
        regionCode: regionCode
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Return suggestions array or empty array if no suggestions
    return data.suggestions || [];
  } catch (error) {
    console.error('Google Places API Error:', error);
    throw new Error(`Failed to search locations: ${error.message}`);
  }
};

/**
 * Extract location data from a suggestion
 * @param {Object} suggestion - The suggestion object from the API
 * @returns {Object} Formatted location data
 */
export const formatLocationData = (suggestion) => {
  if (!suggestion || !suggestion.placePrediction) {
    return null;
  }

  const prediction = suggestion.placePrediction;
  
  return {
    placeId: prediction.placeId,
    displayText: prediction.text?.text || '',
    mainText: prediction.structuredFormat?.mainText?.text || '',
    secondaryText: prediction.structuredFormat?.secondaryText?.text || '',
    types: prediction.types || [],
    place: prediction.place || ''
  };
};

/**
 * Filter suggestions to only show cities/locations (not businesses)
 * @param {Array} suggestions - Array of suggestions from the API
 * @returns {Array} Filtered suggestions
 */
export const filterCitySuggestions = (suggestions) => {
  return suggestions.filter(suggestion => {
    const types = suggestion.placePrediction?.types || [];
    // Include localities, geocodes, and political entities
    return types.some(type => 
      ['locality', 'geocode', 'political'].includes(type)
    );
  });
};

/**
 * Search for cities only (filtered results)
 * @param {string} input - The search input
 * @returns {Promise<Array>} Array of city suggestions
 */
export const searchCities = async (input) => {
  try {
    const suggestions = await searchLocations(input);
    const citySuggestions = filterCitySuggestions(suggestions);
    return citySuggestions.map(formatLocationData).filter(Boolean);
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
};

/**
 * Get location details by Place ID
 * @param {string} placeId - The Google Place ID
 * @returns {Promise<Object>} Location details
 */
export const getLocationDetails = async (placeId) => {
  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?key=${GOOGLE_PLACES_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting location details:', error);
    throw new Error(`Failed to get location details: ${error.message}`);
  }
};

// Export default for convenience
export default {
  searchLocations,
  searchCities,
  formatLocationData,
  filterCitySuggestions,
  getLocationDetails
}; 