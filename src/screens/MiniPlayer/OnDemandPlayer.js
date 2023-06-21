/* eslint-disable no-shadow */
/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { Icon } from 'react-native-elements';
import TrackPlayer, {
  Capability,
  Event,
  State,
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import MarqueeText from 'react-native-marquee';
import AsyncStorage
from '@react-native-community/async-storage';
import { resetRoot } from '../../navigators/RootNavigation';
import Pause from '../../../assets/images/pause.svg';
import Colors from '../../theme/colors';
import SvgImage from '../../components/SvgImage/SvgImage';
import playBtn from '../../../assets/images/playBtn.svg';
import favSymbolIcon from '../../../assets/images/favSymbolIcon.svg';
import favSymbolFilledIcon from '../../../assets/images/favSymbolFilledIcon.svg';
import styles from './MiniPlayer.styles';
import {
  songfavoriteSagaAction, songUnfavoriteSagaAction,
} from '../../state/actions/sagas';
import UseProgress from '../../components/UseProgress/UseProgress';
import {
  currentSongData, currentScreen,
} from '../../state/selectors/UserProfile';
import { currentSongDataAction } from '../../state/actions/currentSongData/currentSongData.action';
import { currentScreenAction } from '../../state/actions/currentScreen/currentScreen.action';

const OnDemandPlayer = () => {
  const playbackState = usePlaybackState();
  const dispatch = useDispatch();
  const songData = useSelector(currentSongData);
  const currentRoute = useSelector(currentScreen);
  const playlistData = songData.songList;
  const { intialSongId } = songData;
  const [favSong, setFav] = useState(false);
  const [trackArtwork, setTrackArtwork] = useState();
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [currentSongId, setCurrentSongId] = useState();
  const [playerState, setPlayerState] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const e = await AsyncStorage.getItem('onDemandPlayer');
      setPlayerState(e === 'active');
    }
    fetchData();
  }, []);
  useTrackPlayerEvents([Event.PlaybackQueueEnded], async event => {
    console.log(`TrackPlayerEvent = ${JSON.stringify(event)}}`);
    await TrackPlayer.removeUpcomingTracks();
    await TrackPlayer.pause();
  });
  const songInfo = {
    url: playlistData[0].url,
    title: playlistData[0].title,
    artist: playlistData[0].artist,
    id: playlistData[0].id,
    artwork: playlistData[0].artwork,
    duration: playlistData[0].duration,
  };
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (
      event.type === Event.PlaybackTrackChanged
        && event.nextTrack !== undefined
    ) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const { title, artist, artwork } = track || {};
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);
    }
  });
  useEffect(() => {
    async function fetchData() {
      await AsyncStorage.setItem('page', 'demand');
      setCurrentSongId(playlistData[0].id);
      setupIfNecessary();
    }
    fetchData();
  }, [playlistData]);

  const setupIfNecessary = async () => {
    setFav(playlistData[0].isSongFavorite);
    setTrackArtwork(playlistData[0].artwork);
    setTrackTitle(playlistData[0].title);
    setTrackArtist(playlistData[0].artist);
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack !== null) {
      return;
    }
    await TrackPlayer.reset();
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
      ],
    });
    await TrackPlayer.add(songInfo);
    await TrackPlayer.skip(intialSongId);
    await TrackPlayer.play();
  };
  const defaultPlayerImg = require('../../../assets/images/music_default_img.png');

  const togglePlayback = async playbackState => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack === null) {
      // TODO: Perhaps present an error or restart the playlist?
    } else if (playbackState !== State.Playing) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  };
  const returnPlayBtn = () => {
    switch (playbackState) {
      case State.Playing || playbackState === 3:
        return <SvgImage iconStyle={ { marginRight: 20 } } iconName={ Pause } height={ 27 } width={ 27 } />;
      case State.Paused:
        return <SvgImage iconStyle={ { marginRight: 20 } } iconName={ playBtn } height={ 27 } width={ 27 } />;
      default:
        return (
          Platform.OS === 'ios'
            ? (
              <Image
                style={ styles.songLoader }
                source={ require('../../../assets/images/song_loader.gif') }
              />
            )
            : (
              <View style={ { marginRight: 20 } }>
                <ActivityIndicator size={ 26 } color={ Colors.URbtnColor } />
              </View>
            )
        );
    }
  };
  const songfavorite = async () => {
    setFav(true);
    const payload = {
      songId: currentSongId,
    };
    dispatch(songfavoriteSagaAction(payload));
    const songList = playlistData.map(data => ({ ...data, isSongFavorite: true }));
    dispatch(currentSongDataAction({ ...songData, songList }));
  };
  const songunfavorite = async () => {
    setFav(false);
    const payload = {
      songId: currentSongId,
    };
    dispatch(songUnfavoriteSagaAction(payload));
    const songList = playlistData.map(data => ({ ...data, isSongFavorite: false }));
    dispatch(currentSongDataAction({ ...songData, songList }));
  };
  const reloadPlayerData = async () => {
    setPlayerState(false);
    await AsyncStorage.setItem('onDemandPlayer', 'inactive');
    Alert.alert(
      '',
      `Please click OK to quit from the ${trackTitle}`,
      [
        {
          text: 'OK',
          onPress: async () => {
            dispatch(currentScreenAction({ ...currentRoute, ondemandPlayerClose: true }));
            if (currentRoute.screen === 'Home') {
              resetRoot();
            }
            const { songInfo, position } = songData;
            await TrackPlayer.reset();
            await TrackPlayer.add(songInfo);
            await TrackPlayer.seekTo(position);
            await TrackPlayer.pause();
            await TrackPlayer.removeUpcomingTracks();
          },
        },

      ],
      { cancelable: false },
    );
  };
  return (
    playerState
      ? (
        <>
          <View style={ {
            flexDirection: 'row',
            marginTop: 10,
          } }
          >
            <View>
              <Image
                style={ styles.songImage }
                source={ trackArtwork ? { uri: `${trackArtwork}` } : defaultPlayerImg }
              />
            </View>
            <View style={ {
              flexDirection: 'column',
              width: '78%',
            } }
            >
              <View style={ styles.songDetailsText }>
                <View style={ { marginLeft: 9, width: 115 } }>
                  <MarqueeText
                    speed={ 0.2 }
                    marqueeOnStart
                    loop
                    delay={ 1000 }
                  >
                    <Text style={ styles.songName }>
                      { trackTitle }
                    </Text>
                  </MarqueeText>
                  <MarqueeText
                    speed={ 0.2 }
                    marqueeOnStart
                    loop
                    delay={ 1000 }
                  >
                    <Text style={ styles.artistName }>
                      { trackArtist }
                    </Text>
                  </MarqueeText>
                </View>
                <View style={ { flexDirection: 'row' } }>
                  <TouchableOpacity onPress={ () => togglePlayback(playbackState) }>
                    { returnPlayBtn() }
                  </TouchableOpacity>
                  { favSong
                    ? (
                      <TouchableOpacity onPress={ songunfavorite } disabled={ !currentSongId }>
                        <SvgImage
                          iconStyle={ { marginRight: 0 } }
                          iconName={ favSymbolFilledIcon }
                          height={ 24 }
                          width={ 24 }
                        />
                      </TouchableOpacity>
                    )
                    : (
                      <TouchableOpacity onPress={ songfavorite } disabled={ !currentSongId }>
                        <SvgImage
                          iconStyle={ { marginRight: 0 } }
                          iconName={ favSymbolIcon }
                          height={ 24 }
                          width={ 24 }
                        />
                      </TouchableOpacity>
                    ) }
                </View>
              </View>
              <UseProgress
                sliderStyle={ styles.sliderStyle }
                sliderView={ styles.sliderView }
                trackStyle={ styles.trackStyle }
                thumbStyle={ styles.thumbStyle }
                onDemand
                disabled
                timeTextView={ styles.timeTextView }
                timeText={ styles.timeText }
                onSlidingComplete={ async value => {
                  await TrackPlayer.seekTo(value);
                } }
              />
            </View>
          </View>
          <Icon
            type='ionicon'
            name='close-circle-outline'
            size={ 24 }
            color={ Colors.White }
            onPress={ () => reloadPlayerData() }
          />
        </>
      ) : null
  );
};

export default OnDemandPlayer;
