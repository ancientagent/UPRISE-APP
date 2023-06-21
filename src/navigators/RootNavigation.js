
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
export function goBack() {
  navigationRef.current?.goBack();
}

export function getRootState() {
  return navigationRef.current.getCurrentRoute().name;
}

export function resetRoot() {
  return navigationRef.resetRoot({
    index: 0,
    key: null,
    routes: [{ name: 'Dashboard' }],
  });
}

