/* eslint-disable radix */
import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Alert, TextInput,
} from 'react-native';
import AsyncStorage
from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import {
  Button, Chip,
} from 'react-native-elements';
import PlacesInput from 'react-native-places-input';
import URContainer from '../../components/URContainer/URContainer';
import {
  userGenresSagaAction, stationSwitchingSagaAction,
} from '../../state/actions/sagas';
import { getUserDetails, getUserGenresList } from '../../state/selectors/UserProfile';
import styles from './RadioPreferences.styles';
import { strings } from '../../utilities/localization/localization';
import Colors from '../../theme/colors';
import RadioButton from '../../components/RadioButton/RadioButton';

const RadioPreferences = ({ route }) => {
  const dispatch = useDispatch();
  const listenerId = useSelector(getUserDetails);
  const [selectedItem, setSelectedItem] = useState(listenerId.radioPrefrence && listenerId.radioPrefrence.location);
  const [initialState, setInitialState] = useState(listenerId.radioPrefrence && listenerId.radioPrefrence.stationType);
  const MAP_API_KEY = 'AIzaSyCNNmfTGsBatXy77JEAcjxuHCR2WSxVhvg';
  const [stationType, setStationType] = useState(null);
  const genreList = useSelector(getUserGenresList);
  const genreData = _.map(genreList, data => ({ ...data, isChecked: false }));
  const [genr, setGenr] = useState();
  const locationData = [{
    id: 1,
    label: 'City',
    stationType: 1,
  }, {
    id: 2,
    label: 'State',
    stationType: 2,
  }, {
    id: 3,
    label: 'National',
    stationType: 3,
  }];
  useEffect(() => {
    checkStatus();
  }, []);
  useEffect(() => {
    setSelectedItem(parseInt(listenerId.radioPrefrence
      && listenerId.radioPrefrence.stationType) === 1 ? listenerId.city : listenerId.state);
  }, [listenerId]);
  const checkStatus = () => {
    const selectedId = _.map(listenerId.radioPrefrence && listenerId.radioPrefrence.genres, generId => generId.id);
    const temp = _.map(genreData, product => {
      if (selectedId.includes(product.id)) {
        return { ...product, isChecked: !product.isChecked };
      }
      return product;
    });
    setGenr(temp);
  };
  const updateCheck = id => {
    const temp = _.map(genr, product => {
      if (id === product.id) {
        return { ...product, isChecked: !product.isChecked };
      }
      return product;
    });
    setGenr(temp);
  };

  const handleChange = id => {
    updateCheck(id);
  };
  const handleSaveBtn = async () => {
    await AsyncStorage.setItem('playerState', 'play');
    const selected = genr.filter(product => product.isChecked);
    const genres = _.map(selected, item => item.name);
    const selectedGenres = _.map(listenerId.radioPrefrence && listenerId.radioPrefrence.genres,
      prefrence => prefrence.name);
    if (genres.length < 1) {
      Alert.alert(strings('GenreSelection.emptyAlertText'));
    } else if (!(_.isEqual(genres.sort(), selectedGenres.sort()))) {
      await (async () => new Promise(resolve => {
        const payload = {
          userId: listenerId.id,
          genres,
          selectedTabId: route.params.selectedTabId,
          callback: resolve,
        };
        dispatch(userGenresSagaAction(payload));
      }))();
    } else if (parseInt(stationType) === 3 || selectedItem === null) {
      const payload = {
        stationPrefrence: 'USA',
        stationType: `${stationType}`,
        selectedTabId: route.params.selectedTabId,
      };
      dispatch(stationSwitchingSagaAction(payload));
    } else {
      const payload = {
        stationPrefrence: selectedItem,
        stationType: `${stationType}`,
        selectedTabId: route.params.selectedTabId,
      };
      dispatch(stationSwitchingSagaAction(payload));
    }
    // if (!(_.isEqual(listenerId.radioPrefrence && listenerId.radioPrefrence.location, selectedItem))
    //  && selectedItem !== null) {
    //   const payload = {
    //     stationPrefrence: selectedItem,
    //     stationType: `${stationType}`,
    //     selectedTabId: route.params.selectedTabId,
    //   };
    //   dispatch(stationSwitchingSagaAction(payload));
    // }
  };
  const renderChips = items => (
    _.map(items, item => (
      <Chip
        title={ item.name }
        TouchableComponent={ TouchableOpacity }
        type={ item.isChecked ? 'solid' : 'outline' }
        onPress={ () => handleChange(item.id) }
        buttonStyle={ [styles.chiBtnStyle, {
          borderColor: item.isChecked ? Colors.URbtnColor : Colors.labelColor,
          backgroundColor: item.isChecked ? Colors.URbtnColor : 'transparent',
        }] }
        titleStyle={ [styles.genrText, { color: item.isChecked ? Colors.Black : Colors.labelColor }] }
        containerStyle={ styles.chipContainer }
      />
    ))
  );
  const getManuallLocation = address => {
    const location = address.split(',');
    setSelectedItem(stationType === 1 ? location[0] : location[1]);
  };
  const renderCityView = () => (
    <View>
      {
        stationType !== 3 ? (
          <PlacesInput
            placeHolder={ strings('Location.manualText') }
            textInputProps={ {
              value: selectedItem,
              style: styles.textInputProps,
              placeholderTextColor: Colors.textColor,
            } }
            // resultRender={ place => (stationType === 1
            //   ? place.structured_formatting.main_text : place.structured_formatting.secondary_text) }
            stylesInput={ styles.stylesInput }
            queryCountries={ ['us'] }
            queryTypes='(cities)'
            stylesContainer={ styles.stylesContainer }
            stylesItem={ { borderColor: Colors.textColor } }
            stylesItemText={ styles.stylesItemText }
            stylesList={ styles.stylesList }
            googleApiKey={ MAP_API_KEY }
            language='en-US'
            onChangeText={ place => setSelectedItem(place) }
            onSelect={ place => getManuallLocation(place.result.formatted_address) }
          />
        ) : (
          <TextInput
            style={ styles.textInput }
            value='USA'
            editable={ false }
          />
        )
      }
      <View style={ { height: '100%', justifyContent: 'space-evenly' } }>
        <Text style={ styles.selectGenrText }>
          { strings('GenreSelection.selectText') }
        </Text>
        <ScrollView>
          <View style={ styles.chipView }>
            { renderChips(genr) }
          </View>
        </ScrollView>
        <Button
          onPress={ handleSaveBtn }
          TouchableComponent={ TouchableOpacity }
          containerStyle={ styles.containerStyle }
          buttonStyle={ styles.buttonStyle }
          titleStyle={ styles.titleStyle }
          title={ strings('GenreSelection.save') }
        />
      </View>
    </View>
  );
  return (
    <URContainer safeAreaViewStyle={ { flex: 1 } }>
      <Text style={ styles.selectPickText }>
        { strings('GenreSelection.selectLocation') }
      </Text>
      <RadioButton
        Data={ locationData }
        initial={ parseInt(initialState) }
        selectedBtn={ e => {
          setStationType(e.stationType);
          if (e.stationType === 1) {
            setSelectedItem(listenerId.city);
          } else if (e.stationType === 2) {
            setSelectedItem(listenerId.state);
          }
          // setSelectedItem(listenerId.radioPrefrence && listenerId.radioPrefrence.location);
        } }
        box={ false }
        circleSize={ 10 }
      />
      <View style={ styles.toggleView }>
        { renderCityView() }
      </View>
    </URContainer>
  );
};

export default RadioPreferences;
