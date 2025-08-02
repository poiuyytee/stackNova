import React, { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import './Bond.css'

const Bond = ({ onPageChange }) => {
    const [bonds, setBonds] = useState([
        { id: 1, name: 'US Treasury 10Y', type: 'Government', faceValue: 1000, couponRate: 4.5, maturityDate: '2034-01-15', currentYield: 4.2, rating: 'AAA' },
        { id: 2, name: 'Corporate Bond XYZ', type: 'Corporate', faceValue: 5000, couponRate: 6.2, maturityDate: '2029-06-30', currentYield: 6.8, rating: 'BBB+' },
        { id: 3, name: 'Municipal Bond ABC', type: 'Municipal', faceValue: 2000, couponRate: 3.8, maturityDate: '2031-12-01', currentYield: 3.5, rating: 'AA' },
    ]);

    const [newBond, setNewBond] = useState({
        name: '',
        type: 'Government',
        faceValue: '',
        couponRate: '',
        maturityDate: '',
        rating: 'AAA'
    });

    const [showAddForm, setShowAddForm] = useState(false);

    const addBond = () => {
        if (newBond.name && newBond.faceValue && newBond.couponRate && newBond.maturityDate) {
            const bond = {
                id: Date.now(),
                name: newBond.name,
                type: newBond.type,
                faceValue: parseFloat(newBond.faceValue),
                couponRate: parseFloat(newBond.couponRate),
                maturityDate: newBond.maturityDate,
                currentYield: parseFloat(newBond.couponRate) + (Math.random() * 1 - 0.5),
                rating: newBond.rating
            };
            setBonds([...bonds, bond]);
            setNewBond({ name: '', type: 'Government', faceValue: '', couponRate: '', maturityDate: '', rating: 'AAA' });
            setShowAddForm(false);
        }
    };

    const removeBond = (id) => {
        setBonds(bonds.filter(bond => bond.id !== id));
    };

    const totalFaceValue = bonds.reduce((sum, bond) => sum + bond.faceValue, 0);
    const avgYield = bonds.length > 0 ? bonds.reduce((sum, bond) => sum + bond.currentYield, 0) / bonds.length : 0;
    const annualIncome = bonds.reduce((sum, bond) => sum + (bond.faceValue * bond.couponRate / 100), 0);

    const getRatingColor = (rating) => {
        if (rating.startsWith('AA')) return '#10b981';
        if (rating.startsWith('A')) return '#3b82f6';
        if (rating.startsWith('BB')) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="bond-wrapper">
            <Navbar onPageChange={onPageChange} currentPage="bond" />
            <div className="bond-content">
                <div className="bond-header">
                    <h2>Bond Portfolio</h2>
                    <button 
                        className="add-bond-btn"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        + Add Bond
                    </button>
                </div>

                {showAddForm && (
                    <div className="add-bond-form">
                        <h3>Add New Bond</h3>
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="Bond Name"
                                value={newBond.name}
                                onChange={(e) => setNewBond({...newBond, name: e.target.value})}
                            />
                            <select
                                value={newBond.type}
                                onChange={(e) => setNewBond({...newBond, type: e.target.value})}
                            >
                                <option value="Government">Government</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Municipal">Municipal</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Face Value"
                                value={newBond.faceValue}
                                onChange={(e) => setNewBond({...newBond, faceValue: e.target.value})}
                            />
                            <input
                                type="number"
                                step="0.1"
                                placeholder="Coupon Rate (%)"
                                value={newBond.couponRate}
                                onChange={(e) => setNewBond({...newBond, couponRate: e.target.value})}
                            />
                            <input
                                type="date"
                                value={newBond.maturityDate}
                                onChange={(e) => setNewBond({...newBond, maturityDate: e.target.value})}
                            />
                            <select
                                value={newBond.rating}
                                onChange={(e) => setNewBond({...newBond, rating: e.target.value})}
                            >
                                <option value="AAA">AAA</option>
                                <option value="AA+">AA+</option>
                                <option value="AA">AA</option>
                                <option value="A+">A+</option>
                                <option value="A">A</option>
                                <option value="BBB+">BBB+</option>
                                <option value="BBB">BBB</option>
                                <option value="BB+">BB+</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button className="save-btn" onClick={addBond}>Save</button>
                            <button className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                <div className="portfolio-summary">
                    <div className="summary-card">
                        <h4>Total Face Value</h4>
                        <span className="value">${totalFaceValue.toLocaleString()}</span>
                    </div>
                    <div className="summary-card">
                        <h4>Average Yield</h4>
                        <span className="value">{avgYield.toFixed(2)}%</span>
                    </div>
                    <div className="summary-card">
                        <h4>Annual Income</h4>
                        <span className="value positive">${annualIncome.toFixed(2)}</span>
                    </div>
                </div>

                <div className="bonds-table">
                    <div className="table-header">
                        <span>Bond Name</span>
                        <span>Type</span>
                        <span>Face Value</span>
                        <span>Coupon Rate</span>
                        <span>Current Yield</span>
                        <span>Maturity Date</span>
                        <span>Rating</span>
                        <span>Action</span>
                    </div>
                    {bonds.map(bond => (
                        <div key={bond.id} className="table-row">
                            <span className="bond-name">{bond.name}</span>
                            <span className="bond-type">{bond.type}</span>
                            <span>${bond.faceValue.toLocaleString()}</span>
                            <span>{bond.couponRate}%</span>
                            <span className="yield">{bond.currentYield.toFixed(2)}%</span>
                            <span>{new Date(bond.maturityDate).toLocaleDateString()}</span>
                            <span 
                                className="rating"
                                style={{ color: getRatingColor(bond.rating) }}
                            >
                                {bond.rating}
                            </span>
                            <button 
                                className="remove-btn"
                                onClick={() => removeBond(bond.id)}
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

export default Bond;