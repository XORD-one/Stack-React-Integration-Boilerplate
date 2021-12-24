import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STACKS_MAINNET_URL, STACKS_TESTNET_URL } from '../../../constant';
import { Fetch } from '../../../native components/fetch';
import { FetchState } from './fetch.types';

// Define the initial state using that type
const initialState: FetchState = {
  instance: new Fetch(STACKS_TESTNET_URL),
  url: STACKS_TESTNET_URL,
};

export const fetchSlice = createSlice({
  name: 'fetch',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateFetchInstance: (state, action: PayloadAction<string>) => {
      const baseUrl =
        action.payload === 'mainnet' ? STACKS_MAINNET_URL : STACKS_TESTNET_URL;

      state.instance = new Fetch(baseUrl);
      state.url = baseUrl;
    },
  },
});

export const { updateFetchInstance } = fetchSlice.actions;

export default fetchSlice.reducer;
