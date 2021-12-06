import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserState } from './types';

// Define the initial state using that type
const initialState: UserState = {
  authToken: '',
  session: null,
  profile: null,
  stxAddresses: {
    testnet: '',
    mainnet: '',
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserState: (state, action: PayloadAction<UserState>) => {
      state = action.payload;
    },
    setStxAddresses: (
      state,
      action: PayloadAction<UserState['stxAddresses']>,
    ) => {
      state.stxAddresses = action.payload;
    },
  },
});

export const { setUserState, setStxAddresses } = userSlice.actions;

export default userSlice.reducer;
