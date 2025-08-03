import {call, put, takeLatest} from 'redux-saga/effects';
import getAllGenresRequest from '../../../services/getAllGenres/getAllGenres.service';
import {getUserGenresSagaType} from '../../types/sagas';
import {getUserGenresActions} from '../../actions/request/getUserGenres/getUserGenres.actions';
import showAlert from '../AlertUtility';

export default function* getUserGenresWatcherSaga() {
  yield takeLatest(getUserGenresSagaType, getUserGenresWorkerSaga);
}

export function* getUserGenresWorkerSaga(action) {
  yield put(getUserGenresActions.start());
  try {
    console.log(
      '--- getUserGenres SAGA: Calling API service ---',
      action.payload,
    );
    const response = yield call(getAllGenresRequest, action.payload);

    // Check if the response and the data inside are valid
    // Backend returns {data: genres} as response.data.data
    if (
      response &&
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      console.log(
        '--- getUserGenres SAGA: SUCCESS! Response Data ---',
        response.data.data,
      );
      // Dispatch the success action with the actual list of genres
      yield put(getUserGenresActions.succeed(response.data.data));
    } else if (response && response.data && Array.isArray(response.data)) {
      // Fallback for direct array response
      console.log(
        '--- getUserGenres SAGA: SUCCESS! Direct Array Response ---',
        response.data,
      );
      yield put(getUserGenresActions.succeed(response.data));
    } else {
      // Handle cases where the API returns a success status but no data
      console.error(
        '--- getUserGenres SAGA: ERROR - No data in response ---',
        response,
      );
      yield put(
        getUserGenresActions.fail('No genre data received from server.'),
      );
    }
  } catch (error) {
    console.error(
      '--- getUserGenres SAGA: CATCH BLOCK ERROR ---',
      error.response || error,
    );
    yield put(
      getUserGenresActions.fail(
        error.response?.data?.message || 'Failed to fetch genres.',
      ),
    );
    yield call(
      showAlert,
      error.response?.data?.message || 'Failed to fetch genres.',
    );
  }
}
