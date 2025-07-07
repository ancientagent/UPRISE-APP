import axios from 'axios';
import Config from 'react-native-config';
import { reduxHelpers } from '../../state/store/reduxHelpers';
import * as RootNavigation from '../../navigators/RootNavigation';

const api = axios.create({
  baseURL: Config.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      reduxHelpers.dispatch({ type: 'USER_LOGOUT' });
      RootNavigation.navigate('Login');
    }
    return Promise.reject(error);
  },
);

export default api; 