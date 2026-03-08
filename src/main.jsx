import React from 'react';
import ReactDOM from 'react-dom/client';
import { initStorage } from './storage';
import App from './App';

// Initialize localStorage shim before app mounts
initStorage();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
