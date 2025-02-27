import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import LoginPage from '../LoginPage'; 
import store from '../../app/store';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Ruta principală care afișează LoginPage */}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
