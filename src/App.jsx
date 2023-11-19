import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"

import {Home} from './pages/home';
import { Pagou } from './pages/pagou';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pagou" element={<Pagou />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
