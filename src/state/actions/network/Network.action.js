import { App as NetworkStatus } from '../../types';

export const showNetworkPopUp = () => ({
  type: NetworkStatus.ShowNetworkPopup,
});
export const hideNetworkPopUp = () => ({
  type: NetworkStatus.HideNetworkPopup,
});

