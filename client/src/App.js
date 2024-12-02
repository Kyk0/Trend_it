import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<div className="text-white">About Page</div>} />
          <Route path="/contact" element={<div className="text-white">Contact Page</div>} />
        </Routes>
      </Router>
  );
};

export default App;
