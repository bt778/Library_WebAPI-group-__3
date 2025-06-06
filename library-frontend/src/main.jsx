import axios from 'axios';
axios.defaults.baseURL = 'https://localhost:7173';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Or your global CSS file

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);