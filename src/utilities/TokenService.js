import AsyncStorage from '@react-native-community/async-storage';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';

const TokenService = {
  getAccessToken: async () => AsyncStorage.getItem(ACCESS_TOKEN),
  setAccessToken: async token => AsyncStorage.setItem(ACCESS_TOKEN, token),
  getRefreshToken: async () => AsyncStorage.getItem(REFRESH_TOKEN),
  setRefreshToken: async token => AsyncStorage.setItem(REFRESH_TOKEN, token),
  clearTokens: async () => {
    await AsyncStorage.removeItem(ACCESS_TOKEN);
    await AsyncStorage.removeItem(REFRESH_TOKEN);
    console.log('--- TOKEN SERVICE: Tokens cleared from AsyncStorage ---');
  },
};
export default TokenService;
