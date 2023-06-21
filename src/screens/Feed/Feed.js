/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import {
  View, Text, Image, Modal, TouchableOpacity, FlatList, Alert, ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import { ScrollView } from 'react-native-virtualized-view';
import TrackPlayer from 'react-native-track-player';
import albumVector from '../../../assets/images/albumVector.svg';
import clock from '../../../assets/images/clock.svg';
import location from '../../../assets/images/location_on.svg';
import regularcalendar from '../../../assets/images/regularcalendar.svg';
import Colors from '../../theme/colors';
import styles from './Feed.styles';
import SvgImage from '../../components/SvgImage/SvgImage';
import radioStations from '../../../assets/images/radio_stations.svg';
import {
  getHomeFeed, getRadioStations, getNewReleases, getUserDetails,
} from '../../state/selectors/UserProfile';
import {
  homeFeedSagaAction, googleEventSagaAction, getNewReleasesSagaAction,
  getRadioStationsSagaAction, removeEventSagaAction,
} from '../../state/actions/sagas';
import bandVector from '../../../assets/images/bandVector.svg';
import { strings } from '../../utilities/localization/localization';
import { getStationBgColor } from '../../utilities/utilities';

const Feed = props => {
  const { navigation } = props;
  const FeedData = useSelector(getHomeFeed);
  const stateName = useSelector(getRadioStations);
  const newReleases = useSelector(getNewReleases);
  const userDetails = useSelector(getUserDetails);
  const [FeedList, setFeedList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const showLoading = useSelector(state => state.getNewReleases.isWaiting
    || state.getRadioStations.isWaiting || state.homeFeed.isWaiting);

  const eventInfo = {
    band: { title: '' },
    createdAt: '',
    event: {
      endTime: '',
      addtoCalender: false,
      eventName: '',
      id: 0,
      location: null,
      startTime: '',
      thumbnail: null,
    },
  };
  const [eventDetails, setEventDetails] = useState(eventInfo);
  const dispatch = useDispatch();
  useEffect(() => {
    getFeedData(FeedData);
  }, [FeedData]);
  useEffect(() => {
    console.log('FeedList', FeedList);
  }, [FeedList]);
  useEffect(() => {
    dispatch(homeFeedSagaAction());
    dispatch(getNewReleasesSagaAction());
    dispatch(getRadioStationsSagaAction());
  }, []);
  const getFeedData = Data => {
    // const data = _.orderBy(FeedData, [item => moment(item.createdAt)], ['desc']);
    const getfirstRandom = Math.floor(Math.random() * Data.length);
    const getsecondRandom = Math.floor(Math.random() * Data.length);
    // console.log('Randomposition', getfirstRandom, getsecondRandom);
    if (Data.length > 0) {
      Data.splice(getfirstRandom, 0, {
        type: 'NEW_RELEASES',
      });
      Data.splice(getsecondRandom, 0, {
        type: 'RADIO_STATIONS',
      });
    }
    return setFeedList(Data);
  };

  const formatedSongList = List => {
    const songDetails = _.map(List, data => {
      const url = data.song;

      const artist = _.get(data, 'band.title', '');

      const artwork = data.thumbnail;
      return {
        ...data,
        url,
        artwork,
        artist,
      };
    });

    return songDetails;
  };

  const renderFeed = item => {
    switch (item.type) {
      case 'UPLOAD_SONG':
        return renderUploadFeed(item);

      case 'ADD_EVENT':
        return renderEventFeed(item);

      case 'UPVOTE_SONG':
        return renderUpvoteFeed(item);

      case 'FOLLOW_USER':
        return renderFollowFeed(item);

      case 'BLAST_SONG':
        return renderBlastFeed(item);

      case 'NEW_RELEASES':
        return renderNewReleases();

      case 'RADIO_STATIONS':
        return renderRadioStations();

      default:
        return null;
    }
  };
  const ListEmptyComponent = () => (
    <View style={ { alignItems: 'center' } }>
      <Image
        style={ styles.illustrationStyle }
        source={ require('../../../assets/images/More_feed_illustration.png') }
      />
      { userDetails.following === 0 && (<Text style={ styles.welcomeText }>{ strings('Feed.welcomeText') }</Text>) }
      <Text style={ styles.followText }>{ strings('Feed.followText') }</Text>
    </View>
  );
  const navOndemandPage = item => {
    const songDetails = [{
      id: item.song.id,
      artist: item.band.title,
      artwork: item.song.thumbnail,
      url: item.song.song,
      title: item.song.title,
      duration: item.song.duration,
      isSongFavorite: item.song.isSongFavorite,
    }];
    return (
      Alert.alert(
        'Uprise',
        'Now your’re switching to on-demand player',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: async () => {
              const songInfo = await TrackPlayer.getTrack(0);
              navigation.navigate('OnDemandMusic', {
                songList: songDetails,
                intialSongId: 0,
                songInfo,
                songState: await TrackPlayer.getState(),
                position: await TrackPlayer.getPosition(),
              });
            },
          },
        ],
      ));
  };

  const renderUploadFeed = item => (
    <TouchableOpacity
      style={ styles.feedContainerView }
      activeOpacity={ 1 }
      onPress={ () => navigation.navigate('BandDetails', {
        bandId: item.band.id,
      }) }
    >
      <View style={ {
        margin: 15,
      } }
      >
        <View style={ styles.feedProfileView }>
          <Image
            style={ styles.feedProfile }
            source={ item.band.logo ? {
              uri: item.band.logo,
            } : require('../../../assets/images/band_defult_img.png') }
          />
          <TouchableOpacity
            style={ {
              flexDirection: 'column',
            } }
            onPress={ () => navigation.navigate('BandDetails', {
              bandId: item.band.id,
            }) }
          >
            <Text style={ [styles.feedText, { textTransform: 'capitalize' }] }>
              { item.band.title }
            </Text>
            <Text style={ styles.feedTimeText }>
              { moment.utc(item.createdAt).local().startOf('seconds').fromNow() }
            </Text>
          </TouchableOpacity>
        </View>
        <View style={ {
          marginVertical: 8,
        } }
        >
          <Image
            style={ styles.imageView }
            source={ item.song.thumbnail ? {
              uri: item.song.thumbnail,
            } : require('../../../assets/images/feed_music_img.png') }
          />
        </View>
        <View>
          <Text style={ styles.feedText }>
            { strings('Feed.heyThere') }
            { item.band.title }
            { strings('Feed.haveReleased') }
            <Text style={ styles.songTitle }>
              { item.song.title }
            </Text>
            { /* { strings('Feed.theirAlbum') } */ }
          </Text>
          { /* <TouchableOpacity onPress={ () => navOndemandPage(item) }>
            <Text style={ styles.feedClick }>
              { strings('General.listenSong') }
            </Text>
          </TouchableOpacity> */ }
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEventFeed = item => (
    <View style={ styles.feedContainerView }>
      <View style={ {
        margin: 15,
      } }
      >
        <View style={ styles.feedProfileView }>
          <Image
            style={ styles.feedProfile }
            source={ item.band.logo ? {
              uri: item.band.logo,
            } : require('../../../assets/images/band_defult_img.png') }
          />
          <TouchableOpacity
            style={ {
              flexDirection: 'column',
            } }
            onPress={ () => {
              navigation.navigate('BandDetails', {
                bandId: item.band.id,
              });
            } }
          >
            <Text style={ styles.eventBandName }>
              { item.band.title }
            </Text>
            <Text style={ styles.feedTimeText }>
              { moment.utc(item.createdAt).local().startOf('seconds').fromNow() }
            </Text>
          </TouchableOpacity>
        </View>
        <View style={ {
          marginVertical: 8,
        } }
        >
          <Image
            style={ styles.imageView }
            source={ item.event.thumbnail ? {
              uri: item.event.thumbnail,
            } : require('../../../assets/images/event.png') }
          />
        </View>
        <View>
          <Text style={ styles.feedText }>
            { item.band.title }
            { strings('Feed.hasEvent') }
            <Text style={ {
              color: Colors.heighlatedColor,
            } }
            >
              { item.event.eventName }
            </Text>
            { strings('Feed.on') }
            { new Date(item.event.startTime).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }) }
            { strings('Feed.in') }
            { item.event.cityName ? item.event.cityName : item.event.stateName }
            .
          </Text>
          <TouchableOpacity onPress={ () => {
            setEventDetails(item);
            setModalVisible(!modalVisible);
          } }
          >
            <Text style={ styles.feedClick }>
              { strings('Feed.moreDetails') }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderUpvoteFeed = item => {
    const songDetails = [{
      id: item.song.id,
      artist: item.band.title,
      artwork: item.song.thumbnail,
      url: item.song.song,
      title: item.song.title,
      duration: item.song.duration,
      isSongFavorite: item.song.isSongFavorite,
    }];
    return (
      <TouchableOpacity
        style={ styles.feedContainerView }
        activeOpacity={ 1 }
        onPress={ () => navigation.navigate({
          name: 'OtherProfile',
          params: {
            Listener: item.initiator.role.name,
            userName: item.initiator.userName,
            userId: item.initiator.id,
          },
        }) }
      >
        <View style={ {
          margin: 15,
        } }
        >
          <View style={ styles.feedProfileView }>
            <Image
              style={ styles.feedProfile }
              source={ item.initiator.avatar ? {
                uri: item.initiator.avatar,
              } : require('../../../assets/images/users.png') }
            />
            <TouchableOpacity
              style={ {
                flexDirection: 'column',
              } }
              onPress={ () => navigation.navigate({
                name: 'OtherProfile',
                params: {
                  Listener: item.initiator.role.name,
                  userName: item.initiator.userName,
                  userId: item.initiator.id,
                },
              }) }
            >
              <Text style={ styles.feedText }>
                { item.initiator.userName }
              </Text>
              <Text style={ styles.feedTimeText }>
                { moment.utc(item.createdAt).local().startOf('seconds').fromNow() }
              </Text>
            </TouchableOpacity>
          </View>
          <View style={ {
            marginVertical: 8,
          } }
          >
            <Image
              style={ styles.imageView }
              source={ item.song.thumbnail ? {
                uri: item.song.thumbnail,
              } : require('../../../assets/images/feed_music_img.png') }
            />
          </View>
          <View>
            <Text style={ styles.feedText }>
              { item.initiator.userName }
              { strings('Feed.upvotedSong') }
              <Text style={ {
                color: Colors.heighlatedColor,
              } }
              >
                { item.song.title }
                { ' ' }
              </Text>
            </Text>
            { /* <TouchableOpacity
              activeOpacity={ 0.8 }
              onPress={ async () => {
                Alert.alert(
                  'Uprise',
                  'Now your’re switching to on-demand player',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Continue',
                      onPress: async () => {
                        const songInfo = await TrackPlayer.getTrack(0);
                        navigation.navigate('OnDemandMusic', {
                          songList: songDetails,
                          intialSongId: 0,
                          songInfo,
                          songState: await TrackPlayer.getState(),
                          position: await TrackPlayer.getPosition(),
                        });
                      },
                    },
                  ],
                );
              } }
            >
              <Text style={ styles.feedClick }>
                { strings('General.listenSong') }
              </Text>
            </TouchableOpacity> */ }
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFollowFeed = item => (
    <TouchableOpacity
      style={ styles.feedContainerView }
      activeOpacity={ 1 }
      onPress={ () => {
        navigation.navigate({
          name: 'OtherProfile',
          params: {
            Listener: item.initiator.role.name,
            userName: item.initiator.userName,
            userId: item.initiator.id,
          },
        });
      } }
    >
      <View style={ {
        margin: 15,
      } }
      >
        <View style={ styles.feedProfileView }>
          <Image
            style={ styles.feedProfile }
            source={ item.initiator.avatar ? {
              uri: item.initiator.avatar,
            } : require('../../../assets/images/notifyProfileIcon1.png') }
          />
          <View style={ {
            flexDirection: 'column',
          } }
          >
            <View style={ {
              flexDirection: 'row',
            } }
            >
              <TouchableOpacity onPress={ () => {
                navigation.navigate({
                  name: 'OtherProfile',
                  params: {
                    Listener: item.initiator.role.name,
                    userName: item.initiator.userName,
                    userId: item.initiator.id,
                  },
                });
              } }
              >
                <Text style={ styles.feedText }>{ item.initiator.userName }</Text>
              </TouchableOpacity>
              <Text style={ styles.feedText }>
                { strings('Feed.hasStarted') }
                <Text style={ {
                  color: Colors.heighlatedColor,
                } }
                >
                  { strings('Feed.followingYou') }
                </Text>
              </Text>
            </View>
            <Text style={ styles.feedTimeText }>
              { moment.utc(item.createdAt).local().startOf('seconds').fromNow() }
            </Text>
          </View>
        </View>
        <View style={ {
          marginVertical: 8,
        } }
        >
          <Image style={ styles.imageView } source={ require('../../../assets/images/feed_defult_Following.png') } />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBlastFeed = item => (
    <TouchableOpacity
      style={ styles.feedContainerView }
      activeOpacity={ 1 }
      onPress={ () => navigation.navigate({
        name: 'OtherProfile',
        params: {
          Listener: item.initiator.role.name,
          userName: item.initiator.userName,
          userId: item.initiator.id,
        },
      }) }
    >
      <View style={ {
        margin: 15,
      } }
      >
        <View style={ styles.feedProfileView }>
          <Image
            style={ styles.feedProfile }
            source={ item.initiator.avatar ? {
              uri: item.initiator.avatar,
            } : require('../../../assets/images/users.png') }
          />
          <TouchableOpacity
            style={ {
              flexDirection: 'column',
            } }
            onPress={ () => navigation.navigate({
              name: 'OtherProfile',
              params: {
                Listener: item.initiator.role.name,
                userName: item.initiator.userName,
                userId: item.initiator.id,
              },
            }) }
          >
            <Text style={ styles.feedText }>
              { item.initiator.userName }
            </Text>
            <Text style={ styles.feedTimeText }>
              { moment.utc(item.createdAt).local().startOf('seconds').fromNow() }
            </Text>
          </TouchableOpacity>
        </View>
        <View style={ {
          marginVertical: 8,
        } }
        >
          <Image
            style={ styles.imageView }
            source={ item.song.thumbnail ? {
              uri: item.song.thumbnail,
            } : require('../../../assets/images/feed_music_img.png') }
          />
        </View>
        <View>
          <Text style={ styles.feedText }>
            { item.initiator.userName }
            { strings('Feed.hasBlasted') }
            <Text style={ {
              color: Colors.heighlatedColor,
            } }
            >
              { item.song.title }
              { ' ' }
            </Text>
          </Text>
          { /* <TouchableOpacity
          onPress={ () => navOndemandPage(item) }
          >
            <Text style={ styles.feedClick }>
              { strings('General.listenSong') }
            </Text>
          </TouchableOpacity> */ }
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNewReleases = () => (
    <View style={ {
      marginLeft: 20,
    } }
    >
      <Text style={ styles.newRelease }>
        { strings('Feed.newReleases') }
      </Text>
      <FlatList
        horizontal
        data={ newReleases }
        renderItem={ ({
          item,
          index,
        }) => (
          <View
          // activeOpacity={ 0.8 }
          // onPress={ async () => {
          //   const songInfo = await TrackPlayer.getTrack(0);
          //   navigation.navigate('OnDemandMusic', {
          //     songList: formatedSongList(newReleases),
          //     intialSongId: index,
          //     songInfo,
          //     songState: await TrackPlayer.getState(),
          //     position: await TrackPlayer.getPosition(),
          //   });
          // } }
          // eslint-disable-next-line react/jsx-closing-bracket-location
          >
            <View style={ styles.albumsImageView }>
              <Image
                style={ styles.albumsImage }
                source={ item.thumbnail ? {
                  uri: item.thumbnail,
                } : require('../../../assets/images/music_default_img.png') }
              />
              <Text style={ styles.albumsTextStyle }>
                { item.title }
              </Text>
              { /* { item.album && item.album.title !== null && (
                <View style={ styles.AlbumNameView }>
                  <SvgImage
                    iconName={ albumVector }
                    iconStyle={ {
                      marginRight: 7,
                    } }
                    width={ 14 }
                    height={ 14 }
                  />
                  <Text style={ styles.AlbumTitle }>{ item.album.title }</Text>
                </View>
              ) } */ }
              <View style={ styles.AlbumNameView }>
                <SvgImage
                  iconName={ bandVector }
                  iconStyle={ {
                    marginRight: 7,
                  } }
                  width={ 12 }
                  height={ 12 }
                />
                <Text style={ styles.AlbumTitle }>{ item.band.title }</Text>
              </View>
            </View>
          </View>
        ) }
      />
    </View>
  );

  const renderRadioStations = () => (
    <View style={ styles.radioStaionView }>
      <Text style={ styles.radioStaion }>
        { strings('Feed.radioStations') }
      </Text>
      <FlatList
        data={ stateName }
        horizontal
        renderItem={ ({
          item,
          index,
        }) => (
          <TouchableOpacity
            style={ {
              flexDirection: 'row',
            } }
            onPress={ () => {
              navigation.navigate('RadioStations', {
                stateName: item,
                bgColor: getStationBgColor[index],
              });
            } }
          >
            <SvgImage
              iconName={ radioStations }
              iconStyle={ {
                backgroundColor: getStationBgColor[index],
                width: 150,
                marginRight: 15,
              } }
              width={ 150 }
              height={ 145 }
            />
            <Text style={ styles.svgTxt }>
              { item }
            </Text>
          </TouchableOpacity>
        ) }
      />
    </View>
  );

  const renderPopupView = item => (
    <View style={ styles.popUpContainer }>
      <View>
        <Image
          style={ styles.eventImage }
          source={ item.event.thumbnail ? {
            uri: item.event.thumbnail,
          } : require('../../../assets/images/event.png') }
        />
        <View style={ {
          marginHorizontal: 10,
        } }
        >
          <View style={ styles.eventTextView }>
            <Text style={ styles.eventText } numberOfLines={ 1 }>
              { item.event.eventName }
            </Text>
            { item.event.startTime >= moment.utc(new Date()).format()
                   && (
                   <>
                     { item.event && item.event.addtoCalender ? (
                       <TouchableOpacity
                         style={ styles.calendarBtnView }
                         onPress={ () => {
                           setFeedList(prevState => {
                             const newState = prevState.map(obj => {
                               if (obj.type === 'ADD_EVENT' && obj.event.id === item.event.id) {
                                 obj.event.addtoCalender = false;
                               }
                               return obj;
                             });
                             return newState;
                           });
                           dispatch(removeEventSagaAction(item.event.id));
                           setModalVisible(!modalVisible);
                         } }
                       >
                         <View style={ styles.addedCalBtn }>
                           <Icon type='ionicon' name='checkmark-outline' size={ 11 } color={ Colors.White } />
                           <Text style={ styles.addCalendarBtnText }>
                             { strings('General.addedToCalendar') }
                           </Text>
                         </View>
                       </TouchableOpacity>
                     ) : (
                       <TouchableOpacity
                         style={ styles.calendarBtnView }
                         onPress={ () => {
                           setFeedList(prevState => {
                             const newState = prevState.map(obj => {
                               if (obj.type === 'ADD_EVENT' && obj.event.id === item.event.id) {
                                 obj.event.addtoCalender = true;
                               }
                               return obj;
                             });
                             return newState;
                           });
                           dispatch(googleEventSagaAction(item.event.id));
                           setModalVisible(!modalVisible);
                         } }
                       >
                         <Text style={ styles.calendarBtnText }>
                           { strings('General.addToCalendar') }
                         </Text>
                       </TouchableOpacity>
                     ) }
                   </>
                   ) }
          </View>
          <View style={ styles.containtView }>
            <SvgImage
              iconName={ bandVector }
              iconStyle={ {
                marginRight: 3,
              } }
              width={ 14 }
              height={ 14 }
            />
            <TouchableOpacity onPress={ () => navigation.navigate('BandDetails', {
              bandId: item.band.id,
            }) }
            >
              <Text style={ styles.bandNameHeadeing }>
                { ' ' }
                { item.band.title }
              </Text>
            </TouchableOpacity>
          </View>
          <View style={ {
            marginRight: 16,
          } }
          >
            <View style={ styles.eventDetailsTextView }>
              <SvgImage
                iconName={ location }
                width={ 14 }
                height={ 14 }
                iconStyle={ {
                  marginTop: 6,
                } }
              />
              <Text style={ styles.eventDetailsText }>
                { item.event.location }
              </Text>
            </View>
            <View style={ styles.eventDetailsTextView }>
              <SvgImage
                iconName={ clock }
                width={ 14 }
                height={ 14 }
                iconStyle={ {
                  marginTop: 6,
                } }
              />
              <Text style={ styles.eventDetailsText }>
                { new Date(item.event.startTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                }) }
                { ' ' }
                { strings('General.onwards') }
              </Text>
            </View>
            <View style={ styles.eventDetailsTextView }>
              <SvgImage
                iconName={ regularcalendar }
                width={ 14 }
                height={ 14 }
                iconStyle={ {
                  marginTop: 6,
                } }
              />
              <Text style={ styles.eventDetailsText }>
                { new Date(item.event.startTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) }
              </Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={ 0.7 }
        style={ styles.modelView }
        onPress={ () => setModalVisible(!modalVisible) }
      >
        <Text style={ styles.closeBtn }>
          { strings('Feed.Close') }
        </Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <ScrollView>
      { showLoading
        ? (
          <ActivityIndicator
            size='small'
            color={ Colors.URbtnColor }
          />
        )
        : (
          <>
            <Modal transparent statusBarTranslucent visible={ modalVisible }>
              <View style={ styles.popUpView }>
                { renderPopupView(eventDetails) }
              </View>
            </Modal>
            <View style={ styles.viewStyle }>
              { FeedData.length === 0 && !showLoading ? ListEmptyComponent() : (
                <FlatList
                  data={ FeedList }
                  renderItem={ ({
                    item,
                  }) => renderFeed(item) }
                  key={ item => item.id }
                />
              ) }
            </View>
          </>
        ) }
    </ScrollView>
  );
};

export default Feed;

