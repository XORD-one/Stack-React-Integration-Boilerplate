import { RootState } from '../../configureStore';
import stacksFetch from '../../../api/stacksFetch';
import { getAccountTransactionsUrl } from '../../../api/endpoints';
import { setTransactions } from '.';

export const fetchTransactions =
  () => async (dispatch: any, getState: () => RootState) => {
    try {
      const state = getState();

      console.log(state);

      const userAddress = (state.user.stxAddresses as any)[
        state.wallet.network
      ];

      const { data } = await stacksFetch.get(
        getAccountTransactionsUrl(userAddress),
      );

      console.log(data);

      dispatch(setTransactions(data.results));
    } catch (error) {
      console.log('error - fetchTransactions', error);
    }
  };
