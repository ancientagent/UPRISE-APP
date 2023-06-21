/* eslint-disable global-require */
import React from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { useSelector } from 'react-redux';
import URHeaderContainer from '../../../components/URHeaderContainer/URHeaderContainer';
import styles from '../DiscoveyPage.styles';
import {
  getDiscoveryPopularBandsList,
} from '../../../state/selectors/UserProfile';
import Loader from '../../../components/Loader/Loader';

const AllPopularBands = props => {
  const { navigation } = props;
  const showLoading = useSelector(state => state.discoveryPopularBands.isWaiting);
  const popularBandsList = useSelector(getDiscoveryPopularBandsList);
  return (
    <URHeaderContainer>
      <Loader
        visible={ showLoading }
      />
      <View style={ styles.AllAlbumsView }>
        <View style={ styles.AllAlbumsContainer }>
          <FlatGrid
            itemContainerStyle={ styles.gridView }
            maxItemsPerRow={ 3 }
            itemDimension={ 100 }
            data={ popularBandsList }
            key={ item => item.id }
            renderItem={ ({ item }) => (
              <TouchableOpacity
                style={ { width: 80 } }
                activeOpacity={ 0.8 }
                onPress={ () => navigation.navigate('BandDetails', { bandId: item.id }) }
              >
                <View style={ styles.memberImageView }>
                  <Image
                    style={ styles.memberImageStyle }
                    source={ item.logo ? { uri: item.logo } : require('../../../../assets/images/band_defult_img.png') }
                  />
                  <Text style={ styles.memberTextStyle } numberOfLines={ 1 }>
                    { item.title }
                  </Text>
                </View>
              </TouchableOpacity>
            ) }
          />
        </View>
        <View style={ styles.miniPlayerStyle } />
      </View>
    </URHeaderContainer>
  );
};

export default AllPopularBands;
