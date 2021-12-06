import { combineReducers } from 'redux';
import appDetailsReducer from '../slices/appDetailsSlice';
import userReducer from '../slices/userSlice';
import authReducer from '../slices/authSlice';
import walletsReducer from '../slices/walletsSlice';

const reducers = combineReducers({
  appDetails: appDetailsReducer,
  user: userReducer,
  auth: authReducer,
  wallet: walletsReducer,
});

export default reducers;
