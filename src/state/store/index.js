import ReduxStoreManager from './ReduxStoreManager';

console.log('--- REDUX STORE: Starting store index.js initialization ---');

const storeManager = new ReduxStoreManager();

console.log('--- REDUX STORE: ReduxStoreManager instantiated successfully ---');

export const store = storeManager.store;
export const storePersistor = storeManager.storePersistor;

console.log(
  '--- REDUX STORE: Store and storePersistor exported successfully ---',
);
export default storeManager;
