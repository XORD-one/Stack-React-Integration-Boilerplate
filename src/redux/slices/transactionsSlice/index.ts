import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, TransactionsState } from './transactions.types';

const initialState: TransactionsState = {
  transactions: [],
  limit: 0,
};

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
  },
});

export const { setTransactions } = transactionsSlice.actions;

export default transactionsSlice.reducer;
