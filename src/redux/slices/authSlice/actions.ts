import { UserSession } from '@stacks/connect-react';
import { clearUserSession, setAuthToken, setUserSession } from '.';
import { APPLICATION_URL } from '../../../constant';

export const checkAndConnectUser = () => (dispatch: any) => {
  try {
    const userSession = new UserSession({
      appConfig: {
        manifestPath: `${APPLICATION_URL}/manifest.json`,
        redirectPath: APPLICATION_URL,
        scopes: ['store_write', 'publish_data', 'email'],
        manifestURI: () => `${APPLICATION_URL}/manifest.json`,
        redirectURI: () => APPLICATION_URL,
      },
    });

    if (userSession.isUserSignedIn()) {
      const { authResponseToken } = userSession.loadUserData();

      dispatch(setUserSession(userSession));
      dispatch(setAuthToken(authResponseToken));
    } else {
      dispatch(clearUserSession());
    }
  } catch (error) {}
};
