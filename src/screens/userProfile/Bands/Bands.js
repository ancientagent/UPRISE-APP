/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import {
  Text, View, FlatList, Image, TouchableOpacity,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Bands.styles';
import Colors from '../../../theme/colors';
import { getFollowingBands } from '../../../state/selectors/UserProfile';
import {
  undoBandFollowSagaAction,
} from '../../../state/actions/sagas';
import { strings } from '../../../utilities/localization/localization';
import Loader from '../../../components/Loader/Loader';

const Bands = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const bandList = useSelector(getFollowingBands);
  const showLoading = useSelector(state => state.followingBands.isWaiting);

  const dispatch = useDispatch();
  useEffect(() => {
    setFilteredDataSource(bandList);
    setMasterDataSource(bandList);
  }, [bandList]);

  const undoBandFollow = id => {
    const payload = {
      bandId: id,
    };
    dispatch(undoBandFollowSagaAction(payload));
  };
  const searchFilterFunction = text => {
    if (text) {
      const newData = masterDataSource.filter(item => {
        const itemData = item.title
          ? item.title.toUpperCase()
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

  const ItemView = ({ item }) => (
    <TouchableOpacity onPress={ () => getItem(item) }>
      <View style={ { marginHorizontal: 28 } }>
        <View style={ styles.ItemViewStyle }>
          <View style={ styles.ImageView }>
            <Image
              style={ styles.ImageStyle }
              source={ item.logo ? { uri: item.logo } : require('../../../../assets/images/band_img.png') }
            />
            <View style={ { width: '60%' } }>
              <Text style={ styles.titleStyle } numberOfLines={ 1 }>
                { item.title }
              </Text>
            </View>
          </View>
          { item.amiFollowing
            && (
              <TouchableOpacity onPress={ () => undoBandFollow(item.bandId) }>
                <Text style={ styles.unfollowtxt }>
                  { strings('General.unFollow') }
                </Text>
              </TouchableOpacity>
            ) }
        </View>
      </View>
    </TouchableOpacity>
  );

  const getItem = item => {
    navigation.navigate('BandDetails', { bandId: item.bandId });
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
      <Text style={ styles.followStyle }>
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

export default Bands;
