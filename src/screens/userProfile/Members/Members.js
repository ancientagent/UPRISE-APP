/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import {
  Text, View, FlatList, Image, TouchableOpacity,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Members.styles';
import Colors from '../../../theme/colors';
import { getFollowingMembers } from '../../../state/selectors/UserProfile';
import {
  unFollowSagaAction,
} from '../../../state/actions/sagas';
import { strings } from '../../../utilities/localization/localization';
import Loader from '../../../components/Loader/Loader';

const Members = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const membersList = useSelector(getFollowingMembers);
  const showLoading = useSelector(state => state.followingMembers.isWaiting);

  const dispatch = useDispatch();
  useEffect(() => {
    setFilteredDataSource(membersList);
    setMasterDataSource(membersList);
  }, [membersList]);

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

  const undoFollow = id => {
    const payload = {
      followeeId: id,
    };
    dispatch(unFollowSagaAction(payload));
  };

  const ItemView = ({ item }) => (
    <TouchableOpacity onPress={ () => getItem(item) }>
      <View style={ { marginHorizontal: 28 } }>
        <View style={ styles.ItemViewStyle }>
          <View style={ styles.ImageViewStyle }>
            <Image
              style={ styles.ImageStyle }
              source={ item.avatar ? { uri: item.avatar } : require('../../../../assets/images/users.png') }
            />
            <View style={ { width: '60%' } }>
              <Text style={ styles.ItemTitle } numberOfLines={ 1 }>
                { item.userName }
              </Text>
            </View>
          </View>
          { item.amiFollowing && (
          <TouchableOpacity onPress={ () => undoFollow(item.userId) }>
            <Text style={ styles.unfollowText }>
              { strings('General.unFollow') }
            </Text>
          </TouchableOpacity>
          ) }
        </View>
      </View>
    </TouchableOpacity>
  );

  const getItem = item => {
    navigation.navigate({ name: 'OtherProfile', params: { Listener: item.role.name !== 'artist', userName: item.userName, userId: item.userId } });
  };
  return (
    <View style={ { height: '100%' } }>
      <Loader
        visible={ showLoading }
      />
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
      <Text style={ styles.followText }>
        { strings('userProfile.youFollow') }
      </Text>
      <View style={ { height: '100%' } }>
        <FlatList
          data={ filteredDataSource }
          keyExtractor={ (item, index) => index.toString() }
          renderItem={ ItemView }
        />
      </View>
    </View>
  );
};

export default Members;
