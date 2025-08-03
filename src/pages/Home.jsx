import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

// --- Axios API Instance ---
const api = axios.create({
    baseURL: 'http://localhost:5000/api/portfolio', // It's often better to set the base to /api
    withCredentials: true // ✅ Correct: Placed inside the single config object
});

// --- Helper for Pie Chart Labels ---
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent === 0) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/summary');
                if (response.data.success) setData(response.data);
                else throw new Error('Failed to fetch data.');
            } catch (err) {
                setError("Could not load dashboard.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const ASSET_COLORS = { Stocks: '#6366F1', Gold: '#F59E0B', Cash: '#3B82F6', Bonds: '#14B8A6' };

    if (isLoading) return <div className="flex justify-center items-center h-screen bg-gray-900 text-lg text-gray-400">Loading Dashboard...</div>;
    if (error) return <div className="flex justify-center items-center h-screen bg-gray-900"><div className="bg-red-900/50 p-4 rounded-lg">{error}</div></div>;
    if (!data) return null;

    let { kpis, breakdown, charts, marketMovers, lists } = data;

   marketMovers=Array.from(
    new Map(marketMovers.map(mover => [mover.name, mover])).values()
  );

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Portfolio Dashboard</h1>

                {/* --- Top Row Cards --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Total Portfolio Value Card */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Portfolio Value</h4>
                        <p className="text-3xl font-bold mt-2 text-white">₹{kpis.totalPortfolioValue.toLocaleString('en-IN')}</p>
                        <p className={`flex items-center text-sm font-semibold mt-1 ${kpis.totalDayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                           {kpis.totalDayChange >= 0 ? '▲' : '▼'} ₹{Math.abs(kpis.totalDayChange).toLocaleString('en-IN')} Today
                        </p>
                        <div className="border-t border-gray-700 mt-4 pt-4 space-y-2">
                            {Object.entries(breakdown).map(([key, asset]) => asset.value > 0 && (
                                <div key={key} className="flex justify-between text-sm">
                                    <span className="flex items-center text-gray-300">
                                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: ASSET_COLORS[key.charAt(0).toUpperCase() + key.slice(1)] }}></span>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </span>
                                    <span className="font-medium text-white">₹{asset.value.toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Overall Gain / Loss Card */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Overall Gain / Loss</h4>
                        <p className={`text-3xl font-bold mt-2 ${kpis.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {kpis.totalGainLoss >= 0 ? '+' : '-'}₹{Math.abs(kpis.totalGainLoss).toLocaleString('en-IN')}
                        </p>
                         <div className="border-t border-gray-700 mt-4 pt-4 space-y-2">
                            {Object.entries(breakdown).map(([key, asset]) => asset.value > 0 && (
                                <div key={key} className="flex justify-between text-sm">
                                    <span className="text-gray-300">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                    <span className={`font-medium ${asset.gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {asset.gain >= 0 ? '+' : '-'}₹{Math.abs(asset.gain).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Market Movers Card */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">My Stock Movers</h4>
                        <div className="space-y-3 mt-4">
                            {marketMovers.length > 0 ? marketMovers.map((mover, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-white">{mover.name}</p>
                                        <p className="text-sm text-gray-300">₹{mover.value.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${mover.change >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                        {mover.change >= 0 ? '+' : ''}{mover.change.toFixed(2)}%
                                    </div>
                                </div>
                            )) : <p className="text-gray-500 text-center pt-8">No stocks in portfolio.</p>}
                        </div>
                    </div>
                </div>

                {/* --- Bottom Row --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Asset Allocation Chart */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-white mb-4">Asset Allocation</h3>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={charts.assetAllocation} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={renderCustomizedLabel}>
                                        {charts.assetAllocation.map((entry, index) => <Cell key={`cell-${index}`} fill={ASSET_COLORS[entry.name]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }}/>
                                    <Legend iconSize={10} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Portfolio Performance Chart */}
                    <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-white mb-4">Portfolio Performance</h3>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <AreaChart data={charts.performance} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                    <defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#818CF8" stopOpacity={0.8}/><stop offset="95%" stopColor="#818CF8" stopOpacity={0}/></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickFormatter={(str) => new Date(str).toLocaleDateString('en-IN', {month: 'short', day: 'numeric'})} />
                                    <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(val) => `₹${(val/1000)}k`} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} />
                                    <Area type="monotone" dataKey="value" stroke="#818CF8" fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* --- Performers Lists --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Top Performers</h3>
                        <ul className="space-y-3">
                            {lists.topPerformers.map((item, index) => (
                                <li key={index} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">{item.name}</span>
                                    <span className="font-bold text-green-400">+₹{item.gain.toLocaleString('en-IN')}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="bg-gray-800 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Worst Performers</h3>
                        <ul className="space-y-3">
                            {lists.worstPerformers.map((item, index) => (
                                <li key={index} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">{item.name}</span>
                                    <span className="font-bold text-red-400">-₹{Math.abs(item.gain).toLocaleString('en-IN')}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
