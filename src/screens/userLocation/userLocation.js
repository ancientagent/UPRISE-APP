/* eslint-disable radix */
/* eslint-disable global-require */
import React, { useEffect } from 'react';
import {
  View, Text, Image, Alert, Linking, Dimensions,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-native-elements';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import PlacesInput from 'react-native-places-input';
import SvgImage from '../../components/SvgImage/SvgImage';
import orText from '../../../assets/images/orText.svg';
import URContainer from '../../components/URContainer/URContainer';
import styles from './userLocation.styles';
import { strings } from '../../utilities/localization/localization';
import { getUserDetails } from '../../state/selectors/UserProfile';
import { userLocationSagaAction, getUserGenresSagaAction } from '../../state/actions/sagas';
import Colors from '../../theme/colors';
import Loader from '../../components/Loader/Loader';

const UserLocation = () => {
  const listenerId = useSelector(getUserDetails);
  const dispatch = useDispatch();
  const showLoading = useSelector(state => state.userLocation.isWaiting);
  const MAP_API_KEY = 'AIzaSyCNNmfTGsBatXy77JEAcjxuHCR2WSxVhvg';
  useEffect(() => {
    dispatch(getUserGenresSagaAction());
  }, []);
  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert(strings('Location.unableToOpen'));
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');
    if (status === 'granted') {
      return true;
    }
    if (status === 'denied') {
      Alert.alert(strings('Location.permissionDenied'));
    }
    if (status === 'disabled') {
      Alert.alert(
        strings('Location.turnOnLocation'),
        '',
        [
          { text: strings('Location.settings'), onPress: openSetting },
          { text: strings('Location.dontUseText'), onPress: () => {} },
        ],
      );
    }
    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        strings('Location.deniedByUser'),
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        strings('Location.revokedByUser'),
        ToastAndroid.LONG,
      );
    }
    return false;
  };

  // eslint-disable-next-line consistent-return
  const getSplitedAddress = location => {
    const splitedAddress = location.split(',');
    const addressLength = splitedAddress.length;
    if (addressLength > 0) {
      switch (addressLength) {
        case 1: {
          return {
            country: splitedAddress[addressLength - 1].trim(),
            zipcode: null,
            state: null,
            city: null,
            street: null,
          };
        }
        case 2: {
          const stateWithoutPincode = splitedAddress[addressLength - 2].replace(/[0-9]/g, '');
          const pincode = splitedAddress[addressLength - 2].replace(/^\D+/g, '');
          return {
            country: splitedAddress[addressLength - 1].trim(),
            zipcode: pincode,
            state: stateWithoutPincode === '' ? null : stateWithoutPincode.trim(),
            city: null,
            street: null,
          };
        }
        case 3: {
          const stateWithoutPincode = splitedAddress[addressLength - 2].replace(/[0-9]/g, '');
          const pincode = splitedAddress[addressLength - 2].replace(/^\D+/g, '');
          return {
            country: splitedAddress[addressLength - 1].trim(),
            zipcode: pincode,
            state: stateWithoutPincode === '' ? null : stateWithoutPincode.trim(),
            city: splitedAddress[addressLength - 3].trim(),
            street: null,
          };
        }
        default: {
          if (addressLength >= 4) {
            const stateWithoutPincode = splitedAddress[addressLength - 2].replace(/[0-9]/g, '');
            const pincode = splitedAddress[addressLength - 2].replace(/^\D+/g, '');
            return {
              country: splitedAddress[addressLength - 1].trim(),
              zipcode: pincode,
              state: stateWithoutPincode === '' ? null : stateWithoutPincode.trim(),
              city: splitedAddress[addressLength - 3].trim(),
              street: splitedAddress.splice(0, addressLength - 3).toString(),
            };
          }
        }
      }
    }
  };

  const getManuallLocation = address => {
    const position = address.result.geometry;
    const manuallLocation = getSplitedAddress(address.result.formatted_address);
    const payload = {
      country: manuallLocation.country,
      zipcode: parseInt(manuallLocation.zipcode),
      state: manuallLocation.state,
      city: manuallLocation.city,
      street: manuallLocation.street,
      latitude: position.location.lat,
      longitude: position.location.lng,
      userId: listenerId.id,
    };
    dispatch(userLocationSagaAction(payload));
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
      return;
    }
    Geolocation.getCurrentPosition(
      position => {
        Geocoder.init(MAP_API_KEY);
        Geocoder.from(position.coords.latitude, position.coords.longitude)
          .then(json => {
            const formattedAddress = json.results[1].formatted_address;
            const detectedLocation = getSplitedAddress(formattedAddress);
            const payload = {
              country: detectedLocation.country,
              zipcode: parseInt(detectedLocation.zipcode),
              state: detectedLocation.state,
              city: detectedLocation.city,
              street: detectedLocation.street,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              userId: listenerId.id,
            };
            dispatch(userLocationSagaAction(payload));
          })
          .catch(error => console.warn(error));
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
      },
    );
  };
  const scrollHeight = Platform.OS === 'android' ? 360 : 0;
  const height = Dimensions.get('window').height + scrollHeight;
  return (
    <URContainer>
      <Loader
        visible={ showLoading }
      />
      <KeyboardAwareScrollView
        contentContainerStyle={ { height } }
        enableOnAndroid
        keyboardOpeningTime={ 0 }
        keyboardShouldPersistTaps='handled'
      >
        <View style={ styles.locationContainer }>
          <Image
            style={ styles.locationIcon }
            source={ require('../../../assets/images/location.png') }
          />
          <Text style={ styles.detectText }>
            { strings('Location.setupText') }
          </Text>
          <Text style={ styles.welcomeText }>
            { strings('Location.welcomeText') }
          </Text>
          <Text style={ styles.hintText }>{ strings('Location.hintText') }</Text>
          <Button
            onPress={ getLocation }
            TouchableComponent={ TouchableOpacity }
            containerStyle={ styles.containerStyle }
            buttonStyle={ styles.detectbtn }
            titleStyle={ styles.btnTitle }
            title={ strings('Location.detectText') }
          />
          <SvgImage iconStyle={ { marginBottom: 32 } } iconName={ orText } width={ 41 } height={ 15 } />
          <PlacesInput
            placeHolder={ strings('Location.manualText') }
            textInputProps={ styles.textInputProps }
            stylesInput={ styles.stylesInput }
            queryCountries={ ['us'] }
            queryTypes='(cities)'
            stylesContainer={ styles.stylesContainer }
            stylesItem={ { borderColor: Colors.textColor } }
            stylesItemText={ styles.stylesItemText }
            stylesList={ styles.stylesList }
            googleApiKey={ MAP_API_KEY }
            language='en-US'
            onSelect={ place => getManuallLocation(place) }
          />
        </View>
      </KeyboardAwareScrollView>
    </URContainer>
  );
};

export default UserLocation;
