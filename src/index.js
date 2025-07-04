import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider> {/* Обгортаємо AppProvider'ом */}
      <Router> {/* Обгортаємо Router'ом */}
        <App />
      </Router>
    </AppProvider>
  </React.StrictMode>
);