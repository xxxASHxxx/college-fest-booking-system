import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Ticket,
    BarChart3,
    FileText,
    Settings,
    Bell,
    Tag,
    Menu,
    X,
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const navItems = [
        {
            path: '/admin',
            label: 'Dashboard',
            icon: LayoutDashboard,
            exact: true,
        },
        {
            path: '/admin/events',
            label: 'Event Management',
            icon: Calendar,
        },
        {
            path: '/admin/bookings',
            label: 'Bookings',
            icon: Ticket,
        },
        {
            path: '/admin/users',
            label: 'Users',
            icon: Users,
        },
        {
            path: '/admin/analytics',
            label: 'Analytics',
            icon: BarChart3,
        },
        {
            path: '/admin/reports',
            label: 'Reports',
            icon: FileText,
        },
        {
            path: '/admin/promotions',
            label: 'Promotions',
            icon: Tag,
        },
        {
            path: '/admin/notifications',
            label: 'Notifications',
            icon: Bell,
        },
        {
            path: '/admin/settings',
            label: 'Settings',
            icon: Settings,
        },
    ];

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-72 backdrop-blur-xl bg-white/10 border-r border-white/20
          transform transition-transform duration-300 z-50 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <Link to="/admin" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <LayoutDashboard className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg">Admin Panel</h2>
                            <p className="text-white/60 text-xs">FestBook</p>
                        </div>
                    </Link>

                    {/* Close button (mobile) */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto custom-scrollbar p-4">
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path, item.exact);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => {
                                        if (window.innerWidth < 1024) {
                                            onClose();
                                        }
                                    }}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-300
                    ${
                                        active
                                            ? 'backdrop-blur-lg bg-purple-500/80 text-white shadow-lg'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }
                  `}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/10">
                    <div className="p-4 rounded-xl backdrop-blur-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20">
                        <p className="text-white font-medium text-sm mb-1">Need Help?</p>
                        <p className="text-white/70 text-xs mb-3">
                            Check our admin documentation
                        </p>
                        <button className="w-full px-4 py-2 rounded-lg backdrop-blur-lg bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-all">
                            View Docs
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
