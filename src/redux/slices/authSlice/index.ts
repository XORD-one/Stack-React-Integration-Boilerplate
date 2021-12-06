import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserSession } from '@stacks/auth';
import type { AuthState } from './types';

// Define the initial state using that type
const initialState: AuthState = {
  authToken: '',
  session: null,
  isConnected: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
    setUserSession: (state, action: PayloadAction<UserSession>) => {
      state.session = action.payload;
      state.isConnected = true;
    },
    clearUserSession: state => {
      state.session = null;
      state.isConnected = false;
      state.authToken = '';
    },
  },
});

export const { setAuthToken, setUserSession, clearUserSession } =
  authSlice.actions;

export default authSlice.reducer;
