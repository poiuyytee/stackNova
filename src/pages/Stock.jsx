import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// --- Axios API Instance ---
const api = axios.create({
    baseURL: 'http://localhost:5000/api/portfolio', // It's often better to set the base to /api
    withCredentials: true // ✅ Correct: Placed inside the single config object
});



const Stock = () => {
    const [stockHoldings, setStockHoldings] = useState([]);
    const [newStock, setNewStock] = useState({
        stockName: '', // Ticker symbol
        stockPrice: '', // Purchase price
        stockQuantity: '',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // --- Data Fetching ---
    const fetchStockHoldings = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/getstocks');
            setStockHoldings(response.data.success ? response.data.stocks || [] : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching stock holdings:", err);
            setError("Failed to fetch stock portfolio. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStockHoldings();
    }, []);

    // --- Event Handlers ---
    const handleAddStock = async (e) => {
        e.preventDefault();
        const { stockName, stockPrice, stockQuantity } = newStock;
        if (!stockName || !stockPrice || !stockQuantity) {
            alert("All fields are required.");
            return;
        }
        try {
            await api.post('/addstock', {
                ...newStock,
                stockName: stockName.toUpperCase(),
                stockPrice: parseFloat(stockPrice),
                stockQuantity: parseInt(stockQuantity),
            });
            fetchStockHoldings(); // Refresh data
            setNewStock({ stockName: '', stockPrice: '', stockQuantity: '' });
            setShowAddForm(false);
        } catch (err) {
            console.error("Error adding stock:", err);
            alert("Failed to add stock. Please check the ticker symbol.");
        }
    };

    const handleRemoveStock = async (stockId) => {
        if (window.confirm("Are you sure you want to remove this stock?")) {
            try {
                await api.post('/removestock', { stockId });
                setStockHoldings(prev => prev.filter(s => s.id !== stockId));
            } catch (err) {
                console.error("Error removing stock:", err);
                alert("Failed to remove stock.");
            }
        }
    };

    // --- Memoized Calculations ---
    const portfolioSummary = useMemo(() => {
        const totalMarketValue = stockHoldings.reduce((sum, s) => sum + (s.currentPrice * s.stockQuantity || 0), 0);
        const totalInvestment = stockHoldings.reduce((sum, s) => sum + (s.stockPrice * s.stockQuantity), 0);
        const totalGainLoss = stockHoldings.reduce((sum, s) => sum + (s.gain || 0), 0);
        return { totalMarketValue, totalInvestment, totalGainLoss };
    }, [stockHoldings]);

    if (isLoading) return <div className="flex justify-center items-center h-screen bg-gray-900 text-lg text-gray-400">Loading Stock Portfolio...</div>;
    if (error) return <div className="flex justify-center items-center h-screen bg-gray-900"><div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">{error}</div></div>;

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* --- Header --- */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-indigo-400">Stock Portfolio 📈</h1>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                        {showAddForm ? 'Cancel' : '+ Add Stock'}
                    </button>
                </div>

                {/* --- Add Form --- */}
                {showAddForm && (
                    <div className="bg-gray-800 p-6 rounded-xl mb-8 shadow-lg border border-gray-700">
                        <h2 className="text-2xl font-semibold mb-5 text-white">Add New Stock</h2>
                        <form onSubmit={handleAddStock} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <input type="text" placeholder="Ticker Symbol (e.g. GOOGL)" value={newStock.stockName} onChange={(e) => setNewStock({ ...newStock, stockName: e.target.value })} className="bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 w-full" required />
                            <input type="number" placeholder="Quantity" value={newStock.stockQuantity} onChange={(e) => setNewStock({ ...newStock, stockQuantity: e.target.value })} className="bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 w-full" required />
                            <input type="number" step="0.01" placeholder="Purchase Price / Share" value={newStock.stockPrice} onChange={(e) => setNewStock({ ...newStock, stockPrice: e.target.value })} className="bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 w-full" required />
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg w-full">Save Stock</button>
                        </form>
                    </div>
                )}

                {/* --- Portfolio Summary --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-gray-700 hover:border-indigo-500 transition-all">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Market Value</h4>
                        <p className="text-3xl font-bold mt-2 text-white">₹{portfolioSummary.totalMarketValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-gray-700 hover:border-indigo-500 transition-all">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Investment</h4>
                        <p className="text-3xl font-bold mt-2 text-white">₹{portfolioSummary.totalInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-gray-700 hover:border-indigo-500 transition-all">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Gain/Loss</h4>
                        <p className={`text-3xl font-bold mt-2 ${portfolioSummary.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                           {portfolioSummary.totalGainLoss >= 0 ? '+' : ''}₹{portfolioSummary.totalGainLoss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* --- Holdings Table --- */}
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-x-auto border border-gray-700">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700/50">
                            <tr>
                                {['Ticker', 'Quantity', 'Purchase Price', 'Current Price', 'Market Value', 'Total Gain/Loss', 'Gain %', 'Action'].map(header => (
                                    <th key={header} className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {stockHoldings.length > 0 ? stockHoldings.map(s => (
                                <tr key={s.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors">
                                    <td className="p-4 whitespace-nowrap font-bold text-indigo-300">{s.stockName}</td>
                                    <td className="p-4 whitespace-nowrap">{s.stockQuantity}</td>
                                    <td className="p-4 whitespace-nowrap text-gray-400">₹{s.stockPrice.toLocaleString('en-IN')}</td>
                                    <td className="p-4 whitespace-nowrap font-semibold">{s.currentPrice ? `₹${s.currentPrice.toLocaleString('en-IN')}` : <span className="text-gray-500">N/A</span>}</td>
                                    <td className="p-4 whitespace-nowrap font-bold">{s.currentPrice ? `₹${(s.currentPrice * s.stockQuantity).toLocaleString('en-IN')}` : <span className="text-gray-500">N/A</span>}</td>
                                    <td className={`p-4 whitespace-nowrap font-semibold ${s.gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>{s.gain ? `${s.gain >= 0 ? '+' : ''}₹${s.gain.toLocaleString('en-IN')}` : <span className="text-gray-500">N/A</span>}</td>
                                    <td className={`p-4 whitespace-nowrap font-semibold ${s.gainPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>{s.gainPercent ? `${s.gainPercent.toFixed(2)}%` : <span className="text-gray-500">N/A</span>}</td>
                                    <td className="p-4 whitespace-nowrap">
                                        <button onClick={() => handleRemoveStock(s.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm">Remove</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="text-center p-8 text-gray-400">No stocks found. Add one to get started!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Stock;