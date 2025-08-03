/* eslint-disable radix */
/* eslint-disable no-shadow */
/* eslint-disable global-require */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import TrackPlayer, {
  Capability,
  Event,
  State,
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import MarqueeText from 'react-native-marquee';
import {useDispatch, useSelector} from 'react-redux';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Pause from '../../../assets/images/pause.svg';
import Colors from '../../theme/colors';
import URContainer from '../../components/URContainer/URContainer';
import SvgImage from '../../components/SvgImage/SvgImage';
import playBtn from '../../../assets/images/playBtn.svg';
import songSkipBtn from '../../../assets/images/songSkipBtn.svg';
import radioBlastOutline from '../../../assets/images/radio_Blast_outline.svg';
import radioBlast from '../../../assets/images/radioBlast.svg';
import styles from './radioScreen.styles';
import {getRadioSong, getUserDetails} from '../../state/selectors/UserProfile';
import {
  getRadioSongSagaAction,
  songBlastSagaAction,
  postSongIdSagaAction,
  songfavoriteSagaAction,
  songUnfavoriteSagaAction,
  stationSwitchingSagaAction,
} from '../../state/actions/sagas';
import favSymbolIcon from '../../../assets/images/favSymbolIcon.svg';
import favSymbolFilledIcon from '../../../assets/images/favSymbolFilledIcon.svg';
import disableNext from '../../../assets/images/disableNext.svg';
import UseProgress from '../../components/UseProgress/UseProgress';

const RadioScreen = () => {
  const [handleBlast, setHandleBlast] = useState();
  const playbackState = usePlaybackState();
  const songData = useSelector(getRadioSong);
  const userDetails = useSelector(getUserDetails);
  const dispatch = useDispatch();
  const [initialState, setInitialState] = useState(
    userDetails.radioPrefrence && userDetails.radioPrefrence.stationType,
  );
  const [trackArtwork, setTrackArtwork] = useState();
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [favSong, setFav] = useState();
  const [hideSkip, setHideSkip] = useState(false);
  const [currentTier, setCurrentTier] = useState('CITYWIDE');
  const [tierLoading, setTierLoading] = useState(false);

  useEffect(() => {
    async function Storage() {
      await AsyncStorage.setItem('page', 'radio');
    }
    Storage();
  }, []);

  useEffect(() => {
    if (songData.songId) {
      setupIfNecessary();
    }
  }, [songData]);

  useEffect(() => {
    // Set current tier based on user's station preference
    const stationType = userDetails.radioPrefrence?.stationType;
    switch (stationType) {
      case '1':
        setCurrentTier('CITYWIDE');
        break;
      case '2':
        setCurrentTier('STATEWIDE');
        break;
      case '3':
        setCurrentTier('NATIONAL');
        break;
      default:
        setCurrentTier('CITYWIDE');
        break;
    }
  }, [userDetails.radioPrefrence]);

  const songInfo = {
    url: songData.url,
    title: songData.title,
    artist: songData.band ? songData.band.title : '',
    id: songData.songId,
    artwork: songData.thumbnail,
    duration: songData.duration,
  };

  const setupIfNecessary = async () => {
    setHandleBlast(songData.isSongBlasted);
    setFav(songData.isSongFavourited);
    setTrackTitle(songData.title);
    setTrackArtist(songData.band ? songData.band.title : '');
    setTrackArtwork(songData.thumbnail);
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack !== null) {
      return;
    }
    await TrackPlayer.reset();
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [Capability.Play, Capability.Pause],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        // Capability.SkipToNext,
        // Capability.SkipToPrevious,
      ],
      notificationCapabilities: [Capability.Play, Capability.Pause],
    });
    await TrackPlayer.add(songInfo);
    await TrackPlayer.play();
    await TrackPlayer.removeUpcomingTracks();
  };

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

  useTrackPlayerEvents([Event.PlaybackQueueEnded], async event => {
    const page = (await AsyncStorage.getItem('page')) || 'other';
    console.log(`TrackPlayerEvent = ${JSON.stringify(event)}}`, page);
    if (page !== 'demand' && songData.songId) {
      await (() =>
        new Promise(resolve => {
          const payload = {
            songId: songData.songId,
            listenSource: 'radio',
            callback: resolve,
          };
          dispatch(postSongIdSagaAction(payload));
        }))();
      dispatch(getRadioSongSagaAction());
      await TrackPlayer.reset();
      await TrackPlayer.updateMetadataForTrack(0, songInfo);
      await TrackPlayer.play();
    }
  });

  const songBlast = () => {
    setHandleBlast(true);
    const payload = {
      songId: songData.songId,
    };
    dispatch(songBlastSagaAction(payload));
  };

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
    await (() =>
      new Promise(resolve => {
        const payload = {
          songId: songData.songId,
          listenSource: 'radio',
          callback: resolve,
        };
        dispatch(postSongIdSagaAction(payload));
      }))();
    dispatch(getRadioSongSagaAction());
    await TrackPlayer.reset();
    await TrackPlayer.updateMetadataForTrack(0, songInfo);
    await TrackPlayer.play();
  };

  /**
   * Handle tier switching
   * @param {string} newTier - New tier to switch to
   */
  const handleTierSwitch = async newTier => {
    if (newTier === currentTier) {
      return;
    }

    setTierLoading(true);
    try {
      const stationType = {
        CITYWIDE: '1',
        STATEWIDE: '2',
        NATIONAL: '3',
      }[newTier];

      const payload = {
        stationPrefrence:
          newTier === 'NATIONAL'
            ? 'USA'
            : userDetails[newTier === 'CITYWIDE' ? 'city' : 'state'],
        stationType: stationType,
        selectedTabId: 1, // Home tab
      };

      await new Promise(resolve => {
        dispatch(stationSwitchingSagaAction(payload));
        resolve();
      });

      setCurrentTier(newTier);

      // Get new song for the tier
      dispatch(getRadioSongSagaAction());
      await TrackPlayer.reset();
      await TrackPlayer.updateMetadataForTrack(0, songInfo);
      await TrackPlayer.play();
    } catch (error) {
      console.error('Error switching tier:', error);
    } finally {
      setTierLoading(false);
    }
  };

  /**
   * Get tier description
   * @param {string} tier - Tier name
   * @returns {string} Tier description
   */
  const getTierDescription = tier => {
    switch (tier) {
      case 'CITYWIDE':
        return `Latest local uploads from ${userDetails.city}`;
      case 'STATEWIDE':
        return `Best tracks curated by ${userDetails.state} communities`;
      case 'NATIONAL':
        return 'Best tracks curated by statewide communities • No voting available';
      default:
        return '';
    }
  };

  /**
   * Render tier toggle buttons
   */
  const renderTierToggle = () => {
    const tiers = ['CITYWIDE', 'STATEWIDE', 'NATIONAL'];

    return (
      <View style={styles.tierToggleContainer}>
        <Text style={styles.tierToggleTitle}>RaDIYo Broadcast</Text>
        <View style={styles.tierButtonsContainer}>
          {tiers.map(tier => (
            <TouchableOpacity
              key={tier}
              style={[
                styles.tierButton,
                currentTier === tier && styles.tierButtonActive,
              ]}
              onPress={() => handleTierSwitch(tier)}
              disabled={tierLoading}>
              <Text
                style={[
                  styles.tierButtonText,
                  currentTier === tier && styles.tierButtonTextActive,
                ]}>
                {tier}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.tierDescription}>
          {getTierDescription(currentTier)}
        </Text>
      </View>
    );
  };

  const returnPlayBtn = () => {
    if (playbackState === State.Playing) {
      return <SvgImage iconName={Pause} height={32} width={32} />;
    }
    return <SvgImage iconName={playBtn} height={32} width={32} />;
  };

  const defaultPlayerImg = require('../../../assets/images/music_default_img.png');

  return (
    <URContainer>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          height: '100%',
        }}>
        {/* Tier Toggle Section */}
        {renderTierToggle()}

        <View style={styles.Container}>
          <Image
            style={styles.playerImage}
            source={trackArtwork ? {uri: `${trackArtwork}`} : defaultPlayerImg}
          />
          <View style={styles.textContainer}>
            <View style={{maxWidth: '70%'}}>
              <MarqueeText speed={0.2} marqueeOnStart loop delay={1000}>
                <Text style={styles.songTitle}>{trackTitle}</Text>
              </MarqueeText>
              <MarqueeText speed={0.2} marqueeOnStart loop delay={1000}>
                <Text style={styles.songArtistText}>{trackArtist}</Text>
              </MarqueeText>
            </View>
            {favSong ? (
              <TouchableOpacity
                onPress={songunfavorite}
                disabled={!songData.songId}>
                <SvgImage
                  iconStyle={{marginRight: 0}}
                  iconName={favSymbolFilledIcon}
                  height={23}
                  width={21}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={songfavorite}
                disabled={!songData.songId}>
                <SvgImage
                  iconStyle={{marginRight: 0}}
                  iconName={favSymbolIcon}
                  height={23}
                  width={21}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={{marginTop: 35}}>
            <UseProgress
              sliderStyle={{height: 20}}
              trackStyle={{borderRadius: 0}}
              thumbStyle={styles.thumbStyle}
              disabled
              timeTextView={styles.songTimeStyle}
              timeText={styles.timeText}
              hideSkip={hideSkip}
              setHideSkip={setHideSkip}
            />
            <View style={styles.actionBtnContainer}>
              {hideSkip ? (
                <TouchableOpacity
                  onPress={skipNext}
                  disabled={!songData.songId}>
                  <SvgImage iconName={songSkipBtn} height={28} width={32} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <SvgImage iconName={disableNext} height={28} width={32} />
                </TouchableOpacity>
              )}
              {handleBlast ? (
                <SvgImage iconName={radioBlast} height={32} width={32} />
              ) : (
                <TouchableOpacity
                  onPress={songBlast}
                  disabled={!songData.songId}>
                  <SvgImage
                    iconName={radioBlastOutline}
                    height={32}
                    width={32}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => togglePlayback(playbackState)}>
                {returnPlayBtn()}
              </TouchableOpacity>
            </View>
            <View style={styles.locationView}>
              <Icon
                type="ionicon"
                size={13}
                name="location-outline"
                color={Colors.White}
              />
              <Text style={styles.locationText}>
                {parseInt(initialState) === 2
                  ? songData.stateName
                  : songData.cityName}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </URContainer>
  );
};

export default RadioScreen;
