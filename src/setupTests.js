import { NativeModules } from 'react-native';

NativeModules.BlobModule = {
  ...NativeModules.BlobModule,
  addNetworkingHandler: jest.fn(),
};
NativeModules.UIManager = {
  ...NativeModules.UIManager,
  dispatchViewManagerCommand: jest.fn(),
};
