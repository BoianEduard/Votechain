import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import LoginPage from "../../pages/LoginPage"
import RegisterPage from "../../pages/RegisterPage"
import DashboardPage from "../../pages/DashboardPage"
import NavigationButton from '../NavigationButton';
import CreateElection from '../../pages/CreateElection';
import store from '../../redux/store';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element = {<RegisterPage />} />
          <Route path="/dashboard" element= {<DashboardPage/>} />
          <Route path="/create-election" element= {<CreateElection/>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
