/* eslint-disable no-nested-ternary */
/* eslint-disable global-require */
import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import { FlatGrid } from 'react-native-super-grid';
import { useSelector, useDispatch } from 'react-redux';
import URHeaderContainer from '../../../components/URHeaderContainer/URHeaderContainer';
import styles from './ChangeInstrument.styles';
import {
  getInstrumentList, getUserDetails,
} from '../../../state/selectors/UserProfile';
import Loader from '../../../components/Loader/Loader';
import { updateInstrumentSagaAction } from '../../../state/actions/sagas';

const ChangeInstrument = props => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const userDetails = useSelector(getInstrumentList);
  const userData = useSelector(getUserDetails);
  const instruments = _.map(userData.instruments, data => data.id);
  const userAvatar = _.map(userDetails, data => ({ ...data, isSelected: instruments[0] === data.id }));
  const showLoading = useSelector(state => state.updateInstrument.isWaiting);
  const [avatarList, setAvatarList] = useState(userAvatar);
  const updateCheck = id => {
    const userList = _.map(userDetails, data => ({ ...data, isSelected: false }));
    const temp = _.map(userList, product => {
      if (id === product.id) {
        return { ...product, isSelected: !product.isSelected };
      }
      return product;
    });
    setAvatarList(temp);
  };
  return (
    <URHeaderContainer>
      <Loader
        visible={ showLoading }
      />
      <Text style={ styles.ChooseTextStyle }>Choose an instrument that you are interested in</Text>
      <View style={ styles.AllAlbumsContainer }>
        <FlatGrid
          itemContainerStyle={ styles.gridView }
          maxItemsPerRow={ 3 }
          itemDimension={ 100 }
          data={ avatarList }
          key={ item => item.id }
          renderItem={ ({ item }) => (
            <TouchableOpacity
              style={ { width: 80 } }
              activeOpacity={ 0.8 }
              onPress={ () => {
                updateCheck(item.id);
              } }
            >
              <View style={ styles.memberImageView }>
                <Image
                  style={ item.isSelected ? styles.selectedImageStyle : styles.ImageStyle }
                  source={ { uri: item.url } }
                />
                { item.isSelected
                && (
                <Image
                  style={ {
                    height: 15, width: 15, position: 'absolute', right: 6, top: 6,
                  } }
                  source={ require('../../../../assets/images/tick-circle.png') }
                />
                ) }
                <Text style={ styles.instrumentName }>{ item.name }</Text>
              </View>
            </TouchableOpacity>
          ) }
        />
        <View style={ styles.miniPlayerStyle }>
          <TouchableOpacity
            activeOpacity={ 0.7 }
            style={ styles.modelView }
            onPress={ () => {
              const selected = avatarList.filter(product => product.isSelected);
              const instrumentIds = _.map(selected, item => item.id);
              const payload = {
                userId: userData.id,
                instrumentIds,
              };
              dispatch(updateInstrumentSagaAction(payload));
              navigation.goBack();
            } }
          >
            <Text style={ styles.closeBtn }>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </URHeaderContainer>
  );
};

export default ChangeInstrument;
