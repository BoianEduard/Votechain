import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import AuthGuard from '../AuthGuard';
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import DashboardPage from "../../pages/DashboardPage";
import ElectionCreatePage from "../../pages/ElectionCreatePage";
import ElectionViewPage from '../../pages/ElectionViewPage';
import ElectionVotePage from '../../pages/ElectionVotePage/ElectionVotePage';
import ElectionHistoryPage from '../../pages/ElectionHistoryPage/ElectionHistoryPage';
import ElectionResultsPage from '../../pages/ElectionResultsPage/ElectionResultsPage';
import Logout from "../Logout/Logout";
import store from '../../redux/store';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

import authThunks from '../../redux/thunks/authThunks'

const AuthChecker = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authThunks.checkAuthStatus());
  }, [dispatch]);

  return children;
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
console.log("Stripe key (pls be string):", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY); // nu Promise
console.log("Stripe key: " + stripePromise)

function App() {
  return (
      <Provider store={store}>
        <AuthChecker>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<RegisterPage />} />
              <Route element={<AuthGuard />}>
                <Route path="/logout" element={<Logout />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/create-election"
                       element={<Elements stripe={stripePromise}>
                                    <ElectionCreatePage />
                                </Elements>
                                }
                />
                <Route path="/vote" element={<ElectionViewPage />} />
                <Route path="/elections/:electionId/vote" element={<ElectionVotePage />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/election-history" element={<ElectionHistoryPage />} />
                <Route path="/election-results/:id" element={<ElectionResultsPage />} />
              </Route>
            </Routes>
          </Router>
        </AuthChecker>
      </Provider>
  );
}

export default App;