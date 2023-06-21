/* eslint-disable no-shadow */
/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, ActivityIndicator, Platform, Alert, BackHandler,
} from 'react-native';
import TrackPlayer, {
  RepeatMode,
  Capability,
  Event,
  State,
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import MarqueeText from 'react-native-marquee';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import favSymbolFilledIcon from '../../../assets/images/favSymbolFilledIcon.svg';
import Colors from '../../theme/colors';
import URContainer from '../../components/URContainer/URContainer';
import SvgImage from '../../components/SvgImage/SvgImage';
import favSymbolIcon from '../../../assets/images/favSymbolIcon.svg';
import onDemandDisableBack from '../../../assets/images/onDemandDisableBack.svg';
import onDemandDisableForward from '../../../assets/images/onDemandDisableForward.svg';
import Pause from '../../../assets/images/pause.svg';
import songSkipBtn from '../../../assets/images/songSkipBtn.svg';
import forwardBtn from '../../../assets/images/forwardBtn.svg';
import styles from './onDemandMusic.styles';
import playBtn from '../../../assets/images/playBtn.svg';
import {
  songfavoriteSagaAction, songUnfavoriteSagaAction,
} from '../../state/actions/sagas';
import UseProgress from '../../components/UseProgress/UseProgress';

const OnDemandMusic = ({ route, navigation }) => {
  const playbackState = usePlaybackState();
  const dispatch = useDispatch();
  const playlistData = route.params.songList;
  const { intialSongId } = route.params;
  const [trackArtwork, setTrackArtwork] = useState();
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [previousBtnState, setPreviousBtnState] = useState();
  const [forwardBtnState, setForwardBtnState] = useState();

  const [favSong, setFav] = useState();

  useTrackPlayerEvents([Event.PlaybackQueueEnded], async event => {
    console.log(`TrackPlayerEvent = ${JSON.stringify(event)}}`);
    await TrackPlayer.pause();
  });

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
      setFav(track.isSongFavorite);
    }
    if (playlistData.length === 1) {
      setPreviousBtnState(false);
      setForwardBtnState(false);
    } else if (event.nextTrack === 0) {
      setPreviousBtnState(false);
      setForwardBtnState(true);
    } else if ((playlistData.length - 1) === event.nextTrack) {
      setForwardBtnState(false);
      await TrackPlayer.pause();
    } else {
      setPreviousBtnState(true);
      setForwardBtnState(true);
    }
  });
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Uprise',
        'Now your’re switching to fairplayer',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: () => { navigation.goBack(); },
          },
        ],
      );
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    AsyncStorage.setItem('page', 'demand');
    setupIfNecessary();
    return async () => {
      willUnMountCall();
    };
  }, []);

  const willUnMountCall = async () => {
    AsyncStorage.setItem('page', 'other');
    const { songInfo } = route.params;
    const { position } = route.params;
    const state = route.params.songState;
    await TrackPlayer.reset();
    await TrackPlayer.add(songInfo);
    await TrackPlayer.seekTo(position);
    if (state === 3 || state === 'playing') {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
    await TrackPlayer.removeUpcomingTracks();
  };

  const setupIfNecessary = async () => {
    await TrackPlayer.reset();
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
    });
    await TrackPlayer.add(playlistData);
    await TrackPlayer.skip(intialSongId);
    await TrackPlayer.play();
    TrackPlayer.setRepeatMode(RepeatMode.Queue);
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
        return <SvgImage iconName={ Pause } height={ 32 } width={ 32 } />;
      case State.Paused:
        return <SvgImage iconName={ playBtn } height={ 32 } width={ 32 } />;
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
              <ActivityIndicator size={ 30 } color={ Colors.URbtnColor } />
            )
        );
    }
  };
  const songfavorite = async () => {
    setFav(true);
    const trackIndex = await TrackPlayer.getCurrentTrack();
    const trackObject = await TrackPlayer.getTrack(trackIndex);
    const payload = {
      songId: trackObject.id || trackObject.songId,
    };
    dispatch(songfavoriteSagaAction(payload));
  };
  const songunfavorite = async () => {
    setFav(false);
    const trackIndex = await TrackPlayer.getCurrentTrack();
    const trackObject = await TrackPlayer.getTrack(trackIndex);
    const payload = {
      songId: trackObject.id || trackObject.songId,
    };
    dispatch(songUnfavoriteSagaAction(payload));
  };
  return (
    <URContainer>
      <View>
        <View style={ styles.Container }>
          <Image
            style={ styles.playerImage }
            source={ trackArtwork ? { uri: `${trackArtwork}` } : defaultPlayerImg }
          />
          <View style={ styles.textContainer }>
            <View style={ { maxWidth: '70%' } }>
              <MarqueeText
                speed={ 0.2 }
                marqueeOnStart
                loop
                delay={ 1000 }
              >
                <Text style={ styles.songTitle }>
                  { trackTitle }
                </Text>
              </MarqueeText>
              <MarqueeText
                speed={ 0.2 }
                marqueeOnStart
                loop
                delay={ 1000 }
              >
                <Text style={ styles.songArtistText }>
                  { trackArtist }
                </Text>
              </MarqueeText>
            </View>
            { favSong
              ? (
                <TouchableOpacity onPress={ songunfavorite }>
                  <SvgImage
                    iconName={ favSymbolFilledIcon }
                    height={ 23 }
                    width={ 21 }
                  />
                </TouchableOpacity>
              )
              : (
                <TouchableOpacity onPress={ songfavorite }>
                  <SvgImage iconName={ favSymbolIcon } height={ 23 } width={ 21 } />
                </TouchableOpacity>
              ) }
          </View>
          <View style={ { marginTop: 35 } }>
            <UseProgress
              sliderStyle={ { height: 20 } }
              trackStyle={ { borderRadius: 0 } }
              thumbStyle={ styles.thumbStyle }
              timeTextView={ styles.songTimeStyle }
              timeText={ styles.timeText }
              onDemand
              // onSlidingComplete={ async value => {
              //   await TrackPlayer.seekTo(value);
              // } }
            />
            <View style={ styles.actionBtnContainer }>
              { previousBtnState
                ? (
                  <TouchableOpacity onPress={ () => TrackPlayer.skipToPrevious() }>
                    <SvgImage iconName={ forwardBtn } height={ 32 } width={ 27 } />
                  </TouchableOpacity>
                )
                : (
                  <SvgImage iconName={ onDemandDisableBack } height={ 32 } width={ 27 } />
                ) }
              <TouchableOpacity onPress={ () => togglePlayback(playbackState) }>
                { returnPlayBtn() }
              </TouchableOpacity>
              { forwardBtnState
                ? (
                  <TouchableOpacity onPress={ () => TrackPlayer.skipToNext() }>
                    <SvgImage iconName={ songSkipBtn } height={ 32 } width={ 27 } />
                  </TouchableOpacity>
                )
                : (
                  <SvgImage iconName={ onDemandDisableForward } height={ 32 } width={ 27 } />
                ) }
            </View>
          </View>
        </View>
      </View>
    </URContainer>
  );
};

export default OnDemandMusic;
