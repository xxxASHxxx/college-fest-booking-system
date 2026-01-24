import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import adminService from '../../services/adminService';
import SearchBar from '../../components/common/SearchBar';
import UserTable from '../../components/admin/UserTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import { FiFilter } from 'react-icons/fi';
import { trackPageView } from '../../utils/analytics';
import './ManageUsersPage.css';

const ManageUsersPage = () => {
    const { showSuccess, showError } = useToast();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        trackPageView('Admin - Manage Users');
        fetchUsers();
    }, [currentPage, roleFilter, statusFilter, searchQuery]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const result = await adminService.getUsers({
                page: currentPage,
                size: 20,
                search: searchQuery,
                role: roleFilter !== 'all' ? roleFilter : undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            });

            if (result.success) {
                setUsers(result.data.content || result.data);
                setTotalPages(result.data.totalPages || 1);
            }
        } catch (error) {
            showError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            const result = await adminService.updateUserRole(userId, newRole);
            if (result.success) {
                showSuccess('User role updated');
                fetchUsers();
            } else {
                showError(result.error || 'Failed to update role');
            }
        } catch (error) {
            showError('Failed to update role');
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

        try {
            const result = await adminService.updateUserStatus(userId, newStatus);
            if (result.success) {
                showSuccess(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
                fetchUsers();
            } else {
                showError(result.error || 'Failed to update status');
            }
        } catch (error) {
            showError('Failed to update status');
        }
    };

    return (
        <div className="manage-users-page">
            <div className="admin-container">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Manage Users</h1>
                        <p className="page-subtitle">View and manage all users</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-bar">
                    <SearchBar
                        placeholder="Search users..."
                        value={searchQuery}
                        onSearch={setSearchQuery}
                    />

                    <div className="filter-group">
                        <FiFilter />
                        <select
                            className="filter-select"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="loading-container">
                        <LoadingSpinner size="large" />
                    </div>
                ) : (
                    <>
                        <UserTable
                            users={users}
                            onUpdateRole={handleUpdateRole}
                            onToggleStatus={handleToggleStatus}
                        />

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ManageUsersPage;
