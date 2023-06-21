/* eslint-disable global-require */
/* eslint-disable radix */
import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Chip, colors } from 'react-native-elements';
import _ from 'lodash';
import { strings } from '../../utilities/localization/localization';
import Colors from '../../theme/colors';
import { stationSwitchingSagaAction } from '../actions/sagas';
import { nearestLocations, getUserDetails } from '../selectors/UserProfile';

const ShowModelView = props => {
  const dispatch = useDispatch();
  const { onDone } = props;
  const locationList = useSelector(nearestLocations);
  const listenerId = useSelector(getUserDetails);
  const showLoading = useSelector(state => state.nearestLocations.isWaiting);
  const [initialState, setInitialState] = useState(listenerId.radioPrefrence && listenerId.radioPrefrence.stationType);
  const [disableState, setDisableState] = useState(true);
  const locationData = _.map(locationList, (data, index) => ({ ...data, isChecked: false, id: index + 1 }));
  const [location, setLocation] = useState();
  useEffect(() => { setLocation(locationData); }, [locationList]);

  const updateCheck = id => {
    const temp = _.map(location, product => {
      if (id !== product.id) {
        return { ...product, isChecked: false };
      }
      if (id === product.id) {
        return { ...product, isChecked: !product.isChecked };
      }
      return product;
    });
    setLocation(temp);
    setDisableState(false);
  };
  const renderChips = items => (
    _.map(items, item => (
      <Chip
        key={ item.id }
        title={ parseInt(initialState) === 1 ? item.cityName : item.stateName }
        TouchableComponent={ TouchableOpacity }
        type={ item.isChecked ? 'solid' : 'outline' }
        onPress={ () => updateCheck(item.id) }
        buttonStyle={ [styles.chipBtnStyle, {
          borderColor: item.isChecked ? Colors.URbtnColor : Colors.labelColor,
          backgroundColor: item.isChecked ? Colors.URbtnColor : 'transparent',
        }] }
        titleStyle={ [styles.genrText, { color: item.isChecked ? Colors.Black : Colors.labelColor }] }
        containerStyle={ styles.chipContainer }
      />
    ))
  );
  const handleSaveBtn = () => {
    const stateObj = _.find(location, ['isChecked', true]);
    _.map(location, data => {
      if (data.isChecked === true) {
        const payload = {
          stationPrefrence: parseInt(initialState) === 1 ? stateObj.cityName : stateObj.stateName,
          stationType: parseInt(initialState) === 1 ? '1' : '2',
        };
        dispatch(stationSwitchingSagaAction(payload));
      } else {
        setDisableState(true);
      }
    });
  };

  const renderEmptySongModel = () => (
    <View style={ styles.modelContainer }>
      <View style={ { marginHorizontal: 12, marginVertical: 10 } }>
        <View style={ styles.emptySongContainer }>
          <Image
            style={ styles.emptySongLocationImg }
            source={ require('../../../assets/images/emptySongLocation.png') }
          />
          <View style={ { marginVertical: 12, alignItems: 'center' } }>
            <Text style={ styles.emptySongText }>
              {
              parseInt(initialState) !== 3 ? strings('emptySongModel.emptySongText') : strings('emptySongModel.nationEmptyText')
            }
            </Text>
            <Text style={ styles.emptySongText }>
              {
              parseInt(initialState) !== 3 ? strings('emptySongModel.particularCity') : strings('emptySongModel.preferenceText')
            }
            </Text>
          </View>
          {
          (parseInt(initialState) === 3 || (locationList && locationList.length === 0)) && (
          <Button
            onPress={ onDone }
            TouchableComponent={ TouchableOpacity }
            containerStyle={ styles.containerStyle }
            buttonStyle={ styles.buttonStyle }
            titleStyle={ styles.titleStyle }
            title={ strings('GenreSelection.ok') }
          />
          )
          }
        </View>
        { (parseInt(initialState) !== 3 && !(locationList && locationList.length === 0)) && (
        <View style={ styles.emptySongModel }>
          <Text style={ styles.suggestionText }>
            { strings('emptySongModel.suggestionText') }
          </Text>
          <View style={ { marginVertical: 12, alignItems: 'center' } }>
            <Text style={ styles.selectText }>
              { strings('emptySongModel.selectText') }
            </Text>
            <Text style={ styles.selectText }>
              { strings('emptySongModel.experienceText') }
            </Text>
          </View>
          <View style={ styles.chipsContainer }>
            { renderChips(_.slice(location, 0, 3)) }
          </View>
          <Button
            onPress={ handleSaveBtn }
            disabled={ disableState }
            TouchableComponent={ TouchableOpacity }
            containerStyle={ styles.containerStyle }
            buttonStyle={ styles.buttonStyle }
            titleStyle={ styles.titleStyle }
            title={ strings('GenreSelection.save') }
          />
        </View>
        ) }
      </View>
    </View>
  );
  return (
    <View style={ styles.popUpView }>
      {
        (showLoading)
          ? (
            <ActivityIndicator
              size='small'
              color={ Colors.URbtnColor }
            />
          ) : renderEmptySongModel()
      }
    </View>
  );
};
const styles = StyleSheet.create({
  chipsContainer: {
    marginVertical: 18,
    marginHorizontal: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectText: {
    fontSize: 14,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.emptymodelTextColor,
  },
  suggestionText: {
    fontSize: 20,
    color: Colors.White,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    marginTop: 10,
  },
  genrText: {
    marginHorizontal: 8,
    color: Colors.labelColor,
    fontWeight: '400',
    fontFamily: 'Oswald Regular',
    fontSize: 14,
  },
  chipBtnStyle: {
    borderWidth: 1,
    padding: 5,
  },
  chipContainer: {
    flexDirection: 'row',
    marginRight: 15,
    marginBottom: 12,
  },
  modelContainer: {
    backgroundColor: Colors.modelContainerColor,
    marginHorizontal: 30,
    width: '85%',
  },
  titleStyle: {
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.Black,
  },
  buttonStyle: {
    backgroundColor: Colors.eventNameTextColor,
    width: '100%',
    borderRadius: 0,
  },
  containerStyle: {
    borderRadius: 0,
    width: '95%',
    marginBottom: 15,
  },
  popUpView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blurModelColor,
  },
  emptySongContainer: {
    backgroundColor: Colors.emptyModelBg,
    borderColor: Colors.placeholderTextColor,
    borderWidth: 0.6,
    alignItems: 'center',
    borderRadius: 3,
    marginBottom: 15,
  },
  emptySongModel: {
    backgroundColor: Colors.emptyModelBg,
    borderColor: Colors.placeholderTextColor,
    borderWidth: 0.6,
    alignItems: 'center',
    borderRadius: 3,
  },
  emptySongLocationImg: { height: 52, width: 52, marginTop: 9 },
  emptySongText: {
    fontFamily: 'Oswald Light',
    fontSize: 15,
    fontWeight: '300',
    color: '#EFF0F2',
  },
});
export default ShowModelView;
