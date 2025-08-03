// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/Home"; // Assuming Home.jsx is your dashboard page
import Cash from "./pages/Cash";
import Gold from "./pages/Gold";
import Bond from "./pages/Bond";
import Stock from "./pages/Stock";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Auth" element={<><Navbar/><Auth/><Footer/></>}/>
        <Route path="/dashboard" element={<><Navbar/><HomePage/><Footer/></>} />
        <Route path="/cash" element={<><Navbar/><Cash/><Footer/></>} />
        <Route path="/gold" element={<><Navbar/><Gold/><Footer/></>} />
        <Route path="/bonds" element={<><Navbar/><Bond/><Footer/></>} />
        <Route path="/stocks" element={<><Navbar/><Stock/><Footer/></>} />
      </Routes>
  );
}

export default App;