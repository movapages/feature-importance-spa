import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import StartPage from './pages/StartPage';
import TrainModel from './pages/TrainModel';
import FeatureWeight from './pages/FeatureWeight';
import Summary from './pages/Summary';

const App = () => {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4">
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-blue-500">Start</Link></li>
            <li><Link to="/train-model" className="text-blue-500">Train Model</Link></li>
            <li><Link to="/feature-weight" className="text-blue-500">Feature Weight</Link></li>
            <li><Link to="/summary" className="text-blue-500">Summary</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/train-model" element={<TrainModel />} />
          <Route path="/feature-weight" element={<FeatureWeight />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
