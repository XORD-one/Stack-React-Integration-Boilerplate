import { combineReducers } from 'redux';
import appDetailsReducer from '../slices/appDetailsSlice';
import userReducer from '../slices/userSlice';

const reducers = combineReducers({
  appDetails: appDetailsReducer,
  user: userReducer,
});

export default reducers;
