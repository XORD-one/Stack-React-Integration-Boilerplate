import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FetchInstance } from './fetch.types';

// Define the initial state using that type
const initialState: FetchInstance | null = null;

export const fetchSlice = createSlice({
  name: 'fetch',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setFetchInstance: (
      state: FetchInstance | null,
      action: PayloadAction<FetchInstance>,
    ) => {
      console.log('action.payload =', action.payload);

      state = action.payload;
    },
  },
});

export const { setFetchInstance } = fetchSlice.actions;

export default fetchSlice.reducer;
