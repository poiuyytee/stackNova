import React, { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import './Gold.css'

const Gold = ({ onPageChange }) => {
    const [goldHoldings, setGoldHoldings] = useState([
        { id: 1, name: 'Physical Gold Bars', type: 'Physical', weight: 10, unit: 'oz', buyPrice: 1850, currentPrice: 1920, purity: '99.9%' },
        { id: 2, name: 'Gold ETF (GLD)', type: 'ETF', weight: 50, unit: 'shares', buyPrice: 180, currentPrice: 185, purity: 'N/A' },
        { id: 3, name: 'Gold Coins (Eagles)', type: 'Coins', weight: 5, unit: 'oz', buyPrice: 1900, currentPrice: 1950, purity: '91.7%' },
    ]);

    const [newHolding, setNewHolding] = useState({
        name: '',
        type: 'Physical',
        weight: '',
        unit: 'oz',
        buyPrice: '',
        purity: ''
    });

    const [showAddForm, setShowAddForm] = useState(false);

    const addHolding = () => {
        if (newHolding.name && newHolding.weight && newHolding.buyPrice) {
            const holding = {
                id: Date.now(),
                name: newHolding.name,
                type: newHolding.type,
                weight: parseFloat(newHolding.weight),
                unit: newHolding.unit,
                buyPrice: parseFloat(newHolding.buyPrice),
                currentPrice: parseFloat(newHolding.buyPrice) * (1 + Math.random() * 0.1 - 0.05),
                purity: newHolding.purity || (newHolding.type === 'ETF' ? 'N/A' : '99.9%')
            };
            setGoldHoldings([...goldHoldings, holding]);
            setNewHolding({ name: '', type: 'Physical', weight: '', unit: 'oz', buyPrice: '', purity: '' });
            setShowAddForm(false);
        }
    };

    const removeHolding = (id) => {
        setGoldHoldings(goldHoldings.filter(holding => holding.id !== id));
    };

    const calculateValue = (holding) => {
        return holding.weight * holding.currentPrice;
    };

    const calculateGainLoss = (holding) => {
        return (holding.currentPrice - holding.buyPrice) * holding.weight;
    };

    const totalValue = goldHoldings.reduce((sum, holding) => sum + calculateValue(holding), 0);
    const totalInvested = goldHoldings.reduce((sum, holding) => sum + (holding.buyPrice * holding.weight), 0);
    const totalGainLoss = totalValue - totalInvested;
    const totalWeight = goldHoldings.filter(h => h.unit === 'oz').reduce((sum, holding) => sum + holding.weight, 0);

    const getTypeColor = (type) => {
        switch(type) {
            case 'Physical': return '#f59e0b';
            case 'ETF': return '#eab308';
            case 'Coins': return '#d97706';
            case 'Mining Stocks': return '#b45309';
            default: return '#92400e';
        }
    };

    return (
        <div className="gold-wrapper">
            <Navbar onPageChange={onPageChange} currentPage="gold" />
            <div className="gold-content">
                <div className="gold-header">
                    <h2>Gold Portfolio</h2>
                    <button 
                        className="add-holding-btn"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        + Add Holding
                    </button>
                </div>

                {showAddForm && (
                    <div className="add-holding-form">
                        <h3>Add New Gold Holding</h3>
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="Holding Name"
                                value={newHolding.name}
                                onChange={(e) => setNewHolding({...newHolding, name: e.target.value})}
                            />
                            <select
                                value={newHolding.type}
                                onChange={(e) => setNewHolding({...newHolding, type: e.target.value})}
                            >
                                <option value="Physical">Physical Gold</option>
                                <option value="ETF">Gold ETF</option>
                                <option value="Coins">Gold Coins</option>
                                <option value="Mining Stocks">Mining Stocks</option>
                            </select>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="Weight/Quantity"
                                value={newHolding.weight}
                                onChange={(e) => setNewHolding({...newHolding, weight: e.target.value})}
                            />
                            <select
                                value={newHolding.unit}
                                onChange={(e) => setNewHolding({...newHolding, unit: e.target.value})}
                            >
                                <option value="oz">Ounces</option>
                                <option value="shares">Shares</option>
                                <option value="grams">Grams</option>
                            </select>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Buy Price per Unit"
                                value={newHolding.buyPrice}
                                onChange={(e) => setNewHolding({...newHolding, buyPrice: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Purity (e.g., 99.9%)"
                                value={newHolding.purity}
                                onChange={(e) => setNewHolding({...newHolding, purity: e.target.value})}
                            />
                        </div>
                        <div className="form-actions">
                            <button className="save-btn" onClick={addHolding}>Save</button>
                            <button className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                <div className="portfolio-summary">
                    <div className="summary-card">
                        <h4>Total Value</h4>
                        <span className="value">${totalValue.toLocaleString()}</span>
                    </div>
                    <div className="summary-card">
                        <h4>Total Weight (oz)</h4>
                        <span className="value">{totalWeight.toFixed(2)} oz</span>
                    </div>
                    <div className="summary-card">
                        <h4>Total Gain/Loss</h4>
                        <span className={`value ${totalGainLoss >= 0 ? 'positive' : 'negative'}`}>
                            ${totalGainLoss.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="holdings-table">
                    <div className="table-header">
                        <span>Holding Name</span>
                        <span>Type</span>
                        <span>Weight/Qty</span>
                        <span>Buy Price</span>
                        <span>Current Price</span>
                        <span>Total Value</span>
                        <span>Gain/Loss</span>
                        <span>Purity</span>
                        <span>Action</span>
                    </div>
                    {goldHoldings.map(holding => (
                        <div key={holding.id} className="table-row">
                            <span className="holding-name">{holding.name}</span>
                            <span 
                                className="holding-type"
                                style={{ color: getTypeColor(holding.type) }}
                            >
                                {holding.type}
                            </span>
                            <span>{holding.weight} {holding.unit}</span>
                            <span>${holding.buyPrice.toFixed(2)}</span>
                            <span>${holding.currentPrice.toFixed(2)}</span>
                            <span className="total-value">${calculateValue(holding).toLocaleString()}</span>
                            <span className={`gain-loss ${calculateGainLoss(holding) >= 0 ? 'positive' : 'negative'}`}>
                                ${calculateGainLoss(holding).toFixed(2)}
                            </span>
                            <span className="purity">{holding.purity}</span>
                            <button 
                                className="remove-btn"
                                onClick={() => removeHolding(holding.id)}
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

export default Gold;