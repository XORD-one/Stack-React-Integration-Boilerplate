import React, { FC, useEffect } from 'react';
import { useConnect } from '@stacks/connect-react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { APPLICATION_URL } from '../constant';
import { setStxAddresses, setUserState } from '../redux/slices/userSlice';
import { clearUserSession } from '../redux/slices/authSlice';
import { updateBalances } from '../redux/slices/walletsSlice/wallets.actions';
import { fetchTransactions } from '../redux/slices/transactionsSlice/transactions.actions';
import { setNetwork } from '../redux/slices/walletsSlice';
import { updateFetchInstance } from '../redux/slices/fetchSlice';

type Props = {};

const App: FC<Props> = () => {
  const { doOpenAuth } = useConnect();

  const userData = useAppSelector(state => state.user);
  const authData = useAppSelector(state => state.auth);
  const walletData = useAppSelector(state => state.wallet);
  const fetchData = useAppSelector(state => state.fetchInstance);
  const transactionsData = useAppSelector(state => state.transactions);

  const dispatch = useAppDispatch();

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
  }, [userData.stxAddresses, fetchData.instance]);

  useEffect(() => {
    dispatch(updateFetchInstance(walletData.network));
  }, [walletData.network]);

  const onDisconnect = () => {
    dispatch(clearUserSession());
    authData.session?.signUserOut(APPLICATION_URL);
  };

  return (
    <div className="App">
      Welcome to Xord Stacks App! ({walletData.network})
      <button
        onClick={() =>
          dispatch(
            setNetwork(
              walletData.network === 'mainnet' ? 'testnet' : 'mainnet',
            ),
          )
        }>
        Switch to {walletData.network === 'mainnet' ? 'testnet' : 'mainnet'}
      </button>
      <button onClick={authData.session ? onDisconnect : () => doOpenAuth()}>
        {authData.session ? 'Disconnect Wallet' : 'Connect Wallet'}
      </button>
      {authData.session ? (
        <div>
          <h5>
            {walletData.network
              ? (userData.stxAddresses as any)[walletData.network]
              : null}
          </h5>
        </div>
      ) : null}
      <h2>Funds In Wallet</h2>
      {[walletData.stxBalance, ...walletData.tokensInWallet].map((token, i) => {
        if (typeof token === 'number') return <p>STX: {token}</p>;
        return (
          <p>
            {token.symbol}: {token.balance}
          </p>
        );
      })}
      <h2>Transaction History</h2>
      {transactionsData.transactions.map((transaction, i) => {
        return (
          <p key={i}>
            {transaction.tx_id} of {transaction.tx_type} was{' '}
            {transaction.tx_status}
          </p>
        );
      })}
    </div>
  );
};

export default App;
