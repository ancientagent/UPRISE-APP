/* eslint-disable global-require */
import React from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { FlatGrid } from 'react-native-super-grid';
import URHeaderContainer from '../../../components/URHeaderContainer/URHeaderContainer';
import styles from './AllBandList.styles';
import {
  getFollowingBands,
} from '../../../state/selectors/UserProfile';
import Loader from '../../../components/Loader/Loader';

const AllBandList = ({ navigation }) => {
  const showLoading = useSelector(state => state.followingBands.isWaiting);
  const bandList = useSelector(getFollowingBands);
  return (
    <URHeaderContainer>
      <Loader
        visible={ showLoading }
      />
      <View style={ styles.bandListView }>
        <View style={ styles.bandListContainer }>
          <FlatGrid
            itemContainerStyle={ styles.gridView }
            maxItemsPerRow={ 2 }
            data={ bandList }
            keyExtractor={ item => item.id }
            renderItem={ ({ item }) => (
              <TouchableOpacity
                style={ styles.bandImageView }
                activeOpacity={ 0.7 }
                onPress={ () => navigation.navigate('BandDetails', { bandId: item.bandId }) }
              >
                <Image
                  style={ styles.bandImage }
                  source={ item.logo ? { uri: item.logo } : require('../../../../assets/images/band_img.png') }
                />
                <Text style={ styles.bandText }>{ item.title }</Text>
              </TouchableOpacity>
            ) }
          />
        </View>
        <View style={ styles.miniPlayerStyle } />
      </View>
    </URHeaderContainer>
  );
};
export default AllBandList;
