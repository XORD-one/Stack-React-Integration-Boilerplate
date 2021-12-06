import { Connect, AuthOptions, FinishedAuthData } from '@stacks/connect-react';
import React, { useEffect, useState } from 'react';
import App from './App';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setUser } from '../redux/slices/userSlice/actions';

const WithHiroWallet: React.FC = () => {
  const [authOpts, setAuthOpts] = useState<AuthOptions | null>(null);
  const dispatch = useAppDispatch();
  const appDetails = useAppSelector(state => state.appDetails);

  useEffect(() => {
    setAuthOpts({
      onFinish: res => {
        dispatch(
          setUser({
            authToken: res.authResponse,
            profile: res.authResponsePayload,
            session: res.userSession,
            stxAddresses: {
              testnet: res.authResponsePayload.profile.stxAdress.testnet,
              mainnet: res.authResponsePayload.profile.stxAdress.mainnet,
            },
          }),
        );
      },
      onCancel: () => {
        console.log('auth canceled');
      },
      appDetails: {
        name: appDetails.name,
        icon: appDetails.logo,
      },
    });
  }, []);

  if (!authOpts) return <h1>loading</h1>;

  return (
    <Connect authOptions={authOpts}>
      <App />
    </Connect>
  );
};

export default WithHiroWallet;
