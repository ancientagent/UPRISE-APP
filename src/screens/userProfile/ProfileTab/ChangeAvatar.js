/* eslint-disable no-unused-expressions */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-nested-ternary */
/* eslint-disable global-require */
import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { FlatGrid } from 'react-native-super-grid';
import { upDateProfileSagaAction } from '../../../state/actions/sagas';
import URHeaderContainer from '../../../components/URHeaderContainer/URHeaderContainer';
import styles from './ChangeAvatar.styles';
import {
  getUserAvatar, getUserDetails,
} from '../../../state/selectors/UserProfile';
import Loader from '../../../components/Loader/Loader';

const ChangeAvatar = props => {
  const { navigation, route } = props;
  const userDetails = useSelector(getUserAvatar);
  const userData = useSelector(getUserDetails);
  const dispatch = useDispatch();
  const userAvatar = _.map(userDetails, data => ({ ...data, isSelected: userData.avatarId === data.id }));
  const showLoading = useSelector(state => state.getUserAvatar.isWaiting);
  const [avatarList, setAvatarList] = useState(userAvatar);
  const [profileId, setProfileId] = useState(userData.avatarId);
  const [userIcon, setUserIcon] = useState(userData.avatar);
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
      <View style={ { height: '20%', justifyContent: 'center' } }>
        <Image
          style={ styles.iconStyle }
          source={ userIcon ? { uri: userIcon } : userData.avatar ? { uri: userData.avatar } : require('../../../../assets/images/users.png') }
        />
      </View>
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
                setUserIcon(item.url);
                updateCheck(item.id);
                setProfileId(item.id);
              } }
            >
              <View style={ styles.memberImageView }>
                <Image
                  style={ item.isSelected ? styles.selectedImageStyle : styles.memberImageStyle }
                  source={ { uri: item.url } }
                />
              </View>
            </TouchableOpacity>
          ) }
        />
        <View style={ styles.miniPlayerStyle }>
          <TouchableOpacity
            activeOpacity={ 0.7 }
            style={ styles.modelView }
            onPress={ () => {
              // eslint-disable-next-line no-undef
              const formData = new FormData();
              formData.append('userId', userData.id);
              formData.append('userName', userData.userName);
              formData.append('email', userData.email);
              { userData.about === null || '' ? formData.append('about', '') : formData.append('about', userData.about); }
              { userData.mobile === null || '' ? formData.append('mobile', '') : formData.append('mobile', userData.mobile); }
              { userData.facebook === null || '' ? formData.append('facebook', '') : formData.append('facebook', userData.facebook); }
              { userData.instagram === null || '' ? formData.append('instagram', '') : formData.append('instagram', userData.instagram); }
              { userData.twitter === null || '' ? formData.append('twitter', '') : formData.append('twitter', userData.twitter); }
              if (userIcon === null) {
                formData.append('avatar', null);
              } else {
                formData.append('avatar', userIcon);
                formData.append('avatarId', profileId);
              }
              dispatch(upDateProfileSagaAction(formData));
              navigation.goBack();
              route.params.onGoBack(userIcon, profileId);
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

export default ChangeAvatar;
