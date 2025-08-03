import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// --- Axios API Instance ---
const api = axios.create({
    baseURL: 'http://localhost:5000/api/portfolio',
    withCredentials: true
});


const Gold = () => {
    const [goldHoldings, setGoldHoldings] = useState([]);
    const [newHolding, setNewHolding] = useState({
        quantityInGrams: '',
        purchasePricePerGram: '',
        purchaseDate: new Date().toISOString().split('T')[0],
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchGoldHoldings = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/getgold');
            setGoldHoldings(response.data.success ? response.data.gold || [] : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching gold holdings:", err);
            setError("Failed to fetch gold holdings. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGoldHoldings();
    }, []);

    const handleAddHolding = async (e) => {
        e.preventDefault();
        const { quantityInGrams, purchasePricePerGram, purchaseDate } = newHolding;
        if (!quantityInGrams || !purchasePricePerGram || !purchaseDate) {
            alert("All fields are required.");
            return;
        }
        try {
            await api.post('/addgold', {
                quantityInGrams: parseFloat(quantityInGrams),
                purchasePricePerGram: parseFloat(purchasePricePerGram),
                purchaseDate,
            });
            fetchGoldHoldings(); // Refresh data
            setNewHolding({ quantityInGrams: '', purchasePricePerGram: '', purchaseDate: new Date().toISOString().split('T')[0] });
            setShowAddForm(false);
        } catch (err) {
            console.error("Error adding gold holding:", err);
            alert("Failed to add holding.");
        }
    };

    const handleRemoveHolding = async (goldId) => {
        if (window.confirm("Are you sure you want to remove this holding?")) {
            try {
                await api.post('/removegold', { goldId });
                setGoldHoldings(prev => prev.filter(h => h.id !== goldId));
            } catch (err) {
                console.error("Error removing gold holding:", err);
                alert("Failed to remove holding.");
            }
        }
    };

    // ✅ FIX: Use parseFloat to ensure all calculations are done with numbers
    const portfolioSummary = useMemo(() => {
        const totalValue = goldHoldings.reduce((sum, h) => sum + parseFloat(h.currentValue || 0), 0);
        const totalGain = goldHoldings.reduce((sum, h) => sum + parseFloat(h.totalGain || 0), 0);
        const totalWeightInGrams = goldHoldings.reduce((sum, h) => sum + parseFloat(h.quantityInGrams || 0), 0);
        return { totalValue, totalGain, totalWeightInGrams };
    }, [goldHoldings]);

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            <p className="text-xl text-gray-400">Loading Gold Portfolio...</p>
        </div>
    );
    
    if (error) return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-center">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* --- Header --- */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-amber-400">Gold Portfolio 🪙</h1>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                        {showAddForm ? 'Cancel' : '+ Add Holding'}
                    </button>
                </div>

                {/* --- Add Form --- */}
                {showAddForm && (
                    <div className="bg-gray-800 p-6 rounded-xl mb-8 shadow-lg border border-gray-700 transition-all">
                        <h2 className="text-2xl font-semibold mb-5 text-white">Add New Gold Holding</h2>
                        <form onSubmit={handleAddHolding} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <input
                                type="number"
                                placeholder="Quantity (grams)"
                                value={newHolding.quantityInGrams}
                                onChange={(e) => setNewHolding({ ...newHolding, quantityInGrams: e.target.value })}
                                className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500 w-full"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Purchase Price per Gram ($)"
                                value={newHolding.purchasePricePerGram}
                                onChange={(e) => setNewHolding({ ...newHolding, purchasePricePerGram: e.target.value })}
                                className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500 w-full"
                                required
                            />
                            <input
                                type="date"
                                value={newHolding.purchaseDate}
                                onChange={(e) => setNewHolding({ ...newHolding, purchaseDate: e.target.value })}
                                className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500 w-full"
                                required
                            />
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg md:col-start-2 lg:col-start-4">Save Holding</button>
                        </form>
                    </div>
                )}

                {/* --- Portfolio Summary --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 transition-all duration-300 hover:border-amber-500 hover:shadow-amber-500/10">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Value</h4>
                        <p className="text-3xl font-bold mt-2 text-white">${portfolioSummary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 transition-all duration-300 hover:border-amber-500 hover:shadow-amber-500/10">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Weight</h4>
                        <p className="text-3xl font-bold mt-2 text-white">{portfolioSummary.totalWeightInGrams.toFixed(2)} g</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 transition-all duration-300 hover:border-amber-500 hover:shadow-amber-500/10">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Gain/Loss</h4>
                        <p className={`text-3xl font-bold mt-2 ${portfolioSummary.totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                           ${portfolioSummary.totalGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* --- Holdings Table --- */}
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-x-auto border border-gray-700">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700/50">
                            <tr>
                                {['Purchase Date', 'Quantity (g)', 'Purchase Price/g', 'Live Price/g', 'Current Value', 'Gain/Loss', 'Gain %', 'Action'].map(header => (
                                    <th key={header} className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {goldHoldings.length > 0 ? goldHoldings.map(h => (
                                <tr key={h.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors duration-200">
                                    <td className="p-4 whitespace-nowrap">{new Date(h.purchase_date).toLocaleDateString()}</td>
                                        {/* ✅ FIX: Use parseFloat before calling toFixed */}
                                    <td className="p-4 whitespace-nowrap">{parseFloat(h.quantityInGrams || 0).toFixed(2)} g</td>
                                    <td className="p-4 whitespace-nowrap">${parseFloat(h.purchasePricePerGram || 0).toFixed(2)}</td>
                                    <td className="p-4 whitespace-nowrap">{h.livePricePerGram ? `$${parseFloat(h.livePricePerGram).toFixed(2)}` : <span className="text-gray-500">N/A</span>}</td>
                                    <td className="p-4 whitespace-nowrap font-bold">{h.currentValue ? `$${parseFloat(h.currentValue).toFixed(2)}` : <span className="text-gray-500">N/A</span>}</td>
                                    <td className={`p-4 whitespace-nowrap font-semibold ${parseFloat(h.totalGain || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>{h.totalGain ? `$${parseFloat(h.totalGain).toFixed(2)}` : <span className="text-gray-500">N/A</span>}</td>
                                    <td className={`p-4 whitespace-nowrap font-semibold ${parseFloat(h.gainPercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>{h.gainPercent ? `${parseFloat(h.gainPercent).toFixed(2)}%` : <span className="text-gray-500">N/A</span>}</td>
                                    <td className="p-4 whitespace-nowrap">
                                        <button onClick={() => handleRemoveHolding(h.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm">Remove</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="text-center p-8 text-gray-400">
                                        No gold holdings found. Add one to get started!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Gold;
