import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Ticket,
    BarChart3,
    X,
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { path: '/admin/events', label: 'Event Management', icon: Calendar },
        { path: '/admin/bookings', label: 'Bookings', icon: Ticket },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ];

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path || location.pathname === '/admin/dashboard';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '260px',
                    background: 'rgba(6, 9, 35, 0.97)',
                    backdropFilter: 'blur(20px)',
                    borderRight: '1px solid rgba(255, 186, 8, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 50,
                    transition: 'transform 0.3s ease',
                    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                }}
                className="lg:!translate-x-0"
            >
                {/* Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,186,8,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: 'rgba(255,186,8,0.12)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <LayoutDashboard size={20} style={{ color: '#FAA307' }} />
                        </div>
                        <div>
                            <h2 style={{ color: '#FAA307', fontSize: '1.15rem', fontWeight: 800, margin: 0, letterSpacing: '0.5px' }}>FESTIFY</h2>
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', margin: 0, fontWeight: 500 }}>Admin Panel</p>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden"
                        style={{ padding: 8, color: 'rgba(255,255,255,0.5)', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 8 }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path, item.exact);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.7rem 1rem',
                                        borderRadius: '10px',
                                        fontSize: '0.85rem',
                                        fontWeight: active ? 600 : 500,
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        background: active ? 'rgba(255,186,8,0.12)' : 'transparent',
                                        color: active ? '#FAA307' : 'rgba(255,255,255,0.5)',
                                        borderLeft: active ? '3px solid #FAA307' : '3px solid transparent',
                                    }}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,186,8,0.08)' }}>
                    <Link
                        to="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.7rem 1rem',
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            background: 'rgba(255,186,8,0.08)',
                            color: '#FAA307',
                            border: '1px solid rgba(255,186,8,0.15)',
                            transition: 'all 0.2s',
                        }}
                    >
                        ← Back to Site
                    </Link>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
