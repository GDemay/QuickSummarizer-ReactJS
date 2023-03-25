// src/components/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to Quick Summarizer</h1>
      <p>An advanced AI-powered tool that quickly summarizes your text with high accuracy.</p>
      <Link to="/summarizer">
        <button className="start-btn">Start Summarizing</button>
      </Link>
    </div>
  );
};

export default LandingPage;
