import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import AsyncStorage
from '@react-native-community/async-storage';
import TrackPlayer from 'react-native-track-player';
import * as RootNavigation from '../../../navigators/RootNavigation';
import genresSelectionRequest from '../../../services/genreSelection/genreSelection.service';
import { userGenresSagaType } from '../../types/sagas';
import { userGenresRequestActions } from '../../actions/request/genreSelection/genreSelection.actions';
import showAlert from '../AlertUtility';
import { accessToken, getRadioSong, currentScreen } from '../../selectors/UserProfile';
import {
  getRadioSongSagaAction, homeEventsSagaAction, homePromosSagaAction,
  getUserDetailsSagaAction, registerDeviceTokenSagaAction,
  getUserStatisticsSagaAction, getEventsStatisticsSagaAction, getBandsStatisticsSagaAction,
  getRadioStationStatisticsSagaAction, getPopularArtistStatisticsSagaAction,
  getGenresPrefrenceStatisticsSagaAction, getPopularArtistGenresStatisticsSagaAction,
} from '../../actions/sagas';

export default function* genresSelectionWatcherSaga() {
  yield takeLatest(userGenresSagaType, genresSelectionWorkerSaga);
}

export function* genresSelectionWorkerSaga(action) {
  yield put(userGenresRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(genresSelectionRequest, payload);
    yield put(getUserDetailsSagaAction());
    if (response !== null) {
      const totalCount = {
        count: 'all',
      };
      yield put(userGenresRequestActions.succeed(response));
      yield call(showAlert, 'Genres updated successfully.');
      if (action.payload.from === 1) {
        if (yield AsyncStorage.getItem('fcmToken') !== null) {
          yield put(registerDeviceTokenSagaAction({
            token: yield AsyncStorage.getItem('fcmToken'),
          }));
        }
        RootNavigation.navigate({ name: 'Dashboard' });
      } else {
        yield put(getRadioSongSagaAction());
        TrackPlayer.reset();
        const songData = yield select(getRadioSong);
        const songInfo = {
          url: songData.url,
          title: songData.title,
          artist: songData.band ? songData.band.title : '',
          id: songData.songId,
          artwork: songData.thumbnail,
          duration: songData.duration,
        };
        TrackPlayer.updateMetadataForTrack(0, songInfo);
        TrackPlayer.play();
        const tabId = yield select(currentScreen);
        if (tabId === 2) {
          yield put(homeEventsSagaAction());
        } else if (tabId === 3) {
          yield put(homePromosSagaAction());
        } else {
          yield put(getUserStatisticsSagaAction());
          yield put(getEventsStatisticsSagaAction());
          yield put(getBandsStatisticsSagaAction());
          yield put(getRadioStationStatisticsSagaAction());
          yield put(getPopularArtistStatisticsSagaAction());
          yield put(getGenresPrefrenceStatisticsSagaAction());
          yield put(getPopularArtistGenresStatisticsSagaAction());
        }
        yield call(action.payload.callback);
      }
    }
  } catch (e) {
    yield put(userGenresRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}

