
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { createNetworkMiddleware } from 'react-native-offline';
import { persistReducer, createMigrate, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';
import { root } from './migrations';
import rootSaga from '../sagas/rootSaga';
import { rootPersistKey } from '../reducers/persistKeys';

export default class ReduxStoreManager {
  constructor() {
    console.log('--- REDUX STORE: Starting ReduxStoreManager constructor ---');
    
    this.storePersistor = null;
    
    console.log('--- REDUX STORE: Creating saga middleware ---');
    const sagaMiddleware = createSagaMiddleware({ });
    console.log('--- REDUX STORE: Saga middleware created successfully ---');
    
    console.log('--- REDUX STORE: Creating network middleware ---');
    const networkMiddleware = createNetworkMiddleware({
      queueReleaseThrottle: 200,
    });
    console.log('--- REDUX STORE: Network middleware created successfully ---');
    
    console.log('--- REDUX STORE: Setting up persist configuration ---');
    const persistConfig = {
      key: rootPersistKey,
      storage: AsyncStorage,
      version: 0,
      blacklist: ['nav'],
      migrate: createMigrate(root, { debug: true }),
    };
    console.log('--- REDUX STORE: Persist configuration created successfully ---');
    
    console.log('--- REDUX STORE: Creating store with middleware ---');
    const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(
      networkMiddleware, sagaMiddleware,
    ))(createStore);
    console.log('--- REDUX STORE: Store with middleware created successfully ---');
    
    console.log('--- REDUX STORE: Creating persisted root reducer ---');
    const persistedRootReducer = persistReducer(persistConfig, rootReducer);
    console.log('--- REDUX STORE: Persisted root reducer created successfully ---');
    
    console.log('--- REDUX STORE: Starting store creation ---');
    this.store = createStoreWithMiddleware(persistedRootReducer);
    console.log('--- REDUX STORE: Store creation COMPLETE ---');
    
    console.log('--- REDUX PERSIST: Starting persistence ---');
    this.storePersistor = persistStore(this.store);
    console.log('--- REDUX PERSIST: Persistence COMPLETE ---');
    
    console.log('--- REDUX SAGA: Starting root saga ---');
    sagaMiddleware.run(rootSaga);
    console.log('--- REDUX SAGA: Root saga started successfully ---');
    
    console.log('--- REDUX STORE: ReduxStoreManager constructor COMPLETE ---');
  }
}

