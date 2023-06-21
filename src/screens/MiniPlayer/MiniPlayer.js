/* eslint-disable global-require */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, Platform, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
import Pause from '../../../assets/images/pause.svg';
import Colors from '../../theme/colors';
import SvgImage from '../../components/SvgImage/SvgImage';
import playBtn from '../../../assets/images/playBtn.svg';
import songSkipBtn from '../../../assets/images/songSkipBtn.svg';
import favSymbolIcon from '../../../assets/images/favSymbolIcon.svg';
import favSymbolFilledIcon from '../../../assets/images/favSymbolFilledIcon.svg';
import styles from './MiniPlayer.styles';
import { getRadioSong, currentScreen } from '../../state/selectors/UserProfile';
import {
  getRadioSongSagaAction, postSongIdSagaAction, songfavoriteSagaAction, songUnfavoriteSagaAction,
} from '../../state/actions/sagas';
import disableNext from '../../../assets/images/disableNext.svg';
import UseProgress from '../../components/UseProgress/UseProgress';
import { navigationRef } from '../../navigators/RootNavigation';
import PlayerSkelton from './PlayerSkelton';
import { currentScreenAction } from '../../state/actions/currentScreen/currentScreen.action';

const MiniPlayer = () => {
  const playbackState = usePlaybackState();
  const screenData = useSelector(currentScreen);
  const songData = useSelector(getRadioSong);
  const dispatch = useDispatch();
  const defaultPlayerImg = require('../../../assets/images/music_default_img.png');
  const [trackArtwork, setTrackArtwork] = useState();
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [favSong, setFav] = useState();
  const [playerState, setPlayerState] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        const e = await AsyncStorage.getItem('onDemandPlayer');
        setPlayerState(e === 'active');
      }
      fetchData();
    }, [playerState]),
  );
  useEffect(() => {
    dispatch(currentScreenAction({ ...screenData, ondemandPlayerClose: false }));
    async function Storage() {
      await AsyncStorage.setItem('page', 'mini');
    }
    Storage();
  }, []);

  useEffect(() => {
    if (songData.songId) {
      setupIfNecessary();
    }
  }, [songData]);

  const songInfo = {
    url: songData.url,
    title: songData.title,
    artist: songData.band ? songData.band.title : '',
    id: songData.songId,
    artwork: songData.thumbnail,
    duration: songData.duration,
  };

  const setupIfNecessary = async () => {
    const songState = await AsyncStorage.getItem('playerState');
    setFav(songData.isSongFavourited);
    setTrackArtwork(songData.thumbnail);
    setTrackTitle(songData.title);
    setTrackArtist(songData.band ? songData.band.title : '');
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
    if (songState === 'play') {
      await TrackPlayer.play();
    }
    await TrackPlayer.removeUpcomingTracks();
  };

  const togglePlayback = async playbackState => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack === null) {
      // TODO: Perhaps present an error or restart the playlist?
    } else if (playbackState !== State.Playing) {
      await AsyncStorage.setItem('playerState', 'play');
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  };

  useTrackPlayerEvents([Event.PlaybackQueueEnded], async event => {
    const page = await AsyncStorage.getItem('page') || 'other';
    console.log(`TrackPlayerEvent = ${JSON.stringify(event)}}`, page);
    if (page !== 'demand' && songData.songId) {
      await (() => new Promise(resolve => {
        const payload = {
          songId: songData.songId,
          listenSource: 'radio',
          callback: resolve,
        };
        dispatch(postSongIdSagaAction(payload));
      }))();
      dispatch(getRadioSongSagaAction());
      console.log('ash1');
      await AsyncStorage.setItem('playerState', 'play');
      await TrackPlayer.reset();
      await TrackPlayer.updateMetadataForTrack(0, songInfo);
      await TrackPlayer.play();
    }
  });

  const songfavorite = () => {
    setFav(true);
    const payload = {
      songId: songData.songId,
    };
    dispatch(songfavoriteSagaAction(payload));
  };
  const songunfavorite = () => {
    setFav(false);
    const payload = {
      songId: songData.songId,
    };
    dispatch(songUnfavoriteSagaAction(payload));
  };
  const skipNext = async () => {
    await (() => new Promise(resolve => {
      const payload = {
        songId: songData.songId,
        listenSource: 'radio',
        callback: resolve,
      };
      dispatch(postSongIdSagaAction(payload));
    }))();
    dispatch(getRadioSongSagaAction());
    console.log('ash2');
    await AsyncStorage.setItem('playerState', 'play');
    await TrackPlayer.reset();
    await TrackPlayer.updateMetadataForTrack(0, songInfo);
    await TrackPlayer.play();
  };

  const returnPlayBtn = () => {
    switch (playbackState) {
      case State.Playing:
        return <SvgImage iconStyle={ { marginRight: 20 } } iconName={ Pause } height={ 27 } width={ 27 } />;
      case State.Paused:
        return <SvgImage iconStyle={ { marginRight: 20 } } iconName={ playBtn } height={ 27 } width={ 27 } />;
      case State.Ready:
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
  const [hideSkip, setHideSkip] = useState(false);
  return (
    (!songData.url || playerState) ? (
      <PlayerSkelton />
    )
      : (
        <TouchableOpacity
          style={ [styles.miniPlayerView] }
          disabled={ !songData.songId }
          onPress={ () => navigationRef.navigate('RadioScreen') }
        >
          <View>
            <Image
              style={ styles.songImage }
              source={ trackArtwork ? { uri: `${trackArtwork}` } : defaultPlayerImg }
            />
          </View>
          <View style={ styles.songDetailsTextView }>
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
                <TouchableOpacity onPress={ () => togglePlayback(playbackState) } disabled={ !songData.songId }>
                  { songData.songId
                    ? returnPlayBtn()
                    : <SvgImage iconStyle={ { marginRight: 20 } } iconName={ playBtn } height={ 27 } width={ 27 } /> }
                </TouchableOpacity>
                { hideSkip
                  ? (
                    <TouchableOpacity onPress={ skipNext } disabled={ !songData.songId }>
                      <SvgImage iconStyle={ { marginRight: 20 } } iconName={ songSkipBtn } height={ 26 } width={ 26 } />
                    </TouchableOpacity>
                  )
                  : (
                    <SvgImage iconStyle={ { marginRight: 20 } } iconName={ disableNext } height={ 26 } width={ 26 } />
                  ) }
                { favSong
                  ? (
                    <TouchableOpacity onPress={ songunfavorite } disabled={ !songData.songId }>
                      <SvgImage
                        iconStyle={ { marginRight: 0 } }
                        iconName={ favSymbolFilledIcon }
                        height={ 24 }
                        width={ 24 }
                      />
                    </TouchableOpacity>
                  )
                  : (
                    <TouchableOpacity onPress={ songfavorite } disabled={ !songData.songId }>
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
              disabled
              timeTextView={ styles.timeTextView }
              timeText={ styles.timeText }
              hideSkip={ hideSkip }
              setHideSkip={ setHideSkip }
            />
          </View>
        </TouchableOpacity>
      )
  );
};

export default MiniPlayer;
