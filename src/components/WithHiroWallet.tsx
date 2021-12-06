import { Connect, AuthOptions } from '@stacks/connect-react';
import React, { useEffect, useState } from 'react';
import App from './App';
import { useAppDispatch, useAppSelector } from '../hooks';
import { checkAndConnectUser } from '../redux/slices/authSlice/actions';
import { setStxAddresses, setUserState } from '../redux/slices/userSlice';
import { setUserSession } from '../redux/slices/authSlice';

const WithHiroWallet: React.FC = () => {
  const [authOpts, setAuthOpts] = useState<AuthOptions | null>(null);
  const dispatch = useAppDispatch();
  const appDetails = useAppSelector(state => state.appDetails);

  useEffect(() => {
    setAuthOpts({
      onFinish: res => {
        const user = res.userSession.loadUserData();
        dispatch(setUserState(user));
        dispatch(setStxAddresses(user.profile.stxAddress));
        dispatch(setUserSession(res.userSession));
      },
      onCancel: () => {
        console.log('auth canceled');
      },
      appDetails: {
        name: appDetails.name,
        icon: appDetails.logo,
      },
    });

    dispatch(checkAndConnectUser());
  }, []);

  if (!authOpts) return <h1>loading</h1>;

  return (
    <Connect authOptions={authOpts}>
      <App />
    </Connect>
  );
};

export default WithHiroWallet;
