import { combineReducers } from 'redux';
import appDetailsReducer from '../slices/appDetailsSlice';
import userReducer from '../slices/userSlice';
import authReducer from '../slices/authSlice';
import walletsReducer from '../slices/walletsSlice';
import transactionsReducer from '../slices/transactionsSlice';

const reducers = combineReducers({
  appDetails: appDetailsReducer,
  user: userReducer,
  auth: authReducer,
  wallet: walletsReducer,
  transactions: transactionsReducer,
});

export default reducers;
