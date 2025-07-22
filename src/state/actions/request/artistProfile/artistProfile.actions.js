import { createRequestResponseActionTypeSet } from '../../../types/listener/listener';

const ActionNamespace = 'ARTIST_PROFILE';

export const artistProfileType = createRequestResponseActionTypeSet(`${ActionNamespace}/GET_ARTIST_PROFILE`);
export const updateArtistProfileType = createRequestResponseActionTypeSet(`${ActionNamespace}/UPDATE_ARTIST_PROFILE`);

export const artistProfileActions = {
  start: () => ({ type: artistProfileType.START }),
  succeed: (result) => ({ type: artistProfileType.SUCCEED, payload: result }),
  fail: (error) => ({ type: artistProfileType.FAIL, payload: error }),
};

export const updateArtistProfileActions = {
  start: () => ({ type: updateArtistProfileType.START }),
  succeed: (result) => ({ type: updateArtistProfileType.SUCCEED, payload: result }),
  fail: (error) => ({ type: updateArtistProfileType.FAIL, payload: error }),
}; 