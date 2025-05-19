import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice'
import electionReducer from './slices/electionSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  election: electionReducer,
});

export default rootReducer