import _ from 'lodash';

export const accessToken = state => state.userAuth.accessToken;
export const refreshToken = state => state.userAuth.refreshToken;
export const welcomeSlide = state => state.welcomeSlide;
export const currentSongData = state => state.currentSongData;
export const currentScreen = state => state.currentScreen;
export const getUserStatistics = state => _.get(state.getUserStatistics, 'result.users', []);
export const getRadioStationStatistics = state => _.get(state.getRadioStationStatistics, 'result.data', {});
export const getBandsStatistics = state => _.get(state.getBandsStatistics, 'result.data', {});
export const getGenresPrefrenceStatistics = state => _.get(state.getGenresPrefrenceStatistics, 'result.data', []);
export const getPopularArtistGenresStatistics = state => _.get(state.getPopularArtistGenresStatistics, 'result.data', []);
export const getPopularArtistStatistics = state => _.get(state.getPopularArtistStatistics, 'result.artist', {});
export const getSongAnalytics = state => _.get(state.getSongAnalytics, 'result.data.songs', []);
export const getEventsStatistics = state => _.get(state.getEventsStatistics, 'result.data', {});
export const nearestLocations = state => _.get(state.nearestLocations, 'result.data', []);
export const loginData = state => _.get(state.login, 'result.data', {});
export const ssoLoginData = state => _.get(state.ssoLogin, 'result.data', {});
export const getUserLocation = state => _.get(state.userLocation, 'result.data', {});
export const getUserDetails = state => _.get(state.getUserDetails, 'result.data', {});
export const getRadioSong = state => _.get(state.getRadioSong, 'result.data', {});
export const favoriteSongList = state => _.get(state.favoriteSongList, 'result.data', {});
export const getBandDetailsList = state => _.get(state.bandDetails, 'result.data', {});
export const getBandmembersLlist = state => _.get(state.bandmembersLlist, 'result.data', []);
export const getBandAlbumsList = state => _.get(state.albumsList, 'result.data', []);
export const getBandSongList = state => _.get(state.getBandSongList, 'result.songs', []);
export const getBandGallery = state => _.get(state.bandGallery, 'result.data.bandGallery', []);
export const getOtherUserData = state => _.get(state.otherUserProfile, 'result.data', {});
export const getBandEvents = state => _.get(state.bandEvents, 'result.data', []);
export const getFollowingBands = state => _.get(state.followingBands, 'result.data', []);
export const getFollowersList = state => _.get(state.followersList, 'result.data', []);
export const getHomeEvents = state => _.get(state.homeEvents, 'result.data', []);
export const getHomePromos = state => _.get(state.homePromos, 'result.data', []);
export const getHomeFeed = state => _.get(state.homeFeed, 'result.data', []);
export const getFollowingMembers = state => _.get(state.followingMembers, 'result.data', []);
export const getSongList = state => _.get(state.songList, 'result.data.data', []);
export const getalbumDetails = state => _.get(state.albumDetails, 'result.data', {});
export const getLocationList = state => _.get(state.avaliableCities, 'result.data', {});
export const getMostPlayedSongList = state => _.get(state.mostPlayedSongs, 'result.data.songs', []);
export const getMostPopularBandsList = state => _.get(state.mostPopularBands, 'result.data.bands', []);
export const getTreandingSongsList = state => _.get(state.treandingSongs, 'result.data.trendingSongs', []);
export const getMostRatedSongsList = state => _.get(state.mostRatedSongs, 'result.data.ratedSongs', []);
export const getDiscoveryPopularBandsList = state => _.get(state.discoveryPopularBands, 'result.data.bands', []);
export const getGoogleEvent = state => _.get(state.getGoogleEvent, 'result.events', []);
export const getDayEvent = state => _.get(state.getDayEvent, 'result.events', []);
export const getRadioStations = state => _.get(state.getRadioStations, 'result.states', []);
export const getNewReleases = state => _.get(state.getNewReleases, 'result.data', []);
export const getRadioStationsSongs = state => _.get(state.getRadioStationsSongs, 'result.data', []);
export const getMostPopularAlbumsList = state => _.get(state.mostPopularAlbums, 'result.data.albums', []);
export const getMostPopularGenresList = state => _.get(state.mostPopularGenres, 'result.data.genres', []);
export const getsongsByGenre = state => _.get(state.songsByGenre, 'result.genres', []);
export const getUserAvatar = state => _.get(state.getUserAvatar, 'result.data', []);
export const getIsWaiting = state => _.get(state.getUserDetails, 'isWaiting', false)
  || _.get(state.updateUserDetails, 'isWaiting', false)
  || _.get(state.changePasswordDetails, 'isWaiting', false);

export const getUserGenresList = state => _.get(state.getUserGenres, 'result', []);

export const getAvailableCities = state => _.get(state.getAvailableCities, 'result.data', []);

export const getInstrumentList = state => _.get(state.getInstrument, 'result.data', []);
export const updateInstrument = state => _.get(state.updateInstrument, 'result.data', []);
export const getArtistProfile = state => _.get(state.artistProfile, 'result.data', {});
export const getUpdateArtistProfile = state => _.get(state.updateArtistProfile, 'result.data', {});
