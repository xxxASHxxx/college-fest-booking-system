import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <main className="admin-content" style={{ flex: 1, padding: '2rem', marginLeft: '0', transition: 'margin-left 0.3s' }}>
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden fixed top-4 left-4 z-30 p-3 rounded-xl backdrop-blur-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-all shadow-lg"
                    style={{ display: isSidebarOpen ? 'none' : 'flex' }}
                >
                    <Menu size={24} />
                </button>

                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
