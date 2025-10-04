// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client'; // This line was missing or incorrect
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);