import { RootState } from '../../configureStore';
import { getAccountTransactionsUrl } from '../../../api/endpoints';
import { setTransactions } from '.';

export const fetchTransactions =
  () => async (dispatch: any, getState: () => RootState) => {
    try {
      const state = getState();

      const userAddress = (state.user.stxAddresses as any)[
        state.wallet.network
      ];

      const { data } = await state.fetchInstance.instance.get(
        getAccountTransactionsUrl(userAddress),
      );

      dispatch(setTransactions(data.results));
    } catch (error) {
      console.log('error - fetchTransactions', error);
    }
  };
