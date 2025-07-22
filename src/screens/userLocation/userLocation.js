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
    console.log('--- USER LOCATION: Config.MAP_API_KEY ---', Config.MAP_API_KEY ? 'AVAILABLE' : 'MISSING');
    console.log('--- USER LOCATION: Full MAP_API_KEY value ---', Config.MAP_API_KEY);
    if (userAccessToken) {
      console.log('--- USER LOCATION: Dispatching getUserGenresSagaAction ---');
      dispatch(getUserGenresSagaAction({ accessToken: userAccessToken }));
    }
  }, [dispatch, userAccessToken]);

  // Debug effect for genres
  useEffect(() => {
    console.log('--- USER LOCATION: Genre List Debug ---');
    console.log('  - genreList:', genreList);
    console.log('  - genreList length:', genreList ? genreList.length : 0);
    console.log('  - genreList type:', typeof genreList);
    if (genreList && genreList.length > 0) {
      console.log('  - First 5 genres:', genreList.slice(0, 5));
    }
  }, [genreList]);

  // Debug effect for PlacesInput configuration
  useEffect(() => {
    console.log('--- USER LOCATION: Component Debug Info ---');
    console.log('  - MAP_API_KEY:', Config.MAP_API_KEY ? `${Config.MAP_API_KEY.substring(0, 20)}...` : 'MISSING');
    console.log('  - MAP_API_KEY length:', Config.MAP_API_KEY ? Config.MAP_API_KEY.length : 0);
    console.log('  - locationText state:', locationText);
    console.log('  - selectedLocation state:', selectedLocation);
    console.log('--- PlacesInput Props that will be passed ---');
    console.log('  - googleApiKey:', Config.MAP_API_KEY ? 'PRESENT' : 'MISSING');
    console.log('  - queryCountries: [\'us\']');
    console.log('  - queryTypes: (cities)');
    console.log('  - language: en-US');
  }, []);

  // --- Event Handlers ---
  
  // Fixed Genre Autocomplete Logic - Simple case-insensitive search
  const handleGenreChange = (text) => {
    console.log('--- USER LOCATION: Genre input changed ---', text);
    console.log('--- USER LOCATION: Current genreList ---', genreList);
    console.log('--- USER LOCATION: genreList length ---', genreList ? genreList.length : 0);
    
    setGenreQuery(text); // Update the text in the input box

    if (text && genreList) {
      const filtered = genreList.filter(genre => 
        genre.name.toLowerCase().includes(text.toLowerCase())
      );
      console.log('--- USER LOCATION: Filtered genres ---', filtered);
      console.log('--- USER LOCATION: Filtered count ---', filtered.length);
      setFilteredGenres(filtered);
      
      // Check if current text exactly matches any genre (for button activation)
      const matchingGenre = filtered.find(genre => 
        genre.name.toLowerCase() === text.toLowerCase()
      );
      
      if (matchingGenre && !selectedGenre) {
        console.log('--- USER LOCATION: Genre text matches suggestion, setting selectedGenre ---', matchingGenre);
        setSelectedGenre(matchingGenre);
      }
    } else {
      console.log('--- USER LOCATION: Clearing filtered genres ---');
      setFilteredGenres([]); // Clear suggestions if input is empty
      setSelectedGenre(null);
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
    
    // Clear selected location when user starts typing
    if (text.trim() === '') {
      setSelectedLocation(null);
      setShowPlaceSuggestions(false);
      setPlacePredictions([]);
      return;
    }
    
    // Debug: Log if suggestions should appear
    if (text.length > 2) {
      console.log('--- USER LOCATION: Text length > 2, Places API should be queried ---');
      console.log('--- USER LOCATION: API Key being used ---', Config.MAP_API_KEY ? Config.MAP_API_KEY.substring(0, 20) + '...' : 'MISSING');
      fetchPlacePredictions(text);
    } else {
      setPlacePredictions([]);
      setShowPlaceSuggestions(false);
    }
    
    // Check if current text matches any existing suggestion (for button activation)
    const matchingSuggestion = placePredictions.find(prediction => 
      prediction.description.toLowerCase().includes(text.toLowerCase()) ||
      prediction.structured_formatting.main_text.toLowerCase().includes(text.toLowerCase())
    );
    
    if (matchingSuggestion && !selectedLocation) {
      console.log('--- USER LOCATION: Text matches suggestion, setting selectedLocation ---', matchingSuggestion);
      setSelectedLocation(matchingSuggestion);
    }
  };

  // Custom Google Places autocomplete function - Using LEGACY Places API (better for cities)
  const fetchPlacePredictions = async (input) => {
    if (!Config.MAP_API_KEY || input.length < 3) {
      setPlacePredictions([]);
      setShowPlaceSuggestions(false);
      return;
    }

    setIsLoadingPlaces(true);
    console.log('--- CUSTOM PLACES: Fetching predictions for ---', input);

    try {
      // Use LEGACY Places API (better for cities and states)
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=(cities)&components=country:us&language=en-US&key=${Config.MAP_API_KEY}`;
      console.log('--- CUSTOM PLACES: API URL ---', url.replace(Config.MAP_API_KEY, 'API_KEY_HIDDEN'));
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('--- CUSTOM PLACES: API Response ---', JSON.stringify(data, null, 2));
      
      if (data.status === 'OK' && data.predictions && data.predictions.length > 0) {
        console.log('--- CUSTOM PLACES: All predictions ---', data.predictions.length);
        setPlacePredictions(data.predictions);
        setShowPlaceSuggestions(data.predictions.length > 0);
      } else {
        console.log('--- CUSTOM PLACES: No predictions or error ---', data.error_message || data.status);
        setPlacePredictions([]);
        setShowPlaceSuggestions(false);
      }
    } catch (error) {
      console.log('--- CUSTOM PLACES: Fetch error ---', error);
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
    
    // Get place details for coordinates using LEGACY Places API
    try {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&fields=geometry,address_components,formatted_address&key=${Config.MAP_API_KEY}`;
      console.log('--- CUSTOM PLACES: Fetching place details ---');
      
      const response = await fetch(detailsUrl);
      const data = await response.json();
      
      if (data.status === 'OK' && data.result) {
        console.log('--- CUSTOM PLACES: Place details ---', JSON.stringify(data.result, null, 2));
        setSelectedLocation(data.result);
      } else {
        console.log('--- CUSTOM PLACES: No place details found ---', data.error_message || data.status);
        // Fallback: create basic location data from prediction
        const fallbackLocation = {
          formatted_address: prediction.description,
          address_components: [],
          geometry: {
            location: { lat: null, lng: null }
          }
        };
        setSelectedLocation(fallbackLocation);
      }
    } catch (error) {
      console.log('--- CUSTOM PLACES: Error fetching place details ---', error);
      // Fallback: create basic location data from prediction
      const fallbackLocation = {
        formatted_address: prediction.description,
        address_components: [],
        geometry: {
          location: { lat: null, lng: null }
        }
      };
      setSelectedLocation(fallbackLocation);
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
                      onPress={() => {
                        console.log('--- CUSTOM PLACES: TouchableOpacity pressed ---', item);
                        handlePlaceSelect(item);
                      }}
                      activeOpacity={0.7}
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
                    onPress={() => {
                      console.log('--- USER LOCATION: Genre TouchableOpacity pressed ---', item);
                      handleGenreSelect(item);
                    }}
                    activeOpacity={0.7}
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
          {/* Debug Info */}
          <Text style={{color: 'white', fontSize: 12, marginTop: 10}}>
            Debug: Genre={!!selectedGenre}, Location={!!selectedLocation}, Text={!!locationText.trim()}
          </Text>
          <Text style={{color: 'white', fontSize: 10, marginTop: 5}}>
            Values: Genre={selectedGenre?.name || 'null'}, Location={selectedLocation?.description || 'null'}, Text="{locationText}"
          </Text>
          <Text style={{color: 'white', fontSize: 10, marginTop: 5}}>
            Button Disabled: {(!selectedGenre || (!selectedLocation && !locationText.trim())).toString()}
          </Text>
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
    top: 60, // Position list correctly below the input
    left: 0,
    right: 0,
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#444',
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
    marginTop: 20,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 20,
  },
  debugText: {
    color: Colors.White,
    fontSize: 14,
    marginBottom: 5,
  },
});

export default UserLocation;