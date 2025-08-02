import React, { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import './Cash.css'

const Cash = ({ onPageChange }) => {
    const [accounts, setAccounts] = useState([
        { id: 1, name: 'Checking Account', type: 'Checking', balance: 5000, interestRate: 0.1, bank: 'Chase Bank' },
        { id: 2, name: 'High Yield Savings', type: 'Savings', balance: 25000, interestRate: 4.5, bank: 'Marcus Goldman Sachs' },
        { id: 3, name: '6-Month CD', type: 'CD', balance: 10000, interestRate: 5.2, bank: 'Ally Bank' },
    ]);

    const [newAccount, setNewAccount] = useState({
        name: '',
        type: 'Checking',
        balance: '',
        interestRate: '',
        bank: ''
    });

    const [showAddForm, setShowAddForm] = useState(false);

    const addAccount = () => {
        if (newAccount.name && newAccount.balance && newAccount.bank) {
            const account = {
                id: Date.now(),
                name: newAccount.name,
                type: newAccount.type,
                balance: parseFloat(newAccount.balance),
                interestRate: parseFloat(newAccount.interestRate) || 0,
                bank: newAccount.bank
            };
            setAccounts([...accounts, account]);
            setNewAccount({ name: '', type: 'Checking', balance: '', interestRate: '', bank: '' });
            setShowAddForm(false);
        }
    };

    const removeAccount = (id) => {
        setAccounts(accounts.filter(account => account.id !== id));
    };

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const avgInterestRate = accounts.length > 0 ? accounts.reduce((sum, account) => sum + account.interestRate, 0) / accounts.length : 0;
    const annualInterest = accounts.reduce((sum, account) => sum + (account.balance * account.interestRate / 100), 0);

    const getTypeColor = (type) => {
        switch(type) {
            case 'Checking': return '#3b82f6';
            case 'Savings': return '#10b981';
            case 'CD': return '#f59e0b';
            case 'Money Market': return '#8b5cf6';
            default: return '#6b7280';
        }
    };

    return (
        <div className="cash-wrapper">
            <Navbar onPageChange={onPageChange} currentPage="cash" />
            <div className="cash-content">
                <div className="cash-header">
                    <h2>Cash & Deposits</h2>
                    <button 
                        className="add-account-btn"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        + Add Account
                    </button>
                </div>

                {showAddForm && (
                    <div className="add-account-form">
                        <h3>Add New Account</h3>
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="Account Name"
                                value={newAccount.name}
                                onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                            />
                            <select
                                value={newAccount.type}
                                onChange={(e) => setNewAccount({...newAccount, type: e.target.value})}
                            >
                                <option value="Checking">Checking</option>
                                <option value="Savings">Savings</option>
                                <option value="CD">Certificate of Deposit</option>
                                <option value="Money Market">Money Market</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Balance"
                                value={newAccount.balance}
                                onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
                            />
                            <input
                                type="number"
                                step="0.1"
                                placeholder="Interest Rate (%)"
                                value={newAccount.interestRate}
                                onChange={(e) => setNewAccount({...newAccount, interestRate: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Bank Name"
                                value={newAccount.bank}
                                onChange={(e) => setNewAccount({...newAccount, bank: e.target.value})}
                            />
                        </div>
                        <div className="form-actions">
                            <button className="save-btn" onClick={addAccount}>Save</button>
                            <button className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                <div className="portfolio-summary">
                    <div className="summary-card">
                        <h4>Total Balance</h4>
                        <span className="value">${totalBalance.toLocaleString()}</span>
                    </div>
                    <div className="summary-card">
                        <h4>Average Interest Rate</h4>
                        <span className="value">{avgInterestRate.toFixed(2)}%</span>
                    </div>
                    <div className="summary-card">
                        <h4>Annual Interest</h4>
                        <span className="value positive">${annualInterest.toFixed(2)}</span>
                    </div>
                </div>

                <div className="accounts-table">
                    <div className="table-header">
                        <span>Account Name</span>
                        <span>Type</span>
                        <span>Bank</span>
                        <span>Balance</span>
                        <span>Interest Rate</span>
                        <span>Annual Interest</span>
                        <span>Action</span>
                    </div>
                    {accounts.map(account => (
                        <div key={account.id} className="table-row">
                            <span className="account-name">{account.name}</span>
                            <span 
                                className="account-type"
                                style={{ color: getTypeColor(account.type) }}
                            >
                                {account.type}
                            </span>
                            <span className="bank-name">{account.bank}</span>
                            <span className="balance">${account.balance.toLocaleString()}</span>
                            <span className="interest-rate">{account.interestRate}%</span>
                            <span className="annual-interest positive">
                                ${(account.balance * account.interestRate / 100).toFixed(2)}
                            </span>
                            <button 
                                className="remove-btn"
                                onClick={() => removeAccount(account.id)}
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

export default Cash;