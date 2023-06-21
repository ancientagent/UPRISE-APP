// Internal Properties & Functions
let _store;
export const getStore = () => _store; // Only here for testing purposes

// External Properties & Functions
const setStore = store => { _store = store; };
const getState = () => _store && _store.getState();
const dispatch = action => _store && _store.dispatch(action);

export const reduxHelpers = {
  dispatch,
  getState,
  setStore,
};
