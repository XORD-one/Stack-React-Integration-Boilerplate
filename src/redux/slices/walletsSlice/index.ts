import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletsState } from './types';

const initialState: WalletsState = {
  stxBalance: 0,
};

export const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    updateStateBalance: (state, action: PayloadAction<number>) => {
      state.stxBalance = action.payload;
    },
  },
});

export const { updateStateBalance } = walletsSlice.actions;

export default walletsSlice.reducer;
