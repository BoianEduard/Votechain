// Importă combineReducers și reducer-ele tale
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';

// Combină reducer-ele într-un singur reducer principal
const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer
