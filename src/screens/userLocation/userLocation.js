import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from 'react-native-elements';
import Config from 'react-native-config';

import { getUserGenresSagaAction, userLocationSagaAction } from '../../state/actions/sagas';
import { getUserDetails, getUserGenresList, accessToken } from '../../state/selectors/UserProfile';
import URContainer from '../../components/URContainer/URContainer';
import Loader from '../../components/Loader/Loader';
import Colors from '../../theme/colors';
import { strings } from '../../utilities/localization/localization';
import { searchCities, getLocationDetails } from '../../services/googlePlaces/googlePlaces.service';

const UserLocation = () => {
  const dispatch = useDispatch();

  // --- State Variables ---
  const [genreQuery, setGenreQuery] = useState('');
  const [filteredGenres, setFilteredGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isGenreInputFocused, setIsGenreInputFocused] = useState(false);
  const [locationText, setLocationText] = useState('');
  const [useSimpleLocation, setUseSimpleLocation] = useState(false);
  
  // Custom Places Autocomplete state
  const [placePredictions, setPlacePredictions] = useState([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [showPlaceSuggestions, setShowPlaceSuggestions] = useState(false);

  // --- Redux Selectors ---
  const userDetails = useSelector(getUserDetails);
  const genreList = useSelector(getUserGenresList);
  const isGenresLoading = useSelector(state => state.getUserGenres.isWaiting);
  const genresError = useSelector(state => state.getUserGenres.error);
  const userAccessToken = useSelector(accessToken);

  // --- Effects ---
  useEffect(() => {
    const apiKey = Config.GOOGLE_PLACES_API_KEY || Config.MAP_API_KEY;
    console.log('--- USER LOCATION: API Key ---', apiKey ? 'AVAILABLE' : 'MISSING');
    console.log('--- USER LOCATION: Full API Key value ---', apiKey);
    if (userAccessToken) {
      console.log('--- USER LOCATION: Dispatching getUserGenresSagaAction ---');
      dispatch(getUserGenresSagaAction({ accessToken: userAccessToken }));
    }
  }, [dispatch, userAccessToken]);

  // Debug effect for PlacesInput configuration
  useEffect(() => {
    const apiKey = Config.GOOGLE_PLACES_API_KEY || Config.MAP_API_KEY;
    console.log('--- USER LOCATION: Component Debug Info ---');
    console.log('  - API Key:', apiKey ? `${apiKey.substring(0, 20)}...` : 'MISSING');
    console.log('  - API Key length:', apiKey ? apiKey.length : 0);
    console.log('  - locationText state:', locationText);
    console.log('  - selectedLocation state:', selectedLocation);
    console.log('--- Google Places Service Info ---');
    console.log('  - API Key:', apiKey ? 'PRESENT' : 'MISSING');
    console.log('  - Service: searchCities function available');
    console.log('  - Language: en-US');
  }, []);

  // --- Event Handlers ---
  
  // Fixed Genre Autocomplete Logic - Simple case-insensitive search
  const handleGenreChange = (text) => {
    setGenreQuery(text); // Update the text in the input box

    if (text && genreList) {
      const filtered = genreList.filter(genre => 
        genre.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredGenres(filtered);
    } else {
      setFilteredGenres([]); // Clear suggestions if input is empty
    }
  };

  const handleGenreSelect = (genre) => {
    setGenreQuery(genre.name);
    setSelectedGenre(genre);
    setFilteredGenres([]);
    setIsGenreInputFocused(false);
  };

  // Fixed Location Selection Handler
  const handleLocationSelect = (place) => {
    console.log('--- USER LOCATION: Location Selected ---', place);
    setSelectedLocation(place);
    setLocationText(place.formatted_address || place.description || '');
  };

  const handleLocationError = (error) => {
    console.log('--- USER LOCATION: PlacesInput Error ---', error);
    console.log('--- USER LOCATION: Error Details ---', JSON.stringify(error, null, 2));
    Alert.alert("Location Error", `There was an issue with location services: ${JSON.stringify(error)}. Please try typing manually.`);
  };

  const handleLocationTextChange = (text) => {
    console.log('--- USER LOCATION: Text changed ---', text);
    setLocationText(text);
    
    // Debug: Log if suggestions should appear
    if (text.length > 2) {
      const apiKey = Config.GOOGLE_PLACES_API_KEY || Config.MAP_API_KEY;
      console.log('--- USER LOCATION: Text length > 2, Places API should be queried ---');
      console.log('--- USER LOCATION: API Key being used ---', apiKey ? apiKey.substring(0, 20) + '...' : 'MISSING');
      fetchPlacePredictions(text);
    } else {
      setPlacePredictions([]);
      setShowPlaceSuggestions(false);
    }
  };

  // Custom Google Places autocomplete function using our service
  const fetchPlacePredictions = async (input) => {
    const apiKey = Config.GOOGLE_PLACES_API_KEY || Config.MAP_API_KEY;
    console.log('--- CUSTOM PLACES: Starting fetch for input ---', input);
    console.log('--- CUSTOM PLACES: API Key available ---', !!apiKey);
    console.log('--- CUSTOM PLACES: Input length ---', input.length);
    
    if (!apiKey || input.length < 3) {
      console.log('--- CUSTOM PLACES: Skipping fetch - no API key or input too short ---');
      setPlacePredictions([]);
      setShowPlaceSuggestions(false);
      return;
    }

    setIsLoadingPlaces(true);
    console.log('--- CUSTOM PLACES: Fetching predictions for ---', input);

    try {
      // Use our new Google Places service
      const suggestions = await searchCities(input);
      console.log('--- CUSTOM PLACES: Service response ---', suggestions);
      
      if (suggestions && suggestions.length > 0) {
        // Transform to match expected format
        const transformedPredictions = suggestions.map(suggestion => ({
          place_id: suggestion.placeId,
          description: suggestion.displayText,
          structured_formatting: {
            main_text: suggestion.mainText,
            secondary_text: suggestion.secondaryText
          }
        }));
        
        console.log('--- CUSTOM PLACES: Transformed predictions ---', transformedPredictions.length);
        setPlacePredictions(transformedPredictions);
        setShowPlaceSuggestions(transformedPredictions.length > 0);
      } else {
        console.log('--- CUSTOM PLACES: No predictions found ---');
        setPlacePredictions([]);
        setShowPlaceSuggestions(false);
      }
    } catch (error) {
      console.log('--- CUSTOM PLACES: Service error ---', error);
      setPlacePredictions([]);
      setShowPlaceSuggestions(false);
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  // Handle place selection
  const handlePlaceSelect = async (prediction) => {
    console.log('--- CUSTOM PLACES: Place selected ---', prediction);
    setLocationText(prediction.description);
    setShowPlaceSuggestions(false);
    
    // Get place details for coordinates using our service
    try {
      console.log('--- CUSTOM PLACES: Fetching place details ---');
      const placeDetails = await getLocationDetails(prediction.place_id);
      
      if (placeDetails) {
        console.log('--- CUSTOM PLACES: Place details ---', JSON.stringify(placeDetails, null, 2));
        // Transform to match expected format
        const transformedResult = {
          geometry: placeDetails.geometry,
          address_components: placeDetails.addressComponents,
          formatted_address: placeDetails.formattedAddress
        };
        setSelectedLocation(transformedResult);
      }
    } catch (error) {
      console.log('--- CUSTOM PLACES: Error fetching place details ---', error);
    }
  };

  // Fixed Continue Button Logic
  const onContinue = () => {
    if (!selectedGenre) {
      Alert.alert("Selection Incomplete", "Please select a genre.");
      return;
    }

    // Check if we have a location (either from Places API or manual input)
    if (!selectedLocation && !locationText.trim()) {
      Alert.alert("Location Required", "Please enter your location.");
      return;
    }

    let payload;
    
    if (selectedLocation) {
      // Use Places API data if available
      payload = {
        country: selectedLocation.address_components?.find(c => c.types.includes('country'))?.long_name || '',
        state: selectedLocation.address_components?.find(c => c.types.includes('administrative_area_level_1'))?.long_name || '',
        city: selectedLocation.address_components?.find(c => c.types.includes('locality'))?.long_name || selectedLocation.address_components?.find(c => c.types.includes('administrative_area_level_2'))?.long_name || '',
        zipcode: parseInt(selectedLocation.address_components?.find(c => c.types.includes('postal_code'))?.long_name) || null,
        latitude: selectedLocation.geometry?.location?.lat || null,
        longitude: selectedLocation.geometry?.location?.lng || null,
        genreIds: [selectedGenre.id],
        userId: userDetails.id,
      };
    } else {
      // Use manual input as fallback
      console.log('--- USER LOCATION: Using manual location input ---', locationText);
      payload = {
        country: 'USA', // Default for manual input
        state: locationText.toLowerCase().includes('tx') ? 'Texas' : '', // Simple state detection
        city: locationText.replace(/,.*$/, '').trim(), // Take text before comma as city
        zipcode: null,
        latitude: null,
        longitude: null,
        genreIds: [selectedGenre.id],
        userId: userDetails.id,
      };
    }
    
    console.log('--- USER LOCATION: Dispatching userLocationSagaAction with payload ---', payload);
    dispatch(userLocationSagaAction(payload));
  };

  // --- Render Logic ---
  if (isGenresLoading) {
    return <Loader visible={true} />;
  }

  if (genresError) {
    return (
      <URContainer>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Could not load required data.</Text>
          <Text style={styles.errorDetail}>Error: {JSON.stringify(genresError)}</Text>
        </View>
      </URContainer>
    );
  }

  return (
    <URContainer>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
      >
        <View style={styles.contentView}>
          <Text style={styles.titleText}>Let's Create Your Home Scene</Text>
          <Text style={styles.subtitleText}>This helps us tune your UPRISE experience.</Text>

          {/* Location Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Your Location</Text>
            <TextInput
              style={styles.locationTextInput}
              placeholder="Start typing your city..."
              placeholderTextColor="#888"
              value={locationText}
              onChangeText={handleLocationTextChange}
            />
            {/* Custom Places Suggestions */}
            {showPlaceSuggestions && placePredictions.length > 0 && (
              <View style={styles.placesList}>
                <FlatList
                  data={placePredictions}
                  keyExtractor={(item) => item.place_id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.placeItem}
                      onPress={() => handlePlaceSelect(item)}
                    >
                      <Text style={styles.placeMainText}>{item.structured_formatting.main_text}</Text>
                      <Text style={styles.placeSecondaryText}>{item.structured_formatting.secondary_text}</Text>
                    </TouchableOpacity>
                  )}
                  nestedScrollEnabled
                />
              </View>
            )}
            {/* Loading indicator */}
            {isLoadingPlaces && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Searching locations...</Text>
              </View>
            )}
            
            {/* Debug indicator - shows when API key is available */}
            <View style={styles.debugContainer}>
              <Text style={styles.debugText}>
                API Key: {(Config.GOOGLE_PLACES_API_KEY || Config.MAP_API_KEY) ? '✅ Available' : '❌ Missing'}
              </Text>
              <Text style={styles.debugText}>
                Predictions: {placePredictions.length} found
              </Text>
              <Text style={styles.debugText}>
                Show Suggestions: {showPlaceSuggestions ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>

          {/* Genre Input */}
          <View style={styles.genreWrapper}>
            <Text style={styles.label}>Your Primary Genre</Text>
            <TextInput
              style={styles.genreTextInput}
              placeholder="Start typing a genre..."
              placeholderTextColor="#888"
              value={genreQuery}
              onChangeText={handleGenreChange}
              onFocus={() => setIsGenreInputFocused(true)}
              onBlur={() => {
                // Don't immediately close the list, let the user tap suggestions
                setTimeout(() => setIsGenreInputFocused(false), 200);
              }}
            />
            {isGenreInputFocused && filteredGenres.length > 0 && (
              <View style={styles.suggestionsList}>
                {filteredGenres.map((item) => (
                  <TouchableOpacity
                    key={item.id.toString()}
                    style={styles.suggestionItem}
                    onPress={() => handleGenreSelect(item)}
                  >
                    <Text style={styles.suggestionText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>



          <Button
            title="Find My Scene"
            onPress={onContinue}
            disabled={!selectedGenre || (!selectedLocation && !locationText.trim())}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            disabledStyle={styles.disabledButton}
            disabledTextStyle={styles.disabledButtonText}
          />
        </View>
      </KeyboardAwareScrollView>
    </URContainer>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  contentView: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.White,
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 30, // Increase spacing between sections
  },
  label: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8, // Increase spacing between label and input
    paddingHorizontal: 0, // Remove horizontal padding
    marginTop: -10, // Revert the label position
    textAlign: 'left', // Align text to the left
  },
  locationTextInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    backgroundColor: '#333333',
    fontSize: 16,
    width: '100%',
    textAlign: 'left', // Align text to the left
    marginLeft: -8, // Move left by 8 pixels
  },
  genreTextInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    backgroundColor: '#333333',
    fontSize: 16,
    width: '100%',
    textAlign: 'left', // Align text to the left
  },
  placesContainer: {
    width: '100%',
    zIndex: 1000,
  },
  placesList: {
    position: 'absolute',
    top: 50, // Position it directly below the 50px-high input
    left: 0,
    right: 0,
    backgroundColor: '#2c2c2c', // A dark, visible background
    borderColor: 'red',        // A bright red border for easy spotting
    borderWidth: 2,
    zIndex: 9999,              // A very high zIndex to ensure it appears on top
    borderRadius: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    maxHeight: 200,
  },
  suggestionsList: {
    position: 'absolute',
    top: 60, // Position list correctly below the input
    left: 0,
    right: 0,
    backgroundColor: '#2c2c2c',
    maxHeight: 200,
    borderRadius: 8,
    zIndex: 900,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#444',
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  suggestionText: {
    color: Colors.White,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 30,
  },
  button: {
    backgroundColor: Colors.URbtnColor,
    height: 50,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: 'grey',
  },
  disabledButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.White,
    fontSize: 18,
  },
  errorDetail: {
    color: 'grey',
    marginTop: 10,
  },
  genreWrapper: {
    marginTop: 25, // Drop the genre section by 25 pixels
    alignItems: 'flex-start', // Align to the left
    width: '100%', // Ensure full width alignment
  },
  placeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  placeMainText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: '500',
  },
  placeSecondaryText: {
    color: 'grey',
    fontSize: 14,
    marginTop: 2,
  },
  loadingContainer: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    marginTop: 10,
  },
  loadingText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'yellow',
  },
  debugText: {
    color: Colors.White,
    fontSize: 12,
    marginBottom: 3,
  },
});

export default UserLocation;