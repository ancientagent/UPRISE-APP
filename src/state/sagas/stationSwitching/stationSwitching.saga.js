import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import TrackPlayer from 'react-native-track-player';
import stationSwitchingRequest from '../../../services/stationSwitching/stationSwitching.service';
import { stationSwitchingSagaType } from '../../types/sagas';
import { stationSwitchingActions } from '../../actions/request/stationSwitching/stationSwitching.actions';
import { accessToken, getRadioSong, currentScreen } from '../../selectors/UserProfile';
import {
  getRadioSongSagaAction, homeEventsSagaAction, homePromosSagaAction, getUserDetailsSagaAction,
  getUserStatisticsSagaAction,
  getEventsStatisticsSagaAction, getBandsStatisticsSagaAction,
  getRadioStationStatisticsSagaAction, getPopularArtistStatisticsSagaAction,
  getGenresPrefrenceStatisticsSagaAction, getPopularArtistGenresStatisticsSagaAction,
} from '../../actions/sagas';

import showAlert from '../AlertUtility';

export default function* stationSwitchingWatcherSaga() {
  yield takeLatest(stationSwitchingSagaType, stationSwitchingWorkerSaga);
}

export function* stationSwitchingWorkerSaga(action) {
  yield put(stationSwitchingActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(stationSwitchingRequest, payload);
    if (response !== null) {
      yield put(stationSwitchingActions.succeed(response));
      yield put(getUserDetailsSagaAction());
      yield call(showAlert, 'Location updated successfully.');
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
    }
  } catch (e) {
    yield put(stationSwitchingActions.fail(e));
    yield call(showAlert, e.error);
  }
}

