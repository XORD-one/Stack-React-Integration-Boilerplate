import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Token, WalletsState } from './wallets.types';

const initialState: WalletsState = {
  stxBalance: 0,
  tokensInWallet: [],
  totalAssetsBalance: 0,
  network: 'testnet',
};

export const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    setStateBalance: (state, action: PayloadAction<number>) => {
      state.stxBalance = action.payload;
    },
    setTokensInWallet: (state, action: PayloadAction<Token[]>) => {
      state.tokensInWallet = action.payload;
    },
    setTotalAssetsBalance: (state, action: PayloadAction<number>) => {
      state.totalAssetsBalance = action.payload;
    },
    setNetwork: (state, action: PayloadAction<string>) => {
      state.network = action.payload;
    },
  },
});

export const {
  setStateBalance,
  setTokensInWallet,
  setTotalAssetsBalance,
  setNetwork,
} = walletsSlice.actions;

export default walletsSlice.reducer;
