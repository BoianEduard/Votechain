import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice'
import electionReducer from './slices/electionSlice';
import contractReducer from './slices/contractSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  election: electionReducer,
  contract: contractReducer,
});

export default rootReducer