
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { createNetworkMiddleware } from 'react-native-offline';
import { persistReducer, createMigrate, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';
import { root } from './migrations';
import initialSaga from '../sagas';
import { rootPersistKey } from '../reducers/persistKeys';

export default class ReduxStoreManager {
  constructor() {
    this.storePersistor = null;
    const sagaMiddleware = createSagaMiddleware({ });
    const networkMiddleware = createNetworkMiddleware({
      queueReleaseThrottle: 200,
    });
    const persistConfig = {
      key: rootPersistKey,
      storage: AsyncStorage,
      version: 0,
      blacklist: ['nav'],
      migrate: createMigrate(root, { debug: true }),
    };
    const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(
      networkMiddleware, sagaMiddleware,
    ))(createStore);
    const persistedRootReducer = persistReducer(persistConfig, rootReducer);
    this.store = createStoreWithMiddleware(persistedRootReducer);
    this.storePersistor = persistStore(this.store);
    sagaMiddleware.run(initialSaga);
  }
}

