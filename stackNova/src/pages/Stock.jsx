import React, { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import './Stock.css'

const Stock = ({ onPageChange }) => {
    const [stocks, setStocks] = useState([
        { id: 1, symbol: 'AAPL', name: 'Apple Inc.', shares: 10, buyPrice: 150.00, currentPrice: 175.43, change: '+2.34%', changeType: 'positive' },
        { id: 2, symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 5, buyPrice: 130.00, currentPrice: 142.56, change: '+1.87%', changeType: 'positive' },
        { id: 3, symbol: 'TSLA', name: 'Tesla Inc.', shares: 8, buyPrice: 260.00, currentPrice: 248.91, change: '-1.23%', changeType: 'negative' },
    ]);

    const [newStock, setNewStock] = useState({
        symbol: '',
        name: '',
        shares: '',
        buyPrice: ''
    });

    const [showAddForm, setShowAddForm] = useState(false);

    const addStock = () => {
        if (newStock.symbol && newStock.name && newStock.shares && newStock.buyPrice) {
            const stock = {
                id: Date.now(),
                symbol: newStock.symbol.toUpperCase(),
                name: newStock.name,
                shares: parseInt(newStock.shares),
                buyPrice: parseFloat(newStock.buyPrice),
                currentPrice: parseFloat(newStock.buyPrice) * (1 + Math.random() * 0.2 - 0.1),
                change: (Math.random() * 10 - 5).toFixed(2) + '%',
                changeType: Math.random() > 0.5 ? 'positive' : 'negative'
            };
            setStocks([...stocks, stock]);
            setNewStock({ symbol: '', name: '', shares: '', buyPrice: '' });
            setShowAddForm(false);
        }
    };

    const removeStock = (id) => {
        setStocks(stocks.filter(stock => stock.id !== id));
    };

    const calculateGainLoss = (stock) => {
        const gain = (stock.currentPrice - stock.buyPrice) * stock.shares;
        return gain;
    };

    const totalValue = stocks.reduce((sum, stock) => sum + (stock.currentPrice * stock.shares), 0);
    const totalInvested = stocks.reduce((sum, stock) => sum + (stock.buyPrice * stock.shares), 0);
    const totalGainLoss = totalValue - totalInvested;

    return (
        <div className="stock-wrapper">
            <Navbar onPageChange={onPageChange} currentPage="stock" />
            <div className="stock-content">
                <div className="stock-header">
                    <h2>Stock Portfolio</h2>
                    <button 
                        className="add-stock-btn"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        + Add Stock
                    </button>
                </div>

                {showAddForm && (
                    <div className="add-stock-form">
                        <h3>Add New Stock</h3>
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="Symbol (e.g., AAPL)"
                                value={newStock.symbol}
                                onChange={(e) => setNewStock({...newStock, symbol: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Company Name"
                                value={newStock.name}
                                onChange={(e) => setNewStock({...newStock, name: e.target.value})}
                            />
                            <input
                                type="number"
                                placeholder="Shares"
                                value={newStock.shares}
                                onChange={(e) => setNewStock({...newStock, shares: e.target.value})}
                            />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Buy Price"
                                value={newStock.buyPrice}
                                onChange={(e) => setNewStock({...newStock, buyPrice: e.target.value})}
                            />
                        </div>
                        <div className="form-actions">
                            <button className="save-btn" onClick={addStock}>Save</button>
                            <button className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                <div className="portfolio-summary">
                    <div className="summary-card">
                        <h4>Total Value</h4>
                        <span className="value">${totalValue.toFixed(2)}</span>
                    </div>
                    <div className="summary-card">
                        <h4>Total Invested</h4>
                        <span className="value">${totalInvested.toFixed(2)}</span>
                    </div>
                    <div className="summary-card">
                        <h4>Total Gain/Loss</h4>
                        <span className={`value ${totalGainLoss >= 0 ? 'positive' : 'negative'}`}>
                            ${totalGainLoss.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="stocks-table">
                    <div className="table-header">
                        <span>Symbol</span>
                        <span>Company</span>
                        <span>Shares</span>
                        <span>Buy Price</span>
                        <span>Current Price</span>
                        <span>Change</span>
                        <span>Gain/Loss</span>
                        <span>Action</span>
                    </div>
                    {stocks.map(stock => (
                        <div key={stock.id} className="table-row">
                            <span className="symbol">{stock.symbol}</span>
                            <span className="company">{stock.name}</span>
                            <span>{stock.shares}</span>
                            <span>${stock.buyPrice.toFixed(2)}</span>
                            <span>${stock.currentPrice.toFixed(2)}</span>
                            <span className={`change ${stock.changeType}`}>{stock.change}</span>
                            <span className={`gain-loss ${calculateGainLoss(stock) >= 0 ? 'positive' : 'negative'}`}>
                                ${calculateGainLoss(stock).toFixed(2)}
                            </span>
                            <button 
                                className="remove-btn"
                                onClick={() => removeStock(stock.id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Stock;