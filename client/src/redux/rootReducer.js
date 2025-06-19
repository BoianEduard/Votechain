import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice'
import electionReducer from './slices/electionSlice';
import contractReducer from './slices/contractSlice';
import paymentReducer from './slices/paymentSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  election: electionReducer,
  contract: contractReducer,
  payment: paymentReducer
});

export default rootReducer