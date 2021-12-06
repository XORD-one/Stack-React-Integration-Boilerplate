import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDetailsState } from './types';

// Define the initial state using that type
const initialState: AppDetailsState = {
  name: 'Xord Stacks App',
  logo: 'https://wordpress-548015-1942492.cloudwaysapps.com/wp-content/uploads/2021/05/xordlogo.svg',
};

export const appDetailsSlice = createSlice({
  name: 'app_details',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    updateLogo: (state, action: PayloadAction<string>) => {
      state.logo = action.payload;
    },
  },
});

export const { updateLogo, updateName } = appDetailsSlice.actions;

export default appDetailsSlice.reducer;
