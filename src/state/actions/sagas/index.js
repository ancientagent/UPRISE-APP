/* eslint-disable max-len */
import * as types from '../../types/sagas';

// TODO will remove this line in future
export const sampleRequestSagaAction = payload => ({ type: types.sampleReqSagaType, payload });
export const signupRequestSagaAction = payload => ({ type: types.signupReqSagaType, payload });
export const loginRequestSagaAction = payload => ({ type: types.loginReqSagaType, payload });
export const forgotPasswordRequestSagaAction = payload => ({ type: types.forgotPasswordReqSagaType, payload });
export const updateRefreshTokenRequestSagaAction = payload => ({ type: types.updateRefreshTokenReqSagaType, payload });
export const ssoLoginSagaAction = payload => ({ type: types.SSOLoginType, payload });
export const verifyUserSagaAction = payload => ({ type: types.verifyUserType, payload });
export const verifyUserNameSagaAction = payload => ({ type: types.verifyUserNameType, payload });
export const userLocationSagaAction = payload => ({ type: types.userLocationSagaType, payload });
export const userGenresSagaAction = payload => ({ type: types.userGenresSagaType, payload });
export const getUserDetailsSagaAction = () => ({ type: types.getUserDetailsSagaType });
export const upDateProfileSagaAction = payload => ({ type: types.upDateProfileSagaType, payload });
export const undoBandFollowSagaAction = payload => ({ type: types.undoBandFollowSagaType, payload });
export const bandFollowSagaAction = payload => ({ type: types.bandFollowSagaType, payload });
export const unFollowSagaAction = payload => ({ type: types.unFollowSagaType, payload });
export const followSagaAction = payload => ({ type: types.followSagaType, payload });
export const getRadioSongSagaAction = () => ({ type: types.getRadioSongSagaType });
export const postSongIdSagaAction = payload => ({ type: types.postSongIdSagaType, payload });
export const songfavoriteSagaAction = payload => ({ type: types.songfavoriteSagaType, payload });
export const favoriteSongListSagaAction = () => ({ type: types.favoriteSongListSagaType });
export const songUnfavoriteSagaAction = payload => ({ type: types.songUnfavoriteSagaType, payload });
export const avaliableCitiesSagaAction = () => ({ type: types.avaliableCitiesSagaType });
export const albumsListSagaAction = payload => ({ type: types.albumsListSagaType, payload });
export const bandDetailsSagaAction = payload => ({ type: types.bandDetailsSagaType, payload });
export const bandGallerySagaAction = payload => ({ type: types.bandGallerySagaType, payload });
export const bandmembersLlistSagaAction = payload => ({ type: types.bandmembersLlistSagaType, payload });
export const otherUserProfileSagaAction = payload => ({ type: types.otherUserProfileSagaType, payload });
export const songBlastSagaAction = payload => ({ type: types.songBlastSagaType, payload });
export const songVoteSagaAction = payload => ({ type: types.songVoteSagaType, payload });
export const songDownVoteSagaAction = payload => ({ type: types.songDownVoteSagaType, payload });
export const bandEventsSagaAction = payload => ({ type: types.bandEventsSagaType, payload });
export const followingBandsSagaAction = payload => ({ type: types.followingBandsSagaType, payload });
export const deleteFollowersSagaAction = payload => ({ type: types.deleteFollowersSagaType, payload });
export const songListSagaAction = payload => ({ type: types.songListSagaType, payload });
export const homeEventsSagaAction = () => ({ type: types.homeEventsSagaType });
export const homeFeedSagaAction = () => ({ type: types.homeFeedSagaType });
export const followingSagaAction = () => ({ type: types.followingSagaType });
export const followersListSagaAction = () => ({ type: types.followersListSagaType });
export const changePasswordSagaAction = payload => ({ type: types.changePasswordSagaType, payload });
export const albumDetailsSagaAction = payload => ({ type: types.albumDetailsSagaType, payload });
export const mostPopularBandsSagaAction = payload => ({ type: types.mostPopularBandsSagaType, payload });
export const mostPlayedSongsSagaAction = payload => ({ type: types.mostPlayedSongsSagaType, payload });
export const upDateCitySagaAction = payload => ({ type: types.upDateCitySagaType, payload });
export const mostRatedSongsSagaAction = payload => ({ type: types.mostRatedSongsSagaType, payload });
export const treandingSongsSagaAction = payload => ({ type: types.treandingSongsSagaType, payload });
export const discoveryPopularBandsSagaAction = payload => ({ type: types.discoveryPopularBandsSagaType, payload });
export const googleEventSagaAction = payload => ({ type: types.googleEventSagaType, payload });
export const getGoogleEventSagaAction = () => ({ type: types.getGoogleEventSagaType });
export const getDayEventSagaAction = payload => ({ type: types.getDayEventSagaType, payload });
export const getNewReleasesSagaAction = () => ({ type: types.getNewReleasesSagaType });
export const getRadioStationsSagaAction = () => ({ type: types.getRadioStationsSagaType });
export const getRadioStationsSongsSagaAction = payload => ({ type: types.getRadioStationsSongsSagaType, payload });
export const mostPopularAlbumsSagaAction = payload => ({ type: types.mostPopularAlbumsSagaType, payload });
export const mostPopularGenresSagaAction = payload => ({ type: types.mostPopularGenresSagaType, payload });
export const getSongsByGenreSagaAction = payload => ({ type: types.getSongsByGenreSagaType, payload });
export const getUserAvatarSagaAction = () => ({ type: types.getUserAvatarSagaType });
export const getUserGenresSagaAction = payload => ({ type: types.getUserGenresSagaType, payload });
export const songReportSagaAction = payload => ({ type: types.songReportSagaType, payload });
export const removeEventSagaAction = payload => ({ type: types.removeEventSagaType, payload });
export const registerDeviceTokenSagaAction = payload => ({ type: types.registerDeviceTokenSagaType, payload });
export const unRegisterDeviceTokenSagaAction = payload => ({ type: types.unRegisterDeviceTokenSagaType, payload });
export const homePromosSagaAction = () => ({ type: types.homePromosSagaType });
export const getBandSongListSagaAction = payload => ({ type: types.getBandSongListSagaType, payload });
export const getInstrumentSagaAction = () => ({ type: types.getInstrumentSagaType });
export const updateInstrumentSagaAction = payload => ({ type: types.updateInstrumentSagaType, payload });
export const nearestLocationsSagaAction = () => ({ type: types.nearestLocationsSagaType });
export const stationSwitchingSagaAction = payload => ({ type: types.stationSwitchingSagaType, payload });
export const getUserStatisticsSagaAction = () => ({ type: types.getUserStatisticsSagaType });
export const getEventsStatisticsSagaAction = () => ({ type: types.getEventsStatisticsSagaType });
export const getGenresPrefrenceStatisticsSagaAction = () => ({ type: types.getGenresPrefrenceStatisticsSagaType });
export const getBandsStatisticsSagaAction = () => ({ type: types.getBandsStatisticsSagaType });
export const getRadioStationStatisticsSagaAction = () => ({ type: types.getRadioStationStatisticsSagaType });
export const getPopularArtistStatisticsSagaAction = () => ({ type: types.getPopularArtistStatisticsSagaType });
export const getPopularArtistGenresStatisticsSagaAction = () => ({ type: types.getPopularArtistGenresStatisticsSagaType });
export const getSongAnalyticsSagaAction = () => ({ type: types.getSongAnalyticsSagaType });
export const artistProfileSagaAction = () => ({ type: types.artistProfileSagaType });
export const updateArtistProfileSagaAction = payload => ({ type: types.updateArtistProfileSagaType, payload });

