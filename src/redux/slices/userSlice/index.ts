import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ProfileState, UserState } from './user.types';

// Define the initial state using that type
const initialState: UserState = {
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
    setUserState: (state, action: PayloadAction<ProfileState>) => {
      state.profile = action.payload;
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
