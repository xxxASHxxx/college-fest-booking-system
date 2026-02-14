import React from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, DollarSign, Calendar, Users } from 'lucide-react';
import './AdminAnalyticsPage.css';

// Mock data for demo
const trendData = [
    { date: 'Jan 15', bookings: 12, revenue: 15600 },
    { date: 'Jan 22', bookings: 19, revenue: 24700 },
    { date: 'Jan 29', bookings: 25, revenue: 32500 },
    { date: 'Feb 5', bookings: 31, revenue: 40300 },
    { date: 'Feb 12', bookings: 28, revenue: 36400 },
    { date: 'Feb 19', bookings: 35, revenue: 45500 },
    { date: 'Feb 26', bookings: 42, revenue: 54600 },
];

const categoryData = [
    { name: 'Tech', value: 35, revenue: 87500 },
    { name: 'Cultural', value: 28, revenue: 70000 },
    { name: 'Sports', value: 22, revenue: 55000 },
    { name: 'Workshops', value: 15, revenue: 37500 },
];

const popularEvents = [
    { name: 'Starlight Music Fest', tickets: 450, revenue: 224500, capacity: 500, utilization: 90 },
    { name: 'Tech Innovation Summit', tickets: 780, revenue: 234000, capacity: 1000, utilization: 78 },
    { name: 'HackFest 2026', tickets: 195, revenue: 0, capacity: 200, utilization: 97.5 },
    { name: 'Cultural Night', tickets: 420, revenue: 104580, capacity: 500, utilization: 84 },
    { name: 'Sports Championship', tickets: 245, revenue: 48755, capacity: 300, utilization: 81.67 },
];

const COLORS = ['#ff4444', '#ff8844', '#ffaa44', '#44ff88'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'rgba(10, 10, 10, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '12px',
            }}>
                <p style={{ color: '#fff', margin: 0, fontWeight: 600 }}>{payload[0].payload.date || payload[0].name}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color, margin: '4px 0', fontSize: '0.9rem' }}>
                        {entry.name}: {entry.name.includes('evenue') ? `₹${entry.value.toLocaleString()}` : entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function AdminAnalyticsPage() {
    return (
        <div className="analytics-dashboard">
            {/* Header */}
            <div className="analytics-header">
                <h1>📊 Analytics Dashboard</h1>
                <p>Real-time insights into your event performance</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon red">
                        <Calendar />
                    </div>
                    <div className="stat-label">Total Bookings</div>
                    <div className="stat-value">2,087</div>
                    <div className="stat-change positive">
                        <TrendingUp size={16} /> +12.5% this week
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon orange">
                        <DollarSign />
                    </div>
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-value">₹5,22,835</div>
                    <div className="stat-change positive">
                        <TrendingUp size={16} /> +18.2% this month
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">
                        <Calendar />
                    </div>
                    <div className="stat-label">Active Events</div>
                    <div className="stat-value">18</div>
                    <div className="stat-change positive">
                        <TrendingUp size={16} /> 3 new this week
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon blue">
                        <Users />
                    </div>
                    <div className="stat-label">Registered Users</div>
                    <div className="stat-value">1,234</div>
                    <div className="stat-change positive">
                        <TrendingUp size={16} /> +8.7% growth
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                {/* Booking Trends */}
                <div className="chart-card">
                    <h3>📈 Booking Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff4444" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ff4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="bookings" stroke="#ff4444" fillOpacity={1} fill="url(#colorBookings)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue by Category */}
                <div className="chart-card">
                    <h3>🎯 Revenue by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Popular Events Table */}
            <div className="chart-card full-width">
                <h3>🔥 Most Popular Events</h3>
                <table className="analytics-table">
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Tickets Sold</th>
                            <th>Revenue</th>
                            <th>Capacity</th>
                            <th>Utilization</th>
                        </tr>
                    </thead>
                    <tbody>
                        {popularEvents.map((event, index) => (
                            <tr key={index}>
                                <td className="event-name">{event.name}</td>
                                <td>{event.tickets}</td>
                                <td>{event.revenue > 0 ? `₹${event.revenue.toLocaleString()}` : 'Free'}</td>
                                <td>{event.capacity}</td>
                                <td>
                                    <div style={{ minWidth: '120px' }}>
                                        {event.utilization.toFixed(1)}%
                                        <div className="utilization-bar">
                                            <div
                                                className={`utilization-fill ${event.utilization > 85 ? 'high' : event.utilization > 60 ? 'medium' : 'low'}`}
                                                style={{ width: `${event.utilization}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
