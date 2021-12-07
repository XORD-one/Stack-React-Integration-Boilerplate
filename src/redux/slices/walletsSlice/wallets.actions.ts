import { RootState } from '../../configureStore';
import stacksFetch from '../../../api/stacksFetch';
import { getStxDecimals } from '../../../utils';
import { setStateBalance, setTokensInWallet } from '.';
import {
  extractTokenContractNameAndAddress,
  getTokenInfo,
} from './wallets.helpers';
import { Token } from './wallets.types';
import { getAccountBalanceUrl } from '../../../api/endpoints';

export const updateBalances =
  () => async (dispatch: any, getState: () => RootState) => {
    try {
      const state = getState();
      const userAddress = (state.user.stxAddresses as any)[
        state.wallet.network
      ];

      const { data } = await stacksFetch.get(getAccountBalanceUrl(userAddress));

      const otherAssets = Object.keys(data.fungible_tokens);
      Object.keys(data.fungible_tokens);

      const tokensInfo = await Promise.all(
        otherAssets.map((token: string) => {
          const { address, contractName } =
            extractTokenContractNameAndAddress(token);

          return getTokenInfo({ address, contractName }, userAddress);
        }),
      );

      const allOtherTokens = otherAssets.map(
        (token: string, i: number): Token => {
          const { address, contractName } =
            extractTokenContractNameAndAddress(token);
          const balance =
            data.fungible_tokens[token].balance /
            Math.pow(10, tokensInfo[i].decimals);

          return {
            address,
            contractName,
            balance,
            name: tokensInfo[i].name,
            symbol: tokensInfo[i].symbol,
          };
        },
      );

      const stxBalance = parseFloat(data.stx.balance) / getStxDecimals();

      dispatch(setTokensInWallet(allOtherTokens));
      dispatch(setStateBalance(stxBalance));
    } catch (error) {}
  };
