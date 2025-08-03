import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// --- Axios API Instance ---
const api = axios.create({
    baseURL: 'http://localhost:5000/api/portfolio', // It's often better to set the base to /api
    withCredentials: true // ✅ Correct: Placed inside the single config object
});

const Bond = () => {
    const [bondHoldings, setBondHoldings] = useState([]);
    const [newBond, setNewBond] = useState({
        bondName: '',
        principalAmount: '',
        couponRate: '',
        issueDate: new Date().toISOString().split('T')[0],
        maturityDate: '',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // --- Data Fetching ---
    const fetchBondHoldings = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/getbonds');
            setBondHoldings(response.data.success ? response.data.bonds || [] : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching bond holdings:", err);
            setError("Failed to fetch bond portfolio. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBondHoldings();
    }, []);

    // --- Event Handlers ---
    const handleAddBond = async (e) => {
        e.preventDefault();
        const { bondName, principalAmount, couponRate, issueDate, maturityDate } = newBond;
        if (!bondName || !principalAmount || !couponRate || !issueDate || !maturityDate) {
            alert("All fields are required.");
            return;
        }
        try {
            await api.post('/addbond', {
                ...newBond,
                principalAmount: parseFloat(principalAmount),
                couponRate: parseFloat(couponRate),
            });
            fetchBondHoldings(); // Refresh data
            setNewBond({ bondName: '', principalAmount: '', couponRate: '', issueDate: new Date().toISOString().split('T')[0], maturityDate: '' });
            setShowAddForm(false);
        } catch (err) {
            console.error("Error adding bond:", err);
            alert("Failed to add bond.");
        }
    };

    const handleRemoveBond = async (bondId) => {
        if (window.confirm("Are you sure you want to remove this bond?")) {
            try {
                await api.post('/removebond', { bondId });
                setBondHoldings(prev => prev.filter(b => b.id !== bondId));
            } catch (err) {
                console.error("Error removing bond:", err);
                alert("Failed to remove bond.");
            }
        }
    };

    // --- Memoized Calculations ---
    const portfolioSummary = useMemo(() => {
        const totalCurrentValue = bondHoldings.reduce((sum, b) => sum + (b.currentValue || 0), 0);
        const totalPrincipal = bondHoldings.reduce((sum, b) => sum + parseFloat(b.principalAmount), 0);
        const totalInterestAccrued = bondHoldings.reduce((sum, b) => sum + (b.interestAccrued || 0), 0);
        return { totalCurrentValue, totalPrincipal, totalInterestAccrued };
    }, [bondHoldings]);

    if (isLoading) return <div className="flex justify-center items-center h-screen bg-gray-900 text-lg text-gray-400">Loading Bond Portfolio...</div>;
    if (error) return <div className="flex justify-center items-center h-screen bg-gray-900"><div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">{error}</div></div>;

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* --- Header --- */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-teal-400">Bond Portfolio 📜</h1>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                        {showAddForm ? 'Cancel' : '+ Add Bond'}
                    </button>
                </div>

                {/* --- Add Form --- */}
                {showAddForm && (
                    <div className="bg-gray-800 p-6 rounded-xl mb-8 shadow-lg border border-gray-700">
                        <h2 className="text-2xl font-semibold mb-5 text-white">Add New Bond</h2>
                        <form onSubmit={handleAddBond} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <input type="text" placeholder="Bond Name (e.g., Sovereign Gold Bond)" value={newBond.bondName} onChange={(e) => setNewBond({ ...newBond, bondName: e.target.value })} className="bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500 w-full col-span-1 md:col-span-2 lg:col-span-3" required />
                            <input type="number" placeholder="Principal Amount (₹)" value={newBond.principalAmount} onChange={(e) => setNewBond({ ...newBond, principalAmount: e.target.value })} className="bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500 w-full" required />
                            <input type="number" step="0.01" placeholder="Coupon Rate (%)" value={newBond.couponRate} onChange={(e) => setNewBond({ ...newBond, couponRate: e.target.value })} className="bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500 w-full" required />
                            <div className="w-full">
                                <label className="text-xs text-gray-400">Issue Date</label>
                                <input type="date" value={newBond.issueDate} onChange={(e) => setNewBond({ ...newBond, issueDate: e.target.value })} className="bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500 w-full mt-1" required />
                            </div>
                            <div className="w-full">
                                <label className="text-xs text-gray-400">Maturity Date</label>
                                <input type="date" value={newBond.maturityDate} onChange={(e) => setNewBond({ ...newBond, maturityDate: e.target.value })} className="bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500 w-full mt-1" required />
                            </div>
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg w-full h-full mt-auto">Save Bond</button>
                        </form>
                    </div>
                )}

                {/* --- Portfolio Summary --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-gray-700 hover:border-teal-500 transition-all">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Current Value</h4>
                        <p className="text-3xl font-bold mt-2 text-white">₹{portfolioSummary.totalCurrentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-gray-700 hover:border-teal-500 transition-all">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Principal</h4>
                        <p className="text-3xl font-bold mt-2 text-white">₹{portfolioSummary.totalPrincipal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-gray-700 hover:border-teal-500 transition-all">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Interest Accrued</h4>
                        <p className="text-3xl font-bold mt-2 text-green-400">+ ₹{portfolioSummary.totalInterestAccrued.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>

                {/* --- Holdings Table --- */}
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-x-auto border border-gray-700">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700/50">
                            <tr>
                                {['Bond Name', 'Principal', 'Coupon', 'Maturity', 'Interest Accrued', 'Current Value', 'Action'].map(header => (
                                    <th key={header} className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {bondHoldings.length > 0 ? bondHoldings.map(b => (
                                <tr key={b.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors">
                                    <td className="p-4 whitespace-nowrap font-medium text-teal-300">{b.bondName}</td>
                                    <td className="p-4 whitespace-nowrap">₹{parseFloat(b.principalAmount).toLocaleString('en-IN')}</td>
                                    <td className="p-4 whitespace-nowrap text-sky-300">{b.couponRate}%</td>
                                    <td className="p-4 whitespace-nowrap text-gray-400">{new Date(b.maturityDate).toLocaleDateString()}</td>
                                    <td className="p-4 whitespace-nowrap text-green-400 font-semibold">+ ₹{b.interestAccrued.toLocaleString('en-IN')}</td>
                                    <td className="p-4 whitespace-nowrap font-bold">₹{b.currentValue.toLocaleString('en-IN')}</td>
                                    <td className="p-4 whitespace-nowrap">
                                        <button onClick={() => handleRemoveBond(b.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm">Remove</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="text-center p-8 text-gray-400">No bonds found. Add one to get started!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Bond;
