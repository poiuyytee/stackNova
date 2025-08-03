import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// --- Axios API Instance ---
const api = axios.create({
    baseURL: 'http://localhost:5000/api/portfolio', // It's often better to set the base to /api
    withCredentials: true // ✅ Correct: Placed inside the single config object
});



const Cash = () => {
    const [cashHoldings, setCashHoldings] = useState([]);
    const [newHolding, setNewHolding] = useState({
        bank: '',
        type: 'Savings',
        amount: '',
        interest: '', // Monthly interest rate
        date: new Date().toISOString().split('T')[0],
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // --- Data Fetching ---
    const fetchCashHoldings = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/getcash');
            setCashHoldings(response.data.success ? response.data.data || [] : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching cash holdings:", err);
            setError("Failed to fetch cash & deposits. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCashHoldings();
    }, []);

    // --- Event Handlers ---
    const handleAddHolding = async (e) => {
        e.preventDefault();
        const { amount, type, interest, bank, date } = newHolding;
        if (!amount || !interest || !bank || !date || !type) {
            alert("All fields are required.");
            return;
        }
        try {
            await api.post('/addcash', {
                ...newHolding,
                amount: parseFloat(amount),
                interest: parseFloat(interest),
            });
            fetchCashHoldings(); // Refresh data
            setNewHolding({ bank: '', type: 'Savings', amount: '', interest: '', date: new Date().toISOString().split('T')[0] });
            setShowAddForm(false);
        } catch (err) {
            console.error("Error adding cash holding:", err);
            alert("Failed to add cash holding.");
        }
    };

    const handleRemoveHolding = async (cashId) => {
        if (window.confirm("Are you sure you want to remove this account?")) {
            try {
                await api.post('/removecash', { cashId });
                setCashHoldings(prev => prev.filter(h => h.id !== cashId));
            } catch (err) {
                console.error("Error removing cash holding:", err);
                alert("Failed to remove account.");
            }
        }
    };

    // --- Memoized Calculations ---
    const portfolioSummary = useMemo(() => {
        const totalCurrentValue = cashHoldings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
        const totalInterestEarned = cashHoldings.reduce((sum, h) => sum + (h.interestEarned || 0), 0);
        return { totalCurrentValue, totalInterestEarned };
    }, [cashHoldings]);
    
    // --- UI Helpers ---
    const getTypePill = (type) => {
        const baseStyle = "px-3 py-1 text-xs font-semibold rounded-full";
        switch(type) {
            case 'Savings': return `${baseStyle} bg-emerald-500/20 text-emerald-300`;
            case 'Checking': return `${baseStyle} bg-sky-500/20 text-sky-300`;
            case 'Fixed Deposit': return `${baseStyle} bg-amber-500/20 text-amber-300`;
            default: return `${baseStyle} bg-gray-500/20 text-gray-300`;
        }
    };


    if (isLoading) return <div className="flex justify-center items-center h-screen bg-gray-900 text-lg text-gray-400">Loading Cash & Deposits...</div>;
    if (error) return <div className="flex justify-center items-center h-screen bg-gray-900"><div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">{error}</div></div>;

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* --- Header --- */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-sky-400">Cash & Deposits 💵</h1>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                        {showAddForm ? 'Cancel' : '+ Add Account'}
                    </button>
                </div>

                {/* --- Add Form --- */}
                {showAddForm && (
                    <div className="bg-gray-800 p-6 rounded-xl mb-8 shadow-lg border border-gray-700">
                        <h2 className="text-2xl font-semibold mb-5 text-white">Add New Cash Account</h2>
                        <form onSubmit={handleAddHolding} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <input type="text" placeholder="Bank Name (e.g., HDFC Bank)" value={newHolding.bank} onChange={(e) => setNewHolding({ ...newHolding, bank: e.target.value })} className="bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-sky-500 focus:border-sky-500 w-full" required />
                            <select value={newHolding.type} onChange={(e) => setNewHolding({ ...newHolding, type: e.target.value })} className="bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-sky-500 focus:border-sky-500 w-full" required>
                                <option>Savings</option>
                                <option>Checking</option>
                                <option>Fixed Deposit</option>
                            </select>
                            <input type="number" placeholder="Initial Amount (e.g., 50000)" value={newHolding.amount} onChange={(e) => setNewHolding({ ...newHolding, amount: e.target.value })} className="bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-sky-500 focus:border-sky-500 w-full" required />
                            <input type="number" step="0.01" placeholder="Monthly Interest Rate %" value={newHolding.interest} onChange={(e) => setNewHolding({ ...newHolding, interest: e.target.value })} className="bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-sky-500 focus:border-sky-500 w-full" required />
                            <input type="date" value={newHolding.date} onChange={(e) => setNewHolding({ ...newHolding, date: e.target.value })} className="bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-sky-500 focus:border-sky-500 w-full" required />
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg w-full">Save Account</button>
                        </form>
                    </div>
                )}

                {/* --- Portfolio Summary --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-gray-700 hover:border-sky-500 transition-all">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Current Value</h4>
                        <p className="text-3xl font-bold mt-2 text-white">₹{portfolioSummary.totalCurrentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-gray-700 hover:border-sky-500 transition-all">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Interest Earned</h4>
                        <p className="text-3xl font-bold mt-2 text-green-400">+ ₹{portfolioSummary.totalInterestEarned.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>

                {/* --- Holdings Table --- */}
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-x-auto border border-gray-700">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700/50">
                            <tr>
                                {['Bank', 'Type', 'Start Date', 'Principal', 'Interest (monthly)', 'Interest Earned', 'Current Value', 'Action'].map(header => (
                                    <th key={header} className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {cashHoldings.length > 0 ? cashHoldings.map(h => (
                                <tr key={h.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors">
                                    <td className="p-4 whitespace-nowrap font-medium">{h.bank}</td>
                                    <td className="p-4 whitespace-nowrap"><span className={getTypePill(h.type)}>{h.type}</span></td>
                                    <td className="p-4 whitespace-nowrap text-gray-400">{new Date(h.date).toLocaleDateString()}</td>
                                    <td className="p-4 whitespace-nowrap">₹{parseFloat(h.amount).toLocaleString('en-IN')}</td>
                                    <td className="p-4 whitespace-nowrap text-sky-300">{h.interest}%</td>
                                    <td className="p-4 whitespace-nowrap text-green-400 font-semibold">+ ₹{h.interestEarned.toLocaleString('en-IN')}</td>
                                    <td className="p-4 whitespace-nowrap font-bold">₹{h.currentValue.toLocaleString('en-IN')}</td>
                                    <td className="p-4 whitespace-nowrap">
                                        <button onClick={() => handleRemoveHolding(h.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm">Remove</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="text-center p-8 text-gray-400">No cash accounts found. Add one to get started!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Cash;