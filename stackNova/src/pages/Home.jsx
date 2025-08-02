import React from 'react'
import Navbar from '../components/Navbar.jsx'
import {Line, Pie} from 'react-chartjs-2'
import {Chart, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, ArcElement} from 'chart.js'
import './Home.css'

Chart.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, ArcElement)
const Home = ({ onPageChange }) => {
    const incomeData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Annual Income ($)',
                data: [2000, 2500, 1800, 2200, 3000, 2800, 3200, 3500, 3100, 3800, 4000, 4200],
                borderColor: '#60a5fa',
                backgroundColor: 'rgba(96, 165, 250, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(148, 163, 184, 0.2)',
                },
                ticks: {
                    color: '#94a3b8',
                },
            },
            x: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.2)',
                },
                ticks: {
                    color: '#94a3b8',
                },
            },
        },
    };

    const pieData = {
        labels: ['Income', 'Rent', 'Food', 'Transportation', 'Entertainment', 'Savings'],
        datasets: [
            {
                data: [5000, 1500, 800, 400, 300, 1000],
                backgroundColor: [
                    '#10b981',
                    '#ef4444',
                    '#f59e0b',
                    '#3b82f6',
                    '#8b5cf6',
                    '#06b6d4',
                ],
                borderColor: '#334155',
                borderWidth: 2,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    const marketMovers = [
        { symbol: 'AAPL', price: '$175.43', change: '+2.34%', changeType: 'positive' },
        { symbol: 'GOOGL', price: '$142.56', change: '+1.87%', changeType: 'positive' },
        { symbol: 'TSLA', price: '$248.91', change: '-1.23%', changeType: 'negative' },
        { symbol: 'MSFT', price: '$378.85', change: '+0.95%', changeType: 'positive' },
        { symbol: 'AMZN', price: '$156.78', change: '-0.67%', changeType: 'negative' },
    ];
    return (
        <div className="home-wrapper">
            <Navbar onPageChange={onPageChange} currentPage="home" />
            <div className="main-content">
                <div className="chart-section">
                    <div className="line-chart">
                        <h3>Annual Income</h3>
                        <div className="chart-container">
                            <Line data={incomeData} options={chartOptions} />
                        </div>
                    </div>
                    <div className="pie-chart">
                        <h3>Cash Flow</h3>
                        <div className="pie-container">
                            <Pie data={pieData} options={pieOptions} />
                        </div>
                        <div className="pie-legend">
                            {pieData.labels.map((label, index) => (
                                <div key={index} className="legend-item">
                                    <div 
                                        className="legend-color" 
                                        style={{ backgroundColor: pieData.datasets[0].backgroundColor[index] }}
                                    ></div>
                                    <span className="legend-text">
                                        {label}: ${pieData.datasets[0].data[index]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="sidebar">
                    <div className="market-movers">
                        <h3>Market Movers</h3>
                        <div className="movers-list">
                            {marketMovers.map((stock, index) => (
                                <div key={index} className="mover-item">
                                    <div className="stock-info">
                                        <span className="symbol">{stock.symbol}</span>
                                        <span className="price">{stock.price}</span>
                                    </div>
                                    <span className={`change ${stock.changeType}`}>
                                        {stock.change}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="insights-section">
                        <h3>Portfolio Insights</h3>
                        <div className="insight-item">
                            <span className="label">Total Assets:</span>
                            <span className="value">$125,000</span>
                        </div>
                        <div className="insight-item">
                            <span className="label">Stocks:</span>
                            <span className="value">45% ($56,250)</span>
                        </div>
                        <div className="insight-item">
                            <span className="label">Cash:</span>
                            <span className="value">25% ($31,250)</span>
                        </div>
                        <div className="insight-item">
                            <span className="label">Bonds:</span>
                            <span className="value">20% ($25,000)</span>
                        </div>
                        <div className="insight-item">
                            <span className="label">Gold:</span>
                            <span className="value">10% ($12,500)</span>
                        </div>
                        <div className="performance-summary">
                            <h4>Performance</h4>
                            <div className="insight-item">
                                <span className="label">Monthly Return:</span>
                                <span className="value positive">+3.2%</span>
                            </div>
                            <div className="insight-item">
                                <span className="label">YTD Return:</span>
                                <span className="value positive">+12.8%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    };
    export default Home;