import { combineReducers } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import { reducer as network } from 'react-native-offline';
import TrackPlayer from 'react-native-track-player';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import navReducer from './navigation/NavigationReducer';
import sampleReducer from './request/samplerequest/samplerequest.reducer';
import networkPopup from './network/Network.reducer';
import signupReducer from './request/signup/signup.reducer';
import loginReducer from './request/login/login.reducer';
import { SIGN_OUT } from '../types/ActionTypes';
import forgotPasswordReducer from './request/forgotPassword/forgotPassword.reducer';
import welcomeSlideReducer from './welcomeSlide/welcomeSlide.reducer';
import currentSongDataReducer from './currentSongData/currentSongData.reducer';
import ssoLoginReducer from './request/signup/ssoLogin.reducer';
import verifyUserReducer from './request/signup/verifyuser.reducer';
import verifyUserNameReducer from './request/signup/verifyUserName.reducer';
import userLocationReducer from './request/userLocation/userLocation.reducer';
import userGenresReducer from './request/genreSelection/genreSelection.reducer';
import getUserDetailsReducer from './request/getUserDetails/getUserDetails.reducer';
import upDateProfileReducer from './request/upDateProfile/upDateProfile.reducer';
import undoBandFollowReducer from './request/undoBandFollow/undoBandFollow.reducer';
import bandFollowReducer from './request/bandFollow/bandFollow.reducer';
import unFollowReducer from './request/unFollow/unFollow.reducer';
import followReducer from './request/follow/follow.reducer';
import postSongIdReducer from './request/postSongId/postSongId.reducer';
import getRadioSongReducer from './request/getRadioSong/getRadioSong.reducer';
import userAuthrReducer from './userAuth/userAuth.reducer';
import songfavoriteReducer from './request/songfavorite/songfavorite.reducer';
import favoriteSongListReducer from './request/favoriteSongList/favoriteSongList.reducer';
import songUnfavoriteReducer from './request/songUnfavorite/songUnfavorite.reducer';
import avaliableCitiesReducer from './request/avaliableCities/avaliableCities.reducer';
import albumsListReducer from './request/albumsList/albumsList.reducer';
import bandDetailsReducer from './request/bandDetails/bandDetails.reducer';
import bandGalleryReducer from './request/bandGallery/bandGallery.reducer';
import bandmembersLlistReducer from './request/bandmembersLlist/bandmembersLlist.reducer';
import otherUserProfileReducer from './request/otherUserProfile/otherUserProfile.reducer';
import songBlastReducer from './request/songBlast/songBlast.reducer';
import songVoteReducer from './request/songVote/songVote.reducer';
import bandEventsReducer from './request/bandEvents/bandEvents.reducer';
import followingBandsReducer from './request/followingBands/followingBands.reducer';
import deleteFollowersReducer from './request/deleteFollowers/deleteFollowers.reducer';
import songListReducer from './request/songList/songList.reducer';
import homeEventsReducer from './request/homeEvents/homeEvents.reducer';
import homeFeedReducer from './request/homeFeed/homeFeed.reducer';
import followingReducer from './request/following/following.reducer';
import followersListReducer from './request/followersList/followersList.reducer';
import songDownVoteReducer from './request/songDownVote/songDownVote.reducer';
import changePasswordReducer from './request/changePassword/changePassword.reducer';
import albumDetailsReducer from './request/albumDetails/albumDetails.reducer';
import mostPopularBandsReducer from './request/mostPopularBands/mostPopularBands.reducer';
import mostPlayedSongsReducer from './request/mostPlayedSongs/mostPlayedSongs.reducer';
import upDateCityReducer from './request/upDateCity/upDateCity.reducer';
import treandingSongsReducer from './request/treandingSongs/treandingSongs.reducer';
import mostRatedSongsReducer from './request/mostRatedSongs/mostRatedSongs.reducer';
import discoveryPopularBandsReducer from './request/discoveryPopularBands/discoveryPopularBands.reducer';
import googleEventReducer from './request/googleEvent/googleEvent.reducer';
import getGoogleEventReducer from './request/getGoogleEvent/getGoogleEvent.reducer';
import getDayEventReducer from './request/getDayEvent/getDayEvent.reducer';
import getNewReleasesReducer from './request/getNewReleases/getNewReleases.reducer';
import getRadioStationsReducer from './request/getRadioStations/getRadioStations.reducer';
import getRadioStationsSongsReducer from './request/getRadioStationsSongs/getRadioStationsSongs.reducer';
import mostPopularAlbumsReducer from './request/mostPopularAlbums/mostPopularAlbums.reducer';
import mostPopularGenresReducer from './request/mostPopularGenres/mostPopularGenres.reducer';
import songsByGenreReducer from './request/songsByGenre/songsByGenre.reducer';
import getUserAvatarReducer from './request/getUserAvatar/getUserAvatar.reducer';
import getUserGenresReducer from './request/getUserGenres/getUserGenres.reducer';
import removeEventReducer from './request/removeEvent/removeEvent.reducer';
import songReportReducer from './request/songReport/songReport.reducer';
import getBandSongListReducer from './request/getBandSongList/getBandSongList.reducer';
import getInstrumentReducer from './request/getInstrument/getInstrument.reducer';
import registerDeviceTokenReducer from './request/registerDeviceToken/registerDeviceToken.reducer';
import unRegisterDeviceTokenReducer from './request/unRegisterDeviceToken/unRegisterDeviceToken.reducer';
import homePromosReducer from './request/homePromos/homePromos.reducer';
import updateInstrumentReducer from './request/updateInstrument/updateInstrument.reducer';
import { reduxHelpers } from '../store/reduxHelpers';
import { unRegisterDeviceTokenSagaAction } from '../actions/sagas';
import nearestLocationsReducer from './request/nearestLocations/nearestLocations.reducer';
import stationSwitchingReducer from './request/stationSwitching/stationSwitching.reducer';
import currentScreenReducer from './currentScreen/currentScreen.reducer';
import getUserStatisticsReducer from './request/getUserStatistics/getUserStatistics.reducer';
import getEventsStatisticsReducer from './request/getEventsStatistics/getEventsStatistics.reducer';
import getGenresPrefrenceStatisticsReducer from './request/getGenresPrefrenceStatistics/getGenresPrefrenceStatistics.reducer';
import getBandsStatisticsReducer from './request/getBandsStatistics/getBandsStatistics.reducer';
import getRadioStationStatisticsReducer from './request/getRadioStationStatistics/getRadioStationStatistics.reducer';
import getPopularArtistStatisticsReducer from './request/getPopularArtistStatistics/getPopularArtistStatistics.reducer';
import getPopularArtistGenresStatisticsReducer from './request/getPopularArtistGenresStatistics/getPopularArtistGenresStatistics.reducer';

const appReducer = combineReducers({
  sampleReducer,
  network,
  networkPopup,
  // nav: navReducer,
  getEventsStatistics: getEventsStatisticsReducer,
  getGenresPrefrenceStatistics: getGenresPrefrenceStatisticsReducer,
  getBandsStatistics: getBandsStatisticsReducer,
  getRadioStationStatistics: getRadioStationStatisticsReducer,
  getPopularArtistStatistics: getPopularArtistStatisticsReducer,
  getPopularArtistGenresStatistics: getPopularArtistGenresStatisticsReducer,
  login: loginReducer,
  getUserStatistics: getUserStatisticsReducer,
  stationSwitching: stationSwitchingReducer,
  nearestLocations: nearestLocationsReducer,
  updateInstrument: updateInstrumentReducer,
  getInstrument: getInstrumentReducer,
  getBandSongList: getBandSongListReducer,
  signup: signupReducer,
  ssoLogin: ssoLoginReducer,
  forgotPassword: forgotPasswordReducer,
  welcomeSlide: welcomeSlideReducer,
  currentScreen: currentScreenReducer,
  currentSongData: currentSongDataReducer,
  verifyUser: verifyUserReducer,
  verifyUserName: verifyUserNameReducer,
  userLocation: userLocationReducer,
  userGenres: userGenresReducer,
  getUserDetails: getUserDetailsReducer,
  upDateProfile: upDateProfileReducer,
  undoBandFollow: undoBandFollowReducer,
  bandFollow: bandFollowReducer,
  unFollow: unFollowReducer,
  follow: followReducer,
  postSongId: postSongIdReducer,
  getRadioSong: getRadioSongReducer,
  userAuth: userAuthrReducer,
  songfavorite: songfavoriteReducer,
  favoriteSongList: favoriteSongListReducer,
  songUnfavorite: songUnfavoriteReducer,
  avaliableCities: avaliableCitiesReducer,
  albumsList: albumsListReducer,
  bandDetails: bandDetailsReducer,
  bandGallery: bandGalleryReducer,
  bandmembersLlist: bandmembersLlistReducer,
  otherUserProfile: otherUserProfileReducer,
  songBlast: songBlastReducer,
  songVote: songVoteReducer,
  bandEvents: bandEventsReducer,
  followingBands: followingBandsReducer,
  deleteFollowers: deleteFollowersReducer,
  songList: songListReducer,
  homeEvents: homeEventsReducer,
  homeFeed: homeFeedReducer,
  homePromos: homePromosReducer,
  followingMembers: followingReducer,
  followersList: followersListReducer,
  songDownVote: songDownVoteReducer,
  changePassword: changePasswordReducer,
  albumDetails: albumDetailsReducer,
  mostPopularBands: mostPopularBandsReducer,
  mostPlayedSongs: mostPlayedSongsReducer,
  upDateCity: upDateCityReducer,
  treandingSongs: treandingSongsReducer,
  mostRatedSongs: mostRatedSongsReducer,
  discoveryPopularBands: discoveryPopularBandsReducer,
  googleEvent: googleEventReducer,
  getGoogleEvent: getGoogleEventReducer,
  getDayEvent: getDayEventReducer,
  getNewReleases: getNewReleasesReducer,
  getRadioStations: getRadioStationsReducer,
  getRadioStationsSongs: getRadioStationsSongsReducer,
  mostPopularAlbums: mostPopularAlbumsReducer,
  mostPopularGenres: mostPopularGenresReducer,
  songsByGenre: songsByGenreReducer,
  getUserAvatar: getUserAvatarReducer,
  getUserGenres: getUserGenresReducer,
  removeEvent: removeEventReducer,
  songReport: songReportReducer,
  registerDeviceToken: registerDeviceTokenReducer,
  unRegisterDeviceToken: unRegisterDeviceTokenReducer,
});

const rootReducer = (state, action) => {
  let initialState = { ...state };
  if (action.type === SIGN_OUT) {
    TrackPlayer.stop();
    AsyncStorage.removeItem('persist:root');
    GoogleSignin.revokeAccess();
    initialState = {
      welcomeSlide: { showIntro: true },
    };
    reduxHelpers.dispatch(unRegisterDeviceTokenSagaAction({ token: null }));
    return appReducer(initialState, { type: '' });
  }
  return appReducer(initialState, action);
};

export default rootReducer;
