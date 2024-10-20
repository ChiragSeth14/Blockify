import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppRouter from './AppRouter'; // Import your router instead of App
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <AppRouter /> {/* Use AppRouter instead of App */}
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
