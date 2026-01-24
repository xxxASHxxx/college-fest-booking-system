import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Button from '../common/Button';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/10 border-b border-white/20">
                    <div className="flex items-center justify-between px-6 py-4">
                        {/* Left - Menu & Search */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all"
                            >
                                <Menu size={24} />
                            </button>
                            <h2 className="text-xl font-bold text-white hidden md:block">
                                Admin Dashboard
                            </h2>
                        </div>

                        {/* Right - Notifications & Profile */}
                        <div className="flex items-center gap-3">
                            <button className="relative p-2 rounded-lg text-white hover:bg-white/10 transition-all">
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </button>

                            <div className="flex items-center gap-3 px-3 py-2 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-white font-medium text-sm">{user?.name}</p>
                                    <p className="text-white/60 text-xs">{user?.role}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg text-white hover:bg-red-500/20 hover:text-red-400 transition-all"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
