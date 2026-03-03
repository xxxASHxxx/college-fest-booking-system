import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import adminService from '../../services/adminService';
import StatCard from '../../components/admin/StatCard';
import RecentBookings from '../../components/admin/RecentBookings';
import RevenueChart from '../../components/admin/RevenueChart';
import EventsOverview from '../../components/admin/EventsOverview';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { trackPageView } from '../../utils/analytics';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showError } = useToast();

    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        trackPageView('Admin Dashboard');

        if (user?.role !== 'ADMIN') {
            console.log('[AdminDashboard] User is not admin, redirecting to home');
            navigate('/');
            return;
        }

        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('[AdminDashboard] Fetching dashboard data...');

            const [statsRes, bookingsRes, revenueRes] = await Promise.all([
                adminService.getDashboardStats(),
                adminService.getRecentBookings({ limit: 10 }),
                adminService.getRevenueData({ period: '30days' }),
            ]);

            console.log('[AdminDashboard] Stats response:', statsRes);
            console.log('[AdminDashboard] Bookings response:', bookingsRes);
            console.log('[AdminDashboard] Revenue response:', revenueRes);

            if (statsRes.success) {
                setStats(statsRes.data);
            } else {
                console.error('[AdminDashboard] Failed to fetch stats:', statsRes.error);
                // Set fallback stats
                setStats({
                    totalRevenue: 0,
                    totalBookings: 0,
                    activeEvents: 0,
                    totalUsers: 0,
                });
            }

            if (bookingsRes.success) {
                setRecentBookings(bookingsRes.data || []);
            } else {
                console.error('[AdminDashboard] Failed to fetch bookings:', bookingsRes.error);
                setRecentBookings([]);
            }

            if (revenueRes.success) {
                setRevenueData(revenueRes.data || []);
            } else {
                console.error('[AdminDashboard] Failed to fetch revenue:', revenueRes.error);
                setRevenueData([]);
            }

        } catch (error) {
            console.error('[AdminDashboard] Error fetching dashboard data:', error);
            setError('Failed to load dashboard data. Please try again.');
            showError('Failed to load dashboard data');

            // Set fallback data
            setStats({
                totalRevenue: 0,
                totalBookings: 0,
                activeEvents: 0,
                totalUsers: 0,
            });
            setRecentBookings([]);
            setRevenueData([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-container">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Dashboard</h1>
                        <p className="dashboard-subtitle">
                            Welcome back, {user?.fullName || user?.name}! Here's what's happening today.
                        </p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '0.5rem',
                        color: '#ef4444',
                    }}>
                        {error}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="stats-grid">
                    <StatCard
                        title="Total Revenue"
                        value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
                        change={stats?.revenueChange}
                        icon={<FiDollarSign />}
                        color="primary"
                    />
                    <StatCard
                        title="Total Bookings"
                        value={stats?.totalBookings || 0}
                        change={stats?.bookingsChange}
                        icon={<FiCalendar />}
                        color="success"
                    />
                    <StatCard
                        title="Active Events"
                        value={stats?.activeEvents || stats?.totalEvents || 0}
                        change={stats?.eventsChange}
                        icon={<FiTrendingUp />}
                        color="warning"
                    />
                    <StatCard
                        title="Total Users"
                        value={stats?.totalUsers || 0}
                        change={stats?.usersChange}
                        icon={<FiUsers />}
                        color="info"
                    />
                </div>

                {/* Charts Section */}
                <div className="dashboard-grid">
                    <div className="dashboard-card large">
                        <div className="card-header">
                            <h2 className="card-title">Revenue Overview</h2>
                            <select className="period-select">
                                <option value="7days">Last 7 Days</option>
                                <option value="30days">Last 30 Days</option>
                                <option value="90days">Last 90 Days</option>
                                <option value="1year">Last Year</option>
                            </select>
                        </div>
                        <RevenueChart data={revenueData} />
                    </div>

                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2 className="card-title">Events Overview</h2>
                        </div>
                        <EventsOverview stats={stats?.eventsOverview} />
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Recent Bookings</h2>
                        <button
                            className="view-all-btn"
                            onClick={() => navigate('/admin/bookings')}
                        >
                            View All
                        </button>
                    </div>
                    <RecentBookings bookings={recentBookings} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
