import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/users/userSlice';
import electionReducer from '../features/elections/electionSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    election: electionReducer,
  },
});

export default store;
