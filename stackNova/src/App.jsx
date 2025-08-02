import React, { useState } from 'react'
import Home from './pages/Home.jsx'
import Stock from './pages/Stock.jsx'
import Bond from './pages/Bond.jsx'
import Cash from './pages/Cash.jsx'
import Gold from './pages/Gold.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'stock':
        return <Stock onPageChange={handlePageChange} />;
      case 'bond':
        return <Bond onPageChange={handlePageChange} />;
      case 'cash':
        return <Cash onPageChange={handlePageChange} />;
      case 'gold':
        return <Gold onPageChange={handlePageChange} />;
      default:
        return <Home onPageChange={handlePageChange} />;
    }
  };

  return (
    <div>
      {renderPage()}
    </div>
  );
}

export default App
