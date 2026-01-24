import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiCalendar,
    FiUsers,
    FiBarChart2,
    FiFileText,
    FiSettings,
    FiShoppingBag,
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin', icon: <FiHome />, label: 'Dashboard' },
        { path: '/admin/events', icon: <FiCalendar />, label: 'Events' },
        { path: '/admin/bookings', icon: <FiShoppingBag />, label: 'Bookings' },
        { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
        { path: '/admin/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
        { path: '/admin/reports', icon: <FiFileText />, label: 'Reports' },
        { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div className="sidebar-backdrop" onClick={onClose} />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span className="sidebar-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
