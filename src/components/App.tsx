import React, { FC, useEffect } from 'react';
import { useConnect } from '@stacks/connect-react';
import { StacksTestnet as StacksNetwork } from '@stacks/network';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  APPLICATION_URL,
  STACKS_MAINNET_URL,
  STACKS_TESTNET_URL,
} from '../constant';
import { setStxAddresses, setUserState } from '../redux/slices/userSlice';
import { clearUserSession } from '../redux/slices/authSlice';
import { updateBalances } from '../redux/slices/walletsSlice/wallets.actions';
import { fetchTransactions } from '../redux/slices/transactionsSlice/transactions.actions';
import { setNetwork } from '../redux/slices/walletsSlice';
import { setFetchInstance } from '../redux/slices/fetchSlice';
import { Fetch } from '../native components/fetch';

type Props = {};

const App: FC<Props> = () => {
  const { doOpenAuth } = useConnect();

  const userData = useAppSelector(state => state.user);
  const authData = useAppSelector(state => state.auth);
  const walletData = useAppSelector(state => state.wallet);
  const fetchInstance = useAppSelector(state => state.fetchInstance);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const network = new StacksNetwork();

    dispatch(setNetwork(network.isMainnet() ? 'mainnet' : 'testnet'));
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
      dispatch(fetchTransactions());
    }
  }, [userData.stxAddresses]);

  useEffect(() => {
    dispatch(
      setFetchInstance(
        new Fetch(
          walletData.network === 'mainnet'
            ? STACKS_MAINNET_URL
            : STACKS_TESTNET_URL,
        ),
      ),
    );
  }, [walletData.network]);

  const onDisconnect = () => {
    dispatch(clearUserSession());
    authData.session?.signUserOut(APPLICATION_URL);
  };

  console.log('fetchInstance', fetchInstance);

  return (
    <div className="App">
      Welcome to Stacks App! ({walletData.network})
      {authData.session ? (
        <div>
          <h3>
            {walletData.network
              ? (userData.stxAddresses as any)[walletData.network]
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
