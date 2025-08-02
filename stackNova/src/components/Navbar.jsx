import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ onPageChange, currentPage = 'home' }) => {
    const [activeTab, setActiveTab] = useState(currentPage);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (onPageChange) {
            onPageChange(tab);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-title">
                <h1>Portfolio Manager</h1>
                <span className="subtitle">Finance Dashboard</span>
            </div>
            <div className="navbar-buttons">
                <button 
                    className={activeTab === 'home' ? 'active' : ''}
                    onClick={() => handleTabClick('home')}
                >
                    🏠 Home
                </button>
                <button 
                    className={activeTab === 'stock' ? 'active' : ''}
                    onClick={() => handleTabClick('stock')}
                >
                    📈 Stock
                </button>
                <button 
                    className={activeTab === 'bond' ? 'active' : ''}
                    onClick={() => handleTabClick('bond')}
                >
                    📊 Bond
                </button>
                <button 
                    className={activeTab === 'cash' ? 'active' : ''}
                    onClick={() => handleTabClick('cash')}
                >
                    💵 Cash
                </button>
                <button 
                    className={activeTab === 'gold' ? 'active' : ''}
                    onClick={() => handleTabClick('gold')}
                >
                    🥇 Gold
                </button>
            </div>
        </nav>
    );
}

export default Navbar;