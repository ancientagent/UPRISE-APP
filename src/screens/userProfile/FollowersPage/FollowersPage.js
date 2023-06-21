/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import {
  Text, View, FlatList, Image, TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SearchBar } from 'react-native-elements';
import URHeaderContainer from '../../../components/URHeaderContainer/URHeaderContainer';
import styles from './FollowersPage.styles';
import Colors from '../../../theme/colors';
import {
  getFollowersList,
} from '../../../state/selectors/UserProfile';
import {
  deleteFollowersSagaAction, followersListSagaAction,
} from '../../../state/actions/sagas';
import { strings } from '../../../utilities/localization/localization';
import Loader from '../../../components/Loader/Loader';

const FollowersPage = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const followersList = useSelector(getFollowersList);
  const showLoading = useSelector(state => state.followersList.isWaiting);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(followersListSagaAction());
  }, []);
  useEffect(() => {
    setFilteredDataSource(followersList);
    setMasterDataSource(followersList);
  }, [followersList]);

  const searchFilterFunction = text => {
    if (text) {
      const newData = masterDataSource.filter(item => {
        const itemData = item.userName
          ? item.userName.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };
  const removeUser = id => {
    dispatch(deleteFollowersSagaAction(id));
  };
  const ItemView = ({ item }) => (
    <TouchableOpacity onPress={ () => getItem(item) }>
      <View style={ { marginHorizontal: 28 } }>
        <View style={ styles.ItemView }>
          <View style={ styles.ImageViewStyle }>
            <Image
              style={ styles.ImageStyle }
              source={ item.avatar ? { uri: item.avatar } : require('../../../../assets/images/users.png') }
            />
            <View style={ { width: '60%' } }>
              <Text style={ styles.itemTitle } numberOfLines={ 1 }>
                { item.userName }
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={ () => removeUser(item.id) }>
            <Text style={ styles.removeTxt }>
              { strings('userProfile.remove') }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getItem = item => {
    navigation.navigate({ name: 'OtherProfile', params: { Listener: item.role.name !== 'artist', userName: item.userName, userId: item.id } });
  };

  return (
    <URHeaderContainer>
      <View style={ styles.FollowersPageView }>
        <Loader
          visible={ showLoading }
        />
        <View style={ { height: '83%' } }>
          <SearchBar
            containerStyle={ styles.containerStyle }
            placeholderTextColor={ Colors.sideHeadingText }
            inputContainerStyle={ styles.inputContainerStyle }
            searchIcon={ styles.searchIconStyle }
            onChangeText={ text => searchFilterFunction(text) }
            onClear={ text => searchFilterFunction('') }
            placeholder={ strings('userProfile.search') }
            value={ search }
          />
          <Text style={ styles.FollowingTextStyle }>
            { strings('userProfile.followingYou') }
          </Text>
          <FlatList
            data={ filteredDataSource }
            keyExtractor={ (item, index) => index.toString() }
            renderItem={ ItemView }
          />
        </View>
        <View style={ {
          height: 150,
          backgroundColor: Colors.Black,
        } }
        />
      </View>
    </URHeaderContainer>
  );
};

export default FollowersPage;
