/* eslint-disable global-require */
import React from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { useSelector } from 'react-redux';
import URHeaderContainer from '../../../components/URHeaderContainer/URHeaderContainer';
import MiniPlayer from '../../MiniPlayer/MiniPlayer';
import styles from '../Statistics.styles';
import {
  getMostPopularBandsList,
} from '../../../state/selectors/UserProfile';
import Loader from '../../../components/Loader/Loader';

const AllMostPopularBands = props => {
  const { navigation } = props;
  const mostPopularBandsList = useSelector(getMostPopularBandsList);
  const showLoading = useSelector(state => state.mostPopularBands.isWaiting);

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
            data={ mostPopularBandsList }
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
                    source={ item.logo ? { uri: item.logo } : require('../../../../assets/images/users.png') }
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

export default AllMostPopularBands;
