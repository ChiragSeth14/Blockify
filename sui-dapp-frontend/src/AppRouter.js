import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App'; // Your create track page
import PlayTrackPage from './PlayTrackPage'; // Your play track page

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/play-track" element={<PlayTrackPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
