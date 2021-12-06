import React, { FC, useEffect, useState } from 'react';
import {
  useConnect,
  UserSession,
  UserData,
  AuthScope,
  AuthOptions,
  Connect,
} from '@stacks/connect-react';
import { StacksMainnet, StacksTestnet, NetworkConfig } from '@stacks/network';
import {
  AnchorMode,
  getAbi,
  makeContractCall,
  createStacksPrivateKey,
  publicKeyToAddress,
  AddressVersion,
  createStacksPublicKey,
  getAddressFromPublicKey,
  callReadOnlyFunction,
  standardPrincipalCVFromAddress,
  standardPrincipalCV,
  cvToValue,
} from '@stacks/transactions';
import axios from 'axios';
import {
  AccountsApi,
  SmartContractsApi,
  connectWebSocketClient,
} from '@stacks/blockchain-api-client';

type Props = {};

type BalanceData = {
  balance: string;
  locked: string;
  nonce: number;
  unlock_height: number;
};

interface UserState extends UserData {
  balance?: number;
}

const testData = {
  contractAddress: 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ',
  contractName: 'micro-nthng',
  userAddress: 'SPX8T06E8FJQ33CX8YVR9CC6D9DSTF6JE0Y8R7DS',
};

const userSessionTest = new UserSession({
  appConfig: {
    manifestPath: 'http://localhost:3000/manifest.json',
    redirectPath: 'http://localhost:3000',
    scopes: ['store_write', 'publish_data', 'email'],
    manifestURI: () => 'http://localhost:3000/manifest.json',
    redirectURI: () => 'http://localhost:3000',
  },
});

const App: FC<Props> = () => {
  const [userSessionData, setUserSessionData] = useState<UserSession | null>(
    null,
  );
  const [userData, setUserData] = useState<UserState | null>(null);

  const { doOpenAuth, userSession, authData } = useConnect();

  useEffect(() => {
    console.log('session changes =', userSession, authData);
  }, [userSession, authData]);

  useEffect(() => {
    if (userSessionTest.isUserSignedIn()) {
      setUserSessionData(userSessionTest);
    }
  }, [userSessionTest]);

  useEffect(() => {
    if (userSessionData) {
      // * HOW TO GET USER DATA
      const user = userSessionData.loadUserData();

      (async () => {
        try {
          const network = new StacksTestnet();
          const testnetAddress = user.profile.stxAddress.testnet;
          const mainnetAddress = user.profile.stxAddress.mainnet;

          // * HOW TO GET ABI OF CONTRACT
          // const abi = await getContractInterface(
          //   'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ',
          //   'micro-nthng',
          //   new StacksMainnet(),
          // );
          // console.log('abi', abi);

          // * HOW TO CALL CONTRACT PUBLIC FUNCTIONS
          // const response = await makeContractCall({
          //   contractAddress: with0x('STDVAGX3EGETB7BJ6737FRS4DTNXC7CVSQMN1M7W'),
          //   contractName: 'stsw-token-v4a',
          //   functionName: 'get-decimals',
          //   functionArgs: [],
          //   anchorMode: AnchorMode.Any,
          //   senderKey: with0x(user?.profile.stxAddress.testnet),
          //   validateWithAbi: contractAbi,
          // });

          // * HOW TO CONVERT ADDRESS INTO PRINCIPAL CLARITY VALUE
          // const principalCV = standardPrincipalCV(testnetAddress);

          // * HOW TO CALL CONTRACT READ ONLY FUNCTIONS
          // const smartContractsApi = new SmartContractsApi();
          // const decimals = await smartContractsApi.callReadOnlyFunction({
          //   contractAddress: 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ',
          //   contractName: 'micro-nthng',
          //   functionName: 'get-total-supply',
          //   readOnlyFunctionArgs: { sender: mainnetAddress, arguments: [] },
          // });

          // console.log(decimals);

          // const decimalsOfToken = await callReadOnlyFunction({
          //   contractAddress: 'STDVAGX3EGETB7BJ6737FRS4DTNXC7CVSQMN1M7W',
          //   contractName: 'stsw-token-v4a',
          //   functionName: 'get-decimals',
          //   functionArgs: [],
          //   network: new StacksTestnet(),
          //   senderAddress: user?.profile.stxAddress.testnet,
          // });

          // console.log({
          //   balanceOfToken:
          //     parseFloat(cvToValue(balanceOfToken).value) /
          //     10 ** parseFloat(cvToValue(decimalsOfToken).value),
          // });

          // * HOW TO GET USER ACCOUNT URL FOR ACCOUNT STX BALANCE
          const accountUrl = network.getAccountApiUrl(testnetAddress);
          const { data }: { data: BalanceData } = await axios.get(accountUrl);
          const balanceInDecimals = parseInt(data.balance, 16);
          const balance = balanceInDecimals / 10 ** 6;

          setUserData({ ...user, balance });

          // ! TESTTTT
          // const transactionsApi = new TransactionsApi();
          // console.log('res -', await transactionsApi.getTransactionList({}));

          // const accountsApi = new AccountsApi();

          // console.log(
          //   'res -',
          //   await accountsApi.getAccountTransactions({
          //     principal: 'SP1V21EG2APTB57VXEM9BK4TFWK1GN8NYW5DB0Q46',
          //   }),
          // );
        } catch (error) {
          console.log('error', error);
        }
      })();
    }
  }, [userSessionData]);

  // // * SMART CONTRACT API
  // useEffect(() => {
  //   const smartContractsApi = new SmartContractsApi();

  //   (async () => {
  //     const contractInterface = await smartContractsApi.getContractInterface({
  //       contractAddress: testData.contractAddress,
  //       contractName: testData.contractName,
  //     });
  //     console.log('contractInterface', contractInterface);
  //   })();
  // }, []);

  // // * ACCOUNTS API
  // useEffect(() => {
  //   const accountsApi = new AccountsApi();

  //   (async () => {
  //     const accountBalance = await accountsApi.getAccountBalance({
  //       principal: testData.userAddress,
  //     });
  //     console.log('accountBalance', accountBalance);

  //     const accountInfo = await accountsApi.getAccountInfo({
  //       principal: testData.userAddress,
  //     });
  //     console.log('accountInfo', accountInfo);

  //     const accountNft = await accountsApi.getAccountNft({
  //       principal: testData.userAddress,
  //     });
  //     console.log('accountNft', accountNft);

  //     const accountTxs = await accountsApi.getAccountTransactions({
  //       principal: testData.userAddress,
  //       limit: 20,
  //     });
  //     console.log('accountTxs', accountTxs);
  //   })();
  // }, []);

  // // * SOCKET IO API
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const client = await connectWebSocketClient(
  //         'wss://stacks-node-api.testnet.stacks.co/',
  //       );

  //       console.log('client', client.subscribeAddressTransactions);

  //       const txSub = await client.subscribeAddressTransactions(
  //         'ST1ZVRVYK15Y5VRTMQQNKBS6J701JQSKP1VMCHHYG',
  //         event => {
  //           console.log('tx event', event);
  //         },
  //       );

  //       console.log('txSub', txSub);

  //       const balanceSub = await client.subscribeAddressBalanceUpdates(
  //         'ST1ZVRVYK15Y5VRTMQQNKBS6J701JQSKP1VMCHHYG',
  //         event => {
  //           console.log('balance event', event);
  //         },
  //       );

  //       console.log('balanceSub', balanceSub);
  //     } catch (error) {
  //       console.log('error', error);
  //     }
  //   })();
  // }, []);

  return (
    <div className="App">
      Welcome to Stacks App!
      {userSessionData ? (
        <div>
          <h3>{userData?.profile.stxAddress.testnet}</h3>
          <p>{userData?.balance} STX</p>
          <button
            onClick={() =>
              userSessionData.signUserOut('http://localhost:3000')
            }>
            Disconnect Wallet
          </button>
          {/* <button onClick={async () => {}}>Get Balance</button> */}
        </div>
      ) : (
        <button onClick={() => doOpenAuth()}>Connect Wallet</button>
      )}
    </div>
  );
};

export default App;
