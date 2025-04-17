import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import AuthGuard from '../AuthGuard';
import LoginPage from "../../pages/LoginPage"
import RegisterPage from "../../pages/RegisterPage"
import DashboardPage from "../../pages/DashboardPage"
import CreateElection from '../../pages/CreateElection';
import VotePage from '../../pages/ElectionPage';
import VotingPage from '../../pages/VotingPage/VotingPage';
import store from '../../redux/store';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element = {<RegisterPage />} />
          <Route element = { <AuthGuard />} >
            <Route path="/dashboard" element= {<DashboardPage/>} />
            <Route path="/create-election" element= {<CreateElection/>} />
            <Route path='/vote' element= {<VotePage/>} />
            <Route path='/elections/:electionId/vote' element={<VotingPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
