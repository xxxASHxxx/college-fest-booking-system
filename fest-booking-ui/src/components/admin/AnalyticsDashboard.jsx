import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Users,
    Calendar,
    DollarSign,
    Ticket,
    BarChart3,
    PieChart,
    Activity,
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../hooks/useToast';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import Card from '../common/Card';
import Loader from '../common/Loader';

const AnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [dateRange, setDateRange] = useState('30'); // days
    const [loading, setLoading] = useState(true);

    const { showError } = useToast();

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const result = await adminService.getAnalytics({ days: parseInt(dateRange) });
            if (result.success) {
                setAnalytics(result.data);
            }
        } catch (error) {
            showError('Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader fullScreen size="lg" text="Loading analytics..." />;
    }

    if (!analytics) {
        return <div className="text-white">No data available</div>;
    }

    const stats = {
        totalRevenue: analytics.totalRevenue || 0,
        revenueGrowth: analytics.revenueGrowth || 0,
        totalBookings: analytics.totalBookings || 0,
        bookingsGrowth: analytics.bookingsGrowth || 0,
        totalUsers: analytics.totalUsers || 0,
        usersGrowth: analytics.usersGrowth || 0,
        totalEvents: analytics.totalEvents || 0,
        eventsGrowth: analytics.eventsGrowth || 0,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
                    <p className="text-white/70">Track performance and key metrics</p>
                </div>
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2.5 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center border border-green-400/30">
                            <DollarSign className="text-green-400" size={24} />
                        </div>
                        <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                                stats.revenueGrowth >= 0
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                            }`}
                        >
                            {stats.revenueGrowth >= 0 ? (
                                <TrendingUp size={16} />
                            ) : (
                                <TrendingDown size={16} />
                            )}
                            <span className="text-xs font-bold">
                {Math.abs(stats.revenueGrowth).toFixed(1)}%
              </span>
                        </div>
                    </div>
                    <p className="text-white/60 text-sm mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                    <p className="text-white/50 text-xs mt-2">vs last period</p>
                </Card>

                {/* Total Bookings */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center border border-blue-400/30">
                            <Ticket className="text-blue-400" size={24} />
                        </div>
                        <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                                stats.bookingsGrowth >= 0
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                            }`}
                        >
                            {stats.bookingsGrowth >= 0 ? (
                                <TrendingUp size={16} />
                            ) : (
                                <TrendingDown size={16} />
                            )}
                            <span className="text-xs font-bold">
                {Math.abs(stats.bookingsGrowth).toFixed(1)}%
              </span>
                        </div>
                    </div>
                    <p className="text-white/60 text-sm mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold text-white">{stats.totalBookings.toLocaleString()}</p>
                    <p className="text-white/50 text-xs mt-2">vs last period</p>
                </Card>

                {/* Total Users */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center border border-purple-400/30">
                            <Users className="text-purple-400" size={24} />
                        </div>
                        <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                                stats.usersGrowth >= 0
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                            }`}
                        >
                            {stats.usersGrowth >= 0 ? (
                                <TrendingUp size={16} />
                            ) : (
                                <TrendingDown size={16} />
                            )}
                            <span className="text-xs font-bold">
                {Math.abs(stats.usersGrowth).toFixed(1)}%
              </span>
                        </div>
                    </div>
                    <p className="text-white/60 text-sm mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-white/50 text-xs mt-2">vs last period</p>
                </Card>

                {/* Total Events */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center border border-orange-400/30">
                            <Calendar className="text-orange-400" size={24} />
                        </div>
                        <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                                stats.eventsGrowth >= 0
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                            }`}
                        >
                            {stats.eventsGrowth >= 0 ? (
                                <TrendingUp size={16} />
                            ) : (
                                <TrendingDown size={16} />
                            )}
                            <span className="text-xs font-bold">
                {Math.abs(stats.eventsGrowth).toFixed(1)}%
              </span>
                        </div>
                    </div>
                    <p className="text-white/60 text-sm mb-1">Total Events</p>
                    <p className="text-3xl font-bold text-white">{stats.totalEvents}</p>
                    <p className="text-white/50 text-xs mt-2">vs last period</p>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <BarChart3 size={24} className="text-purple-400" />
                            Revenue Overview
                        </h3>
                    </div>
                    <div className="h-64 flex items-center justify-center">
                        <RevenueChart data={analytics.revenueData || []} />
                    </div>
                </Card>

                {/* Bookings Chart */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity size={24} className="text-blue-400" />
                            Bookings Trend
                        </h3>
                    </div>
                    <div className="h-64 flex items-center justify-center">
                        <BookingsChart data={analytics.bookingsData || []} />
                    </div>
                </Card>
            </div>

            {/* Category Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Events */}
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Calendar size={24} className="text-purple-400" />
                        Top Performing Events
                    </h3>
                    <div className="space-y-3">
                        {(analytics.topEvents || []).slice(0, 5).map((event, index) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between p-3 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm line-clamp-1">
                                            {event.name}
                                        </p>
                                        <p className="text-white/60 text-xs">
                                            {event.bookings} bookings
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold">{formatCurrency(event.revenue)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Category Distribution */}
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <PieChart size={24} className="text-blue-400" />
                        Category Distribution
                    </h3>
                    <div className="space-y-3">
                        {(analytics.categoryDistribution || []).map((category) => (
                            <div key={category.name} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/80 capitalize">{category.name}</span>
                                    <span className="text-white font-medium">{category.percentage}%</span>
                                </div>
                                <div className="h-2 rounded-full backdrop-blur-lg bg-white/10 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                                        style={{ width: `${category.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Activity size={24} className="text-green-400" />
                    Recent Activity
                </h3>
                <div className="space-y-3">
                    {(analytics.recentActivity || []).slice(0, 10).map((activity, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10"
                        >
                            <div
                                className={`w-2 h-2 rounded-full mt-2 ${
                                    activity.type === 'booking'
                                        ? 'bg-green-400'
                                        : activity.type === 'cancellation'
                                            ? 'bg-red-400'
                                            : 'bg-blue-400'
                                }`}
                            />
                            <div className="flex-1">
                                <p className="text-white text-sm">{activity.message}</p>
                                <p className="text-white/60 text-xs mt-1">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                    <p className="text-white/60 text-sm mb-2">Average Booking Value</p>
                    <p className="text-2xl font-bold text-white">
                        {formatCurrency(analytics.avgBookingValue || 0)}
                    </p>
                    <p className="text-white/50 text-xs mt-2">
                        Per transaction
                    </p>
                </Card>

                <Card className="p-6">
                    <p className="text-white/60 text-sm mb-2">Conversion Rate</p>
                    <p className="text-2xl font-bold text-white">
                        {(analytics.conversionRate || 0).toFixed(1)}%
                    </p>
                    <p className="text-white/50 text-xs mt-2">
                        Visitors to bookings
                    </p>
                </Card>

                <Card className="p-6">
                    <p className="text-white/60 text-sm mb-2">Active Users Today</p>
                    <p className="text-2xl font-bold text-white">
                        {analytics.activeUsersToday || 0}
                    </p>
                    <p className="text-white/50 text-xs mt-2">
                        Currently browsing
                    </p>
                </Card>
            </div>
        </div>
    );
};

// Simple Revenue Chart Component (Replace with actual chart library like Chart.js or Recharts)
const RevenueChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-white/60">No revenue data available</p>;
    }

    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <div className="w-full h-full flex items-end justify-between gap-2">
            {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                        className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
                        style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '20px' }}
                    >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                            {formatCurrency(item.value)}
                        </div>
                    </div>
                    <span className="text-white/60 text-xs">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

// Simple Bookings Chart Component
const BookingsChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-white/60">No bookings data available</p>;
    }

    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <div className="w-full h-full flex items-end justify-between gap-2">
            {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                        className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
                        style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '20px' }}
                    >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                            {item.value} bookings
                        </div>
                    </div>
                    <span className="text-white/60 text-xs">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

export default AnalyticsDashboard;
