import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from 'react-native-elements';
import PlacesInput from 'react-native-places-input';
import Config from 'react-native-config';

import { getUserGenresSagaAction, userLocationSagaAction } from '../../state/actions/sagas';
import { getUserDetails } from '../../state/selectors/UserProfile';
import { getUserGenresList } from '../../state/selectors/UserProfile';
import URContainer from '../../components/URContainer/URContainer';
import Loader from '../../components/Loader/Loader';
import Colors from '../../theme/colors';
import { strings } from '../../utilities/localization/localization';

const UserLocation = ({ navigation }) => {
  const dispatch = useDispatch();

  // --- State Variables ---
  const [genreQuery, setGenreQuery] = useState('');
  const [filteredGenres, setFilteredGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isGenreInputFocused, setIsGenreInputFocused] = useState(false);

  // --- Redux Selectors ---
  const userDetails = useSelector(getUserDetails);
  const genreList = useSelector(getUserGenresList);
  const isGenresLoading = useSelector(state => state.getUserGenres.isWaiting);
  const genresError = useSelector(state => state.getUserGenres.error);
  const accessToken = useSelector(state => state.userAuth.accessToken);

  // --- Effects ---
  useEffect(() => {
    if (accessToken) {
      console.log('--- USER LOCATION: Dispatching getUserGenresSagaAction ---');
      dispatch(getUserGenresSagaAction({ accessToken }));
    }
  }, [dispatch, accessToken]);

  // --- Event Handlers ---
  const handleGenreChange = (text) => {
    setGenreQuery(text);
    if (text && genreList) {
      const filtered = genreList.filter(genre =>
        genre.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredGenres(filtered);
    } else {
      setFilteredGenres([]);
    }
  };

  const handleGenreSelect = (genre) => {
    setGenreQuery(genre.name);
    setSelectedGenre(genre);
    setFilteredGenres([]);
    setIsGenreInputFocused(false);
  };

  const handleLocationSelect = (place) => {
    console.log('--- USER LOCATION: Location Selected ---', place);
    setSelectedLocation(place.result);
  };

  const onContinue = () => {
    if (!selectedLocation || !selectedGenre || !userDetails) {
      console.warn('Continue button pressed but required data is missing.');
      return;
    }
    
    // Handle location data safely - extract from formatted_address if address_components is missing
    let country = '', state = '', city = '', zipcode = '';
    let latitude = 0, longitude = 0;
    
    if (selectedLocation.address_components) {
      // Full address components available
      country = selectedLocation.address_components.find(c => c.types.includes('country'))?.long_name || '';
      state = selectedLocation.address_components.find(c => c.types.includes('administrative_area_level_1'))?.long_name || '';
      city = selectedLocation.address_components.find(c => c.types.includes('locality'))?.long_name || '';
      zipcode = selectedLocation.address_components.find(c => c.types.includes('postal_code'))?.long_name || '';
    } else if (selectedLocation.formatted_address) {
      // Parse formatted address as fallback
      const addressParts = selectedLocation.formatted_address.split(', ');
      if (addressParts.length >= 2) {
        city = addressParts[0];
        const stateCountry = addressParts[addressParts.length - 1];
        if (stateCountry.includes('USA')) {
          country = 'USA';
          if (addressParts.length >= 3) {
            state = addressParts[addressParts.length - 2].replace(' USA', '');
          }
        } else {
          country = stateCountry;
        }
      }
    }
    
    // Get coordinates
    if (selectedLocation.geometry && selectedLocation.geometry.location) {
      latitude = selectedLocation.geometry.location.lat || 0;
      longitude = selectedLocation.geometry.location.lng || 0;
    }
    
    // FIXED: Separate location and genre payloads to match backend API structure
    const locationPayload = {
        country,
        state,
        city,
        zipcode: zipcode || '', // Ensure zipcode is string, not undefined
        latitude,
        longitude,
        userId: userDetails.id,
        street: '', // Backend expects street field
    };
    
    console.log('--- USER LOCATION: Dispatching userLocationSagaAction with location payload ---', locationPayload);
    dispatch(userLocationSagaAction(locationPayload));
    
    // TODO: Genre preferences should be handled separately via a different saga/API call
    // For now, navigate after location is saved. Genre handling can be added later.
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });
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
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentView}>
          <Text style={styles.titleText}>Let's Create Your Home Scene</Text>
          <Text style={styles.subtitleText}>This helps us tune your UPRISE experience.</Text>

          {/* Location Input */}
          <View style={styles.locationInputWrapper}>
            <Text style={styles.label}>Your Location</Text>
            <PlacesInput
              googleApiKey="AIzaSyD5AX4I4r7AZj0QB4a4IgrqdGm5PeNH6g0"
              onSelect={handleLocationSelect}
              placeHolder="Start typing your city..."
              textInputProps={{
                placeholderTextColor: '#999',
                style: styles.textInput,
              }}
              stylesContainer={styles.placesContainer}
              stylesInput={styles.textInput}
              stylesList={styles.locationPlacesList}
            />
          </View>
          
          {/* Genre Input */}
          <View style={styles.genreInputWrapper}>
            <Text style={styles.label}>Your Primary Genre</Text>
            <TextInput
              style={[styles.textInput, styles.genreTextInput]}
              placeholder="Start typing a genre..."
              placeholderTextColor="#999"
              value={genreQuery}
              onChangeText={handleGenreChange}
              onFocus={() => setIsGenreInputFocused(true)}
              onBlur={() => {
                // Add a small delay to allow selection
                setTimeout(() => setIsGenreInputFocused(false), 200);
              }}
            />
            {isGenreInputFocused && filteredGenres.length > 0 && (
              <View style={styles.suggestionsList}>
                <ScrollView
                  style={styles.suggestionsScrollView}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled={true}
                >
                  {filteredGenres.map((item) => (
                    <TouchableOpacity
                      key={item.id.toString()}
                      style={styles.suggestionItem}
                      onPress={() => handleGenreSelect(item)}
                    >
                      <Text style={styles.suggestionText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <Button
            title="Find My Scene"
            onPress={onContinue}
            disabled={!selectedLocation || !selectedGenre}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            disabledStyle={styles.disabledButton}
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
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 40,
    textAlign: 'center',
  },
  locationInputWrapper: {
    width: '100%',
    marginBottom: 30,
    zIndex: 1000, // Higher z-index for location dropdown
  },
  genreInputWrapper: {
    width: '100%',
    marginBottom: 25,
    zIndex: 100, // Lower z-index for genre dropdown
  },
  label: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 2,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#000', // Changed to black for visibility
    backgroundColor: '#fff', // White background
    fontSize: 16,
  },
  genreTextInput: {
    // Additional styles for genre input if needed
  },
  placesContainer: {
    width: '100%',
  },
  locationPlacesList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    zIndex: 1001,
    maxHeight: 200,
    elevation: 10, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionsList: {
    position: 'absolute',
    top: 58,
    left: 0,
    right: 0,
    backgroundColor: '#2c2c2c',
    maxHeight: 200,
    borderRadius: 8,
    zIndex: 101,
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionsScrollView: {
    flex: 1,
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
    backgroundColor: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.White,
    fontSize: 18,
    textAlign: 'center',
  },
  errorDetail: {
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default UserLocation;