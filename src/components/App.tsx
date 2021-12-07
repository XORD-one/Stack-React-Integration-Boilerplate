import React, { FC, useEffect, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { StacksTestnet as StacksNetwork } from '@stacks/network';
import { useAppDispatch, useAppSelector } from '../hooks';
import { APPLICATION_URL } from '../constant';
import { setStxAddresses, setUserState } from '../redux/slices/userSlice';
import { clearUserSession } from '../redux/slices/authSlice';
import stacksFetch from '../api/stacksFetch';
import { getStxDecimals } from '../utils';
import { updateBalances } from '../redux/slices/walletsSlice/actions';
import { getTokenDecimals } from '../redux/slices/walletsSlice/helpers';

type Props = {};

const App: FC<Props> = () => {
  const [networkSelected, setNetworkSelected] = useState<string | null>(null);

  const { doOpenAuth } = useConnect();

  const userData = useAppSelector(state => state.user);
  const authData = useAppSelector(state => state.auth);
  const walletData = useAppSelector(state => state.wallet);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const network = new StacksNetwork();

    setNetworkSelected(network.isMainnet() ? 'mainnet' : 'testnet');
  }, []);

  useEffect(() => {
    if (authData.isConnected && !userData.profile) {
      const user = authData.session?.loadUserData();

      if (user) {
        dispatch(setUserState(user));
        dispatch(setStxAddresses(user.profile.stxAddress));
      }
    }
  }, [authData]);

  useEffect(() => {
    if (userData.stxAddresses.testnet && userData.stxAddresses.mainnet) {
      dispatch(updateBalances());
    }
  }, [userData.stxAddresses]);

  useEffect(() => {
    console.log('walletData', walletData);
  }, [walletData]);

  const onDisconnect = () => {
    dispatch(clearUserSession());
    authData.session?.signUserOut(APPLICATION_URL);
  };

  return (
    <div className="App">
      Welcome to Stacks App!
      {authData.session ? (
        <div>
          <h3>
            {networkSelected
              ? (userData.stxAddresses as any)[networkSelected]
              : null}
          </h3>
          {/* <p>{userData?.balance} STX</p> */}
          <button onClick={onDisconnect}>Disconnect Wallet</button>
          {/* <button onClick={async () => {}}>Get Balance</button> */}
        </div>
      ) : (
        <button onClick={() => doOpenAuth()}>Connect Wallet</button>
      )}
    </div>
  );
};

export default App;
