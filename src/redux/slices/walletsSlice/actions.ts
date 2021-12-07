import { RootState } from '../../configureStore';
import stacksFetch from '../../../api/stacksFetch';
import { getStxDecimals } from '../../../utils';
import { setStateBalance, setTokensInWallet } from '.';
import { extractTokenContractNameAndAddress, getTokenInfo } from './helpers';
import { Token } from './types';

export const updateBalances =
  () => async (dispatch: any, getState: () => RootState) => {
    try {
      const state = getState();
      const userAddress = state.user.stxAddresses.testnet;

      const { data } = await stacksFetch.get(
        `extended/v1/address/${userAddress}/balances`,
      );

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
