import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import illus from "../assets/illus.png"
import contact from "../assets/contact.png"
import { FaShieldAlt, FaClock, FaLightbulb, FaHandsHelping } from "react-icons/fa";
import { FaBrain, FaHeadset, FaSmileBeam } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";


function LandingPage() {
  const navigate = useNavigate();

  const [isNavOpen, setIsNavOpen] = useState(false); // Mobile nav toggle

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  // Illustration URL (kept for desktop display only)

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* ------------------------------------------------ */}
      {/* NAVIGATION BAR */}
      {/* ------------------------------------------------ */}
      <Navbar/>
      

      {/* ------------------------------------------------ */}
      {/* HERO SECTION */}
      {/* ------------------------------------------------ */}
      <section className="relative bg-gradient-to-b from-purple-600 to-purple-500 px-4 py-16 md:py-24">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
    <div className="text-white w-full md:w-1/2 mb-10 md:mb-0">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
        Build a Smarter <span className="text-yellow-300">Financial Future</span> with StackNova
      </h1>
      <p className="text-lg font-light mb-8 leading-relaxed">
        StackNova helps you manage investments across gold, stocks, cash, and bonds—offering real-time tracking, insights, and a unified dashboard to grow your portfolio confidently.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a href="/auth">
          <button className="relative bg-white text-purple-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300">
            Get Started
            <span className="absolute inset-0 rounded-full bg-purple-300 opacity-10"></span>
          </button>
        </a>
      </div>
    </div>
    <div className="hidden md:flex justify-end w-full md:w-1/2 relative">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-300 rounded-full blur-2xl opacity-20"></div>
      <img src={illus} alt="Portfolio Management Illustration" className="max-w-md rounded-xl shadow-2xl" />
    </div>
  </div>
</section>






      {/* ------------------------------------------------ */}
      {/* FEATURES / HIGHLIGHTS SECTION */}
      {/* ------------------------------------------------ */}
    <section id="features" className="relative bg-gradient-to-b from-gray-50 to-gray-100 py-12 md:py-16 px-4 md:px-8">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-extrabold text-purple-700 text-center mb-8">
    Why StackNova Stands Out
    </h2>
    <p className="max-w-2xl mx-auto text-center text-gray-600 mb-12">
      Empowering you with tools, support, and a compassionate space to help you
      thrive in every aspect of your finance portfolio management journey.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-8 gap-12">
      {/* Feature Card 1 */}
      <div className="p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 relative h-[280px]">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center rounded-full shadow-md">
          <FaShieldAlt className="text-white text-2xl" />
        </div>
        <h3 className="text-lg font-bold text-purple-700 mt-10 mb-3 text-center">
          Confidential & Secure
        </h3>
        <p className="text-gray-600 text-center text-sm">
        StackNova uses bank-level encryption and privacy-first design to ensure your financial data is safe.
        </p>
      </div>

      {/* Feature Card 2 */}
      <div className="p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 relative h-[280px]">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center rounded-full shadow-md">
          <FaClock className="text-white text-2xl" />
        </div>
        <h3 className="text-lg font-bold text-purple-700 mt-10 mb-3 text-center">
        Insightful Analytics
        </h3>
        <p className="text-gray-600 text-center text-sm">
        Get powerful visuals, ROI breakdowns, diversification insights, and more—all in one place.
        </p>
      </div>

      {/* Feature Card 3 */}
      <div className="p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 relative h-[280px]">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center rounded-full shadow-md">
          <FaLightbulb className="text-white text-2xl" />
        </div>
        <h3 className="text-lg font-bold text-purple-700 mt-10 mb-3 text-center">
        Real-Time Tracking
        </h3>
        <p className="text-gray-600 text-center text-sm">
        Monitor your gold, stocks, bonds, and cash portfolios with up-to-the-minute updates and trend analysis.
        </p>
      </div>

      {/* Feature Card 4 */}
      <div className="p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 relative h-[280px]">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center rounded-full shadow-md">
          <FaHandsHelping className="text-white text-2xl" />
        </div>
        <h3 className="text-lg font-bold text-purple-700 mt-10 mb-3 text-center">
        All-in-One Dashboard
        </h3>
        <p className="text-gray-600 text-center text-sm">
        A single platform to manage everything—whether you're investing small or scaling large.
        </p>
      </div>
    </div>
  </div>
</section>



<section className="bg-gradient-to-b from-purple-50 to-white py-12 px-4 md:px-8 lg:py-16">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-8">
      Can you relate to these?
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Card 1 */}
      <div className="relative bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center rounded-full shadow-lg">
            <FaBrain className="text-white text-3xl" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-purple-700 mb-4">
          AI-Driven Asset Insights
        </h3>
        <p className="text-gray-600 mb-6">
          StackNova intelligently analyzes your gold, stocks, bonds, and cash to uncover trends and optimize your portfolio allocation.
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105">
          Read More
        </button>
      </div>

      {/* Card 2 */}
      <div className="relative bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center rounded-full shadow-lg">
            <FaHeadset className="text-white text-3xl" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-purple-700 mb-4">
        Portfolio Support 24/7
        </h3>
        <p className="text-gray-600 mb-6">
        Our team and tools are here around the clock—whether you're rebalancing assets or 
        seeking data-driven decisions..
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105">
          Read More
        </button>
      </div>

      {/* Card 3 */}
      <div className="relative bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center rounded-full shadow-lg">
            <FaSmileBeam className="text-white text-3xl" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-purple-700 mb-4">
         Clarity in Complexity
        </h3>
        <p className="text-gray-600 mb-6">
         We simplify even the most complex portfolios—so you understand your holdings, performance, and opportunities at a glance.
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105">
          Read More
        </button>
      </div>
    </div>
  </div>
</section>

<section id="contact" className="bg-gradient-to-b from-purple-600 to-purple-500 py-16 px-4 md:px-8 lg:py-24">
  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    {/* Left: Contact Form */}
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
      <h2 className="text-2xl md:text-3xl font-extrabold text-purple-700 mb-4">
        Get in Touch
      </h2>
      <p className="text-gray-600 mb-6">
        Have questions or feedback? Fill out the form below, and we’ll get back
        to you shortly.
      </p>
      <form>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-2"
          >
            Your Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Your Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-gray-700 font-medium mb-2"
          >
            Your Message
          </label>
          <textarea
            id="message"
            rows="4"
            placeholder="Type your message here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Send Message
        </button>
      </form>
    </div>

    {/* Right: Illustration and Social Links */}
    <div className="hidden lg:flex flex-col items-center justify-center">
      {/* Illustration */}
      <img
        src={contact} // Replace with your illustration URL
        alt="Contact Illustration"
        className="max-w-md rounded-xl shadow-lg mb-8"
      />

      {/* Social Links */}
      <h3 className="text-xl font-bold text-white mb-4">Connect with Us</h3>
      <div className="flex space-x-4">
        {/* Facebook */}
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-800 transition"
        >
          <FaFacebookF className="text-lg" />
        </a>
        {/* Twitter */}
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-800 transition"
        >
          <FaTwitter className="text-lg" />
        </a>
        {/* Instagram */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-800 transition"
        >
          <FaInstagram className="text-lg" />
        </a>
        {/* Gmail */}
        <a
          href="mailto:support@stackNova.com"
          className="w-12 h-12 bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-800 transition"
        >
          <FaEnvelope className="text-lg" />
        </a>
      </div>
    </div>
  </div>
</section>


      {/* ------------------------------------------------ */}
      {/* FOOTER */}
      {/* ------------------------------------------------ */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
  <p>© {new Date().getFullYear()} StackNova. All rights reserved.</p>
  <p className="mt-2">
    StackNova is a portfolio management tool and does not provide financial advice. Please consult a certified advisor for investment decisions.
  </p>
</footer>
    </div>
  );
} 

export default LandingPage;
