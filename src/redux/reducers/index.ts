import { combineReducers } from 'redux';
import appDetailsReducer from '../slices/appDetailsSlice';
import userReducer from '../slices/userSlice';
import authReducer from '../slices/authSlice';

const reducers = combineReducers({
  appDetails: appDetailsReducer,
  user: userReducer,
  auth: authReducer,
});

export default reducers;
