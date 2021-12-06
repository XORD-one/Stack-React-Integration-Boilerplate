import { RootState } from '../../configureStore';
import stacksFetch from '../../../api/stacksFetch';
import { getStxDecimals } from '../../../utils';
import { updateStateBalance } from '.';

export const updateBalances =
  () => async (dispatch: any, getState: () => RootState) => {
    try {
      const state = getState();
      const userAddress = state.user.stxAddresses.testnet;

      const { data } = await stacksFetch.get(
        `extended/v1/address/${userAddress}/balances`,
      );

      const stxBalance = parseFloat(data.stx.balance) / getStxDecimals();

      dispatch(updateStateBalance(stxBalance));
    } catch (error) {}
  };
