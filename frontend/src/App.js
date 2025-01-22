import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import FlowEditor from './components/FlowEditor';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flow/:flowchartId" element={<FlowEditor />} />
      </Routes>
    </Router>
  );
}

export default App;