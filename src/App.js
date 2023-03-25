import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Summarizer from './components/Summarizer';
import './App.css';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import 'bootstrap/dist/css/bootstrap.min.css';

Amplify.configure(awsExports);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/summarizer" element={<Summarizer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
