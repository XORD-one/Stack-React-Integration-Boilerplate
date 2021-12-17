import React, { FC, useEffect, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { useAppDispatch, useAppSelector } from '@hooks';
import { clearUserSession } from '@redux/slices/authSlice';
import { updateBalances } from '@redux/slices/walletsSlice/wallets.actions';
import { fetchTransactions } from '@redux/slices/transactionsSlice/transactions.actions';
import { setNetwork } from '@redux/slices/walletsSlice';
import { updateFetchInstance } from '@redux/slices/fetchSlice';
import {
  noneCV,
  createFungiblePostCondition,
  uintCV,
  FungibleConditionCode,
  createAssetInfo,
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';
import { APPLICATION_URL } from '../constant';

type Props = {};

// test address -- ST1KRXW1H418VGDCQQ068A8XFJ2SSH9NZPJ481JX4

const App: FC<Props> = () => {
  const [amountValue, setAmountValue] = useState('');
  const [recipientValue, setRecipientValue] = useState('');

  const { doOpenAuth, doSTXTransfer, doContractCall } = useConnect();

  const userData = useAppSelector(state => state.user);
  const authData = useAppSelector(state => state.auth);
  const walletData = useAppSelector(state => state.wallet);
  const fetchData = useAppSelector(state => state.fetchInstance);
  const transactionsData = useAppSelector(state => state.transactions);

  const dispatch = useAppDispatch();

  useEffect(() => {
    // added a timeout to allow extensio to load
    setTimeout(() => doOpenAuth(), 2000);
  }, []);

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
      await doSTXTransfer({
        amount: String(parseFloat(amountValue) * 10 ** 6),
        recipient: recipientValue,
        onFinish: data => {
          console.log('tx finsihde -', data);
        },
        onCancel: () => {
          console.log('tx cancleo -');
        },
        network: new StacksTestnet(),
        // stxAddress: userData.stxAddresses.testnet,
        // userSession: authData?.session || undefined,
      });
    } catch (error) {
      console.error('error --', error);
    }
  };

  const sendFungibleToken = async () => {
    try {
      const token = walletData.tokensInWallet[0];

      // const { data } = await fetchData.instance.get(
      //   getContractAbi(token.address, token.contractName),
      // );

      // console.log('contract data --', data);

      await doContractCall({
        contractAddress: token.address,
        contractName: token.contractName,
        functionName: 'transfer',
        functionArgs: [
          uintCV(1 * 10 ** 6),
          principalCV(userData.stxAddresses.testnet),
          principalCV('ST1KRXW1H418VGDCQQ068A8XFJ2SSH9NZPJ481JX4'),
          noneCV(),
        ],
        onFinish: data => {
          console.log('tx finsihde -', data);
        },
        onCancel: () => {
          console.log('tx cancleo -');
        },
        network: new StacksTestnet(),
        postConditions: [
          createFungiblePostCondition(
            userData.stxAddresses.testnet,
            FungibleConditionCode.Equal,
            1,
            createAssetInfo(token.address, token.contractName, token.symbol),
          ),
        ],
      });
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
        <button onClick={sendFungibleToken}>Send</button>
      </div>
    </div>
  );
};

export default App;
