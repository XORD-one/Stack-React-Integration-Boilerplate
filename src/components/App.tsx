import React, { FC, useEffect, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { APPLICATION_URL } from '../constant';
import { setStxAddresses, setUserState } from '../redux/slices/userSlice';
import { clearUserSession } from '../redux/slices/authSlice';
import { updateBalances } from '../redux/slices/walletsSlice/wallets.actions';
import { fetchTransactions } from '../redux/slices/transactionsSlice/transactions.actions';
import { setNetwork } from '../redux/slices/walletsSlice';
import { updateFetchInstance } from '../redux/slices/fetchSlice';
import {
  AnchorMode,
  broadcastTransaction,
  estimateTransfer,
  makeSTXTokenTransfer,
  makeUnsignedSTXTokenTransfer,
  SignedTokenTransferOptions,
  UnsignedTokenTransferOptions,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { doSignaturesMatchPublicKeys } from '@stacks/auth';

type Props = {};

const App: FC<Props> = () => {
  const [amountValue, setAmountValue] = useState('');
  const [recipientValue, setRecipientValue] = useState('');

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
      console.log('authData --', authData.session);
      if (user) {
        // dispatch(setUserState(user));
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

  const sendToken = async () => {
    try {
      console.log(
        '1111111',
        doSignaturesMatchPublicKeys(userData.stxAddresses?.testnet),
      );
      // const network =
      //   walletData.network === 'testnet'
      //     ? new StacksTestnet()
      //     : new StacksMainnet();

      // const txOpts: UnsignedTokenTransferOptions = {
      //   recipient: recipientValue,
      //   amount: BigInt(amountValue),
      //   network,
      //   anchorMode: AnchorMode.Any,
      //   publicKey: userData.profile?.appPrivateKey || '',
      // };

      // const stxTransactions = await makeUnsignedSTXTokenTransfer(txOpts);

      // const estimateTransferObj = await broadcastTransaction(
      //   stxTransactions,
      //   network,
      // );
    } catch (error) {
      console.error('error --', error);
    }
  };

  return (
    <div className="App">
      Welcome to Xord Stacks App! ({walletData.network})
      {authData.session ? (
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
      ) : null}
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
          <h2>Funds In Wallet</h2>
          {[walletData.stxBalance, ...walletData.tokensInWallet].map(
            (token, i) => {
              if (typeof token === 'number') return <p key={i}>STX: {token}</p>;
              return (
                <p key={i}>
                  {token.symbol}: {token.balance}
                </p>
              );
            },
          )}
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
      ) : null}
      <div>
        <h2>Send STX</h2>
        <input
          type="number"
          value={amountValue}
          onChange={e => setAmountValue(e.target.value)}
          placeholder="Amount"
        />
        <input
          type="text"
          value={recipientValue}
          onChange={e => setRecipientValue(e.target.value)}
          placeholder="Recipient"
        />
        <button onClick={sendToken}>Send</button>
      </div>
    </div>
  );
};

export default App;
