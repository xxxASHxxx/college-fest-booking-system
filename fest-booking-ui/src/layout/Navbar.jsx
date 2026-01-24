import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useCart } from '../../hooks/useCart';
import { useNotifications } from '../../hooks/useNotifications';
import { FiMenu, FiX, FiShoppingCart, FiBell, FiUser, FiLogOut, FiSettings, FiSun, FiMoon } from 'react-icons/fi';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Dropdown from '../common/Dropdown';
import './Navbar.css';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { itemCount } = useCart();
    const { unreadCount } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const userMenuItems = [
        { label: 'My Profile', icon: <FiUser />, onClick: () => navigate('/profile') },
        { label: 'My Bookings', icon: <FiShoppingCart />, onClick: () => navigate('/my-bookings') },
        { label: 'My Tickets', icon: <FiBell />, onClick: () => navigate('/my-tickets') },
        { label: 'Settings', icon: <FiSettings />, onClick: () => navigate('/settings') },
        { type: 'divider' },
        { label: 'Logout', icon: <FiLogOut />, onClick: handleLogout, danger: true },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🎫</span>
                    <span className="logo-text">FestBook</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-links">
                    <Link
                        to="/"
                        className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/events"
                        className={`navbar-link ${isActive('/events') ? 'active' : ''}`}
                    >
                        Events
                    </Link>
                    {isAuthenticated && user?.role === 'ADMIN' && (
                        <Link
                            to="/admin"
                            className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}
                        >
                            Admin
                        </Link>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="navbar-actions">
                    {/* Theme Toggle */}
                    <button
                        className="navbar-icon-btn"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                    </button>

                    {isAuthenticated ? (
                        <>
                            {/* Notifications */}
                            <button
                                className="navbar-icon-btn"
                                onClick={() => navigate('/notifications')}
                                aria-label="Notifications"
                            >
                                <FiBell size={20} />
                                {unreadCount > 0 && (
                                    <Badge variant="danger" className="navbar-badge">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </Badge>
                                )}
                            </button>

                            {/* Cart */}
                            <button
                                className="navbar-icon-btn"
                                onClick={() => navigate('/cart')}
                                aria-label="Cart"
                            >
                                <FiShoppingCart size={20} />
                                {itemCount > 0 && (
                                    <Badge variant="primary" className="navbar-badge">
                                        {itemCount}
                                    </Badge>
                                )}
                            </button>

                            {/* User Menu */}
                            <Dropdown
                                trigger={
                                    <button className="navbar-user-btn">
                                        <div className="user-avatar">
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt={user.name} />
                                            ) : (
                                                <span>{user?.name?.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <span className="user-name">{user?.name}</span>
                                    </button>
                                }
                                items={userMenuItems}
                                align="right"
                            />
                        </>
                    ) : (
                        <div className="navbar-auth-buttons">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/register')}
                            >
                                Sign Up
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="navbar-mobile-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="navbar-mobile-menu">
                    <Link
                        to="/"
                        className={`mobile-menu-link ${isActive('/') ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/events"
                        className={`mobile-menu-link ${isActive('/events') ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Events
                    </Link>
                    {isAuthenticated && user?.role === 'ADMIN' && (
                        <Link
                            to="/admin"
                            className={`mobile-menu-link ${isActive('/admin') ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Admin
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <>
                            <div className="mobile-menu-divider" />
                            <Link
                                to="/profile"
                                className="mobile-menu-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                My Profile
                            </Link>
                            <Link
                                to="/my-bookings"
                                className="mobile-menu-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                My Bookings
                            </Link>
                            <Link
                                to="/my-tickets"
                                className="mobile-menu-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                My Tickets
                            </Link>
                            <Link
                                to="/settings"
                                className="mobile-menu-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Settings
                            </Link>
                            <div className="mobile-menu-divider" />
                            <button
                                className="mobile-menu-link danger"
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="mobile-menu-divider" />
                            <Link
                                to="/login"
                                className="mobile-menu-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="mobile-menu-link primary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;

