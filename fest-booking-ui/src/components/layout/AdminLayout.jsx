import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh' }}>
            <AdminSidebar />
            <main className="admin-content" style={{ flex: 1, padding: '2rem', backgroundColor: '#f5f5f5' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
