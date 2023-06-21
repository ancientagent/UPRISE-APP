/* eslint-disable global-require */
import React from 'react';
import {
  View, Text, Image, TouchableOpacity, FlatList, Alert,
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import { useSelector } from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import URHeaderContainer from '../../../components/URHeaderContainer/URHeaderContainer';
import bulstVector from '../../../../assets/images/bulstVector.svg';
import upVoteVector from '../../../../assets/images/upVoteVector.svg';
import SvgImage from '../../../components/SvgImage/SvgImage';
import styles from '../Statistics.styles';
import {
  getMostRatedSongsList,
} from '../../../state/selectors/UserProfile';
import Loader from '../../../components/Loader/Loader';

const AllMostRatedSongs = props => {
  const { navigation } = props;
  const mostRatedSongsList = useSelector(getMostRatedSongsList);
  const showLoading = useSelector(state => state.mostRatedSongs.isWaiting);
  const formatedSongList = List => {
    const songDetails = _.map(List, data => {
      const url = data.song;
      const artist = _.get(data, 'band.title', '');
      const artwork = data.thumbnail;
      return {
        ...data, url, artwork, artist,
      };
    });
    return songDetails;
  };
  return (
    <URHeaderContainer>
      <Loader
        visible={ showLoading }
      />
      <View style={ styles.AllAlbumsView }>
        <View style={ [styles.AllAlbumsContainer,
          { marginHorizontal: 20 }] }
        >
          <FlatList
            data={ mostRatedSongsList }
            renderItem={ ({ item, index }) => (
              <View
                // onPress={ async () => {
                //   Alert.alert(
                //     'Uprise',
                //     'Now your’re switching to on-demand player',
                //     [
                //       {
                //         text: 'Cancel',
                //         style: 'cancel',
                //       },
                //       {
                //         text: 'Continue',
                //         onPress: async () => {
                //           const songInfo = await TrackPlayer.getTrack(0);
                //           navigation.navigate('OnDemandMusic', {
                //             songList: formatedSongList(mostRatedSongsList),
                //             intialSongId: index,
                //             songInfo,
                //             songState: await TrackPlayer.getState(),
                //             position: await TrackPlayer.getPosition(),
                //           });
                //         },
                //       },
                //     ],
                //   );
                // } }
              // eslint-disable-next-line react/jsx-closing-bracket-location
              >
                <View style={ styles.ratedImageView }>
                  <View style={ { flexDirection: 'row' } }>
                    <Image
                      style={ styles.ratedImage }
                      source={ item.thumbnail ? { uri: item.thumbnail } : require('../../../../assets/images/music_default_img.png') }
                    />
                    <View style={ styles.ratedTextView }>
                      <Text style={ styles.ratedTextStyle }>
                        { item.title }
                      </Text>
                      <Text style={ styles.ratedTitle }>
                        { item.band.title }
                      </Text>
                      <View style={ styles.ratedNameView }>
                        <SvgImage
                          iconName={ bulstVector }
                          iconStyle={ { marginRight: 7 } }
                          width={ 18 }
                          height={ 18 }
                        />
                        <Text style={ styles.ratedTitle }>{ item.blast }</Text>
                        <SvgImage
                          iconName={ upVoteVector }
                          iconStyle={ { marginLeft: 7, marginRight: 7 } }
                          width={ 18 }
                          height={ 18 }
                        />
                        <Text style={ styles.ratedTitle }>{ item.upvotes }</Text>
                      </View>
                    </View>
                  </View>
                  <View style={ { alignSelf: 'center' } }>
                    <Text style={ styles.ratedDayTextStyle }>
                      { moment.utc(item.createdAt).local().startOf('seconds').fromNow() }
                    </Text>
                  </View>
                </View>
              </View>
            ) }
            keyExtractor={ item => item.id }
          />
        </View>
        <View style={ styles.miniPlayerStyle } />
      </View>
    </URHeaderContainer>
  );
};

export default AllMostRatedSongs;
