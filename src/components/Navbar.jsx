import React, { useState, useEffect, useCallback } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
// Make sure to import your logo if you use it locally
// import logo from "../assets/icon.png";

function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false); // For mobile menu toggle
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const API_BASE_URL = 'http://localhost:5000'; // Or import from a config file

  // Function to check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      // Assuming your verification route is /api/auth/me
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Essential for sending/receiving cookies
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the API returns a user object on success
        if (data.user) {
          setIsAuthenticated(true);
          if (data.user.email === "adminmasle@gmail.com") {
            setIsAdmin(true); // Set admin status based on user role
          }
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verifying auth status:', error);
      setIsAuthenticated(false);
    }
  }, []);

  // Check auth status when the component mounts
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setIsAuthenticated(false);
        setIsAdmin(false); // Reset admin status on logout
        // Optionally redirect to home or login page
        // window.location.href = '/'; 
      } else {
        console.error('Logout failed:', await response.text());
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-purple-800 shadow-md z-20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="/" className="text-white hover:text-gray-200 font-medium tracking-wide transition duration-300">
            About
          </a>
          <a href="#features" className="text-white hover:text-gray-200 font-medium tracking-wide transition duration-300">
            Features
          </a>
          <a href="#contact" className="text-white hover:text-gray-200 font-medium tracking-wide transition duration-300">
            Contact Us
          </a>
          
          {/* --- AUTHENTICATED-ONLY ROUTES FOR DESKTOP --- */}
          {isAuthenticated && (
            <>
              <a href="/cash" className="text-white hover:text-gray-200 font-medium tracking-wide transition duration-300">Cash</a>
              <a href="/gold" className="text-white hover:text-gray-200 font-medium tracking-wide transition duration-300">Gold</a>
              <a href="/bonds" className="text-white hover:text-gray-200 font-medium tracking-wide transition duration-300">Bonds</a>
              <a href="/stocks" className="text-white hover:text-gray-200 font-medium tracking-wide transition duration-300">Stocks</a>
            </>
          )}
        </div>

        {/* Logo */}
        <div className="flex items-center">
          {/* <img src={logo} alt="Logo" className="h-12" /> */}
          <span className="text-2xl font-bold text-white">StackNova</span>
        </div>

        {/* Right Side: Dynamic Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* --- DASHBOARD BUTTON (ALWAYS VISIBLE) --- */}
          <a href="/dashboard">
            <button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition-transform transform hover:scale-110 active:scale-95">
              Dashboard
            </button>
          </a>
          
          {/* --- LOGIN/LOGOUT BUTTON --- */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                handleLogout();
              } else {
                window.location.href = '/auth'; // Redirect to login page
              }
            }}
            className={`${
              isAuthenticated
                ? "bg-white text-purple-700"
                : "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
            } hover:shadow-lg focus:ring-2 focus:ring-purple-400 font-medium px-5 py-2 rounded-full shadow-md transition-transform transform hover:scale-105 active:scale-95`}
          >
            {isAuthenticated ? "Logout" : "Login/Signup"}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white hover:text-gray-200 focus:outline-none"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          {isNavOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isNavOpen && (
        <div className="md:hidden px-4 pb-4 bg-gradient-to-r from-purple-700 to-purple-800 shadow-lg">
          <a href="/" className="block py-2 text-white hover:text-gray-200 font-medium transition duration-300" onClick={() => setIsNavOpen(false)}>About</a>
          <a href="#features" className="block py-2 text-white hover:text-gray-200 font-medium transition duration-300" onClick={() => setIsNavOpen(false)}>Features</a>
          <a href="#contact" className="block py-2 text-white hover:text-gray-200 font-medium transition duration-300" onClick={() => setIsNavOpen(false)}>Contact Us</a>
          
          {/* --- DASHBOARD LINK (ALWAYS VISIBLE) --- */}
          <a href="/dashboard" className="block py-2 text-white hover:text-gray-200 font-medium transition duration-300" onClick={() => setIsNavOpen(false)}>Dashboard</a>

          {/* --- AUTHENTICATED-ONLY ROUTES FOR MOBILE --- */}
          {isAuthenticated && (
            <>
              <a href="/cash" className="block py-2 text-white hover:text-gray-200 font-medium transition duration-300" onClick={() => setIsNavOpen(false)}>Cash</a>
              <a href="/gold" className="block py-2 text-white hover:text-gray-200 font-medium transition duration-300" onClick={() => setIsNavOpen(false)}>Gold</a>
              <a href="/bonds" className="block py-2 text-white hover:text-gray-200 font-medium transition duration-300" onClick={() => setIsNavOpen(false)}>Bonds</a>
              <a href="/stocks" className="block py-2 text-white hover:text-gray-200 font-medium transition duration-300" onClick={() => setIsNavOpen(false)}>Stocks</a>
            </>
          )}

          <button
            onClick={() => {
              if (isAuthenticated) {
                handleLogout();
              } else {
                window.location.href = '/auth';
              }
              setIsNavOpen(false);
            }}
            className={`mt-4 w-full text-center py-2 ${
              isAuthenticated
                ? "bg-white text-purple-700"
                : "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
            } hover:shadow-lg focus:ring-2 focus:ring-purple-400 font-medium px-5 rounded-full shadow-md transition-transform transform hover:scale-105 active:scale-95`}
          >
            {isAuthenticated ? "Logout" : "Login/Signup"}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
