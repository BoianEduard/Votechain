import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import LoginPage from '../LoginPage'; 
import RegisterPage from '../RegisterPage'
import store from '../../redux/store';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Ruta principală care afișează LoginPage */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element = {<RegisterPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
