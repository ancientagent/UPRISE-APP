import { all, fork } from 'redux-saga/effects';
import { networkSaga } from 'react-native-offline';
import sampleWatcherSaga from './samplerequest/samplerequest.saga';
import signUpWatcherSaga from './signup/signup.saga';
import loginWatcherSaga from './login/login.saga';
import forgotPasswordWatcherSaga from './forgotPassword/forgotPassword.saga';
import ssoLoginWatcherSaga from './signup/ssoLogin.saga';
import verifyUserWatcherSaga from './signup/verifyuser.saga';
import verifyUserNameWatcherSaga from './signup/verifyUserName.saga';
import userLocationWatcherSaga from './userLocation/userLocation.saga';
import genresSelectionWatcherSaga from './genreSelection/genreSelection.saga';
import getUserDetailsWatcherSaga from './getUserDetails/getUserDetails.saga';
import upDateProfileWatcherSaga from './upDateProfile/upDateProfile.saga';
import undoBandFollowWatcherSaga from './undoBandFollow/undoBandFollow.saga';
import bandFollowWatcherSaga from './bandFollow/bandFollow.saga';
import unFollowWatcherSaga from './unFollow/unFollow.saga';
import followWatcherSaga from './follow/follow.saga';
import getRadioSongWatcherSaga from './getRadioSong/getRadioSong.saga';
import postSongIdWatcherSaga from './postSongId/postSongId.saga';
import songfavoriteWatcherSaga from './songfavorite/songfavorite.saga';
import favoriteSongListWatcherSaga from './favoriteSongList/favoriteSongList.saga';
import songUnfavoriteWatcherSaga from './songUnfavorite/songUnfavorite.saga';
import avaliableCitiesWatcherSaga from './avaliableCities/avaliableCities.saga';
import albumsListWatcherSaga from './albumsList/albumsList.saga';
import bandDetailsWatcherSaga from './bandDetails/bandDetails.saga';
import bandGalleryWatcherSaga from './bandGallery/bandGallery.saga';
import bandmembersLlistWatcherSaga from './bandmembersLlist/bandmembersLlist.saga';
import otherUserProfileWatcherSaga from './otherUserProfile/otherUserProfile.saga';
import songBlastWatcherSaga from './songBlast/songBlast.saga';
import songVoteWatcherSaga from './songVote/songVote.saga';
import bandEventsWatcherSaga from './bandEvents/bandEvents.saga';
import followingBandsWatcherSaga from './followingBands/followingBands.saga';
import deleteFollowersWatcherSaga from './deleteFollowers/deleteFollowers.saga';
import songListWatcherSaga from './songList/songList.saga';
import homeEventsWatcherSaga from './homeEvents/homeEvents.saga';
import homeFeedWatcherSaga from './homeFeed/homeFeed.saga';
import followingWatcherSaga from './following/following.saga';
import followersListWatcherSaga from './followersList/followersList.saga';
import songDownVoteWatcherSaga from './songDownVote/songDownVote.saga';
import changePasswordWatcherSaga from './changePassword/changePassword.saga';
import albumDetailsWatcherSaga from './albumDetails/albumDetails.saga';
import mostPopularBandsWatcherSaga from './mostPopularBands/mostPopularBands.saga';
import mostPlayedSongsWatcherSaga from './mostPlayedSongs/mostPlayedSongs.saga';
import upDateCityWatcherSaga from './upDateCity/upDateCity.saga';
import discoveryPopularBandsWatcherSaga from './discoveryPopularBands/discoveryPopularBands.saga';
import mostRatedSongsWatcherSaga from './mostRatedSongs/mostRatedSongs.saga';
import treandingSongsWatcherSaga from './treandingSongs/treandingSongs.saga';
import googleEventWatcherSaga from './googleEvent/googleEvent.saga';
import getGoogleEventWatcherSaga from './getGoogleEvent/getGoogleEvent.saga';
import getDayEventWatcherSaga from './getDayEvent/getDayEvent.saga';
import getNewReleasesWatcherSaga from './getNewReleases/getNewReleases.saga';
import getRadioStationsWatcherSaga from './getRadioStations/getRadioStations.saga';
import getRadioStationsSongsWatcherSaga from './getRadioStationsSongs/getRadioStationsSongs.saga';
import mostPopularAlbumsWatcherSaga from './mostPopularAlbums/mostPopularAlbums.saga';
import mostPopularGenresWatcherSaga from './mostPopularGenres/mostPopularGenres.saga';
import songsByGenreWatcherSaga from './songsByGenre/songsByGenre.saga';
import getUserAvatarWatcherSaga from './getUserAvatar/getUserAvatar.saga';
import getUserGenresWatcherSaga from './getUserGenres/getUserGenres.saga';
import removeEventWatcherSaga from './removeEvent/removeEvent.saga';
import songReportWatcherSaga from './songReport/songReport.saga';
import registerDeviceTokenWatcherSaga from './registerDeviceToken/registerDeviceToken.saga';
import unRegisterDeviceTokenWatcherSaga from './unRegisterDeviceToken/unRegisterDeviceToken.saga';
import homePromosWatcherSaga from './homePromos/homePromos.saga';
import getInstrumentWatcherSaga from './getInstrument/getInstrument.saga';
import bandSongListWatcherSaga from './getBandSongList/getBandSongList.saga';
import updateInstrumentWatcherSaga from './updateInstrument/updateInstrument.saga';
import nearestLocationsWatcherSaga from './nearestLocations/nearestLocations.saga';
import stationSwitchingWatcherSaga from './stationSwitching/stationSwitching.saga';
import getUserStatisticsWatcherSaga from './getUserStatistics/getUserStatistics.saga';
import getEventsStatisticsWatcherSaga from './getEventsStatistics/getEventsStatistics.saga';
import getGenresPrefrenceStatisticsWatcherSaga from './getGenresPrefrenceStatistics/getGenresPrefrenceStatistics.saga';
import getBandsStatisticsTypeWatcherSaga from './getBandsStatistics/getBandsStatistics.saga';
import getRadioStationStatisticsWatcherSaga from './getRadioStationStatistics/getRadioStationStatistics.saga';
import getPopularArtistStatisticsWatcherSaga from './getPopularArtistStatistics/getPopularArtistStatistics.saga';
import getPopularArtistGenresStatisticsWatcherSaga from './getPopularArtistGenresStatistics/getPopularArtistGenresStatistics.saga';

export default function* initialSaga() {
  yield all([
    fork(networkSaga, { pingInterval: 20000 }),
    sampleWatcherSaga(),
    signUpWatcherSaga(),
    loginWatcherSaga(),
    forgotPasswordWatcherSaga(),
    ssoLoginWatcherSaga(),
    verifyUserWatcherSaga(),
    verifyUserNameWatcherSaga(),
    userLocationWatcherSaga(),
    genresSelectionWatcherSaga(),
    getUserDetailsWatcherSaga(),
    upDateProfileWatcherSaga(),
    undoBandFollowWatcherSaga(),
    bandFollowWatcherSaga(),
    unFollowWatcherSaga(),
    followWatcherSaga(),
    getRadioSongWatcherSaga(),
    postSongIdWatcherSaga(),
    songfavoriteWatcherSaga(),
    favoriteSongListWatcherSaga(),
    avaliableCitiesWatcherSaga(),
    songUnfavoriteWatcherSaga(),
    albumsListWatcherSaga(),
    bandDetailsWatcherSaga(),
    bandGalleryWatcherSaga(),
    bandmembersLlistWatcherSaga(),
    otherUserProfileWatcherSaga(),
    songBlastWatcherSaga(),
    songVoteWatcherSaga(),
    bandEventsWatcherSaga(),
    followingBandsWatcherSaga(),
    deleteFollowersWatcherSaga(),
    songListWatcherSaga(),
    homeEventsWatcherSaga(),
    homeFeedWatcherSaga(),
    followingWatcherSaga(),
    followersListWatcherSaga(),
    songDownVoteWatcherSaga(),
    changePasswordWatcherSaga(),
    albumDetailsWatcherSaga(),
    mostPopularBandsWatcherSaga(),
    mostPlayedSongsWatcherSaga(),
    upDateCityWatcherSaga(),
    discoveryPopularBandsWatcherSaga(),
    mostRatedSongsWatcherSaga(),
    treandingSongsWatcherSaga(),
    getGoogleEventWatcherSaga(),
    googleEventWatcherSaga(),
    getDayEventWatcherSaga(),
    getNewReleasesWatcherSaga(),
    getRadioStationsWatcherSaga(),
    getRadioStationsSongsWatcherSaga(),
    mostPopularAlbumsWatcherSaga(),
    mostPopularGenresWatcherSaga(),
    songsByGenreWatcherSaga(),
    getUserAvatarWatcherSaga(),
    getUserGenresWatcherSaga(),
    removeEventWatcherSaga(),
    songReportWatcherSaga(),
    registerDeviceTokenWatcherSaga(),
    unRegisterDeviceTokenWatcherSaga(),
    homePromosWatcherSaga(),
    getInstrumentWatcherSaga(),
    bandSongListWatcherSaga(),
    updateInstrumentWatcherSaga(),
    nearestLocationsWatcherSaga(),
    stationSwitchingWatcherSaga(),
    getUserStatisticsWatcherSaga(),
    getEventsStatisticsWatcherSaga(),
    getGenresPrefrenceStatisticsWatcherSaga(),
    getBandsStatisticsTypeWatcherSaga(),
    getRadioStationStatisticsWatcherSaga(),
    getPopularArtistStatisticsWatcherSaga(),
    getPopularArtistGenresStatisticsWatcherSaga(),
  ]);
}
