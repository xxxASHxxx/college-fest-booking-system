import React, { useState, useEffect } from 'react';
import {
    Search,
    UserPlus,
    Edit2,
    Trash2,
    Shield,
    Mail,
    Phone,
    Calendar,
    MoreVertical,
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../hooks/useToast';
import adminService from '../../services/adminService';
import { formatDate } from '../../utils/formatters';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Loader from '../common/Loader';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);

    const { showSuccess, showError } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const result = await adminService.getAllUsers(0, 100);
            if (result.success) {
                setUsers(result.data.content || result.data);
            }
        } catch (error) {
            showError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            const result = await adminService.updateUserRole(userId, newRole);
            if (result.success) {
                showSuccess('User role updated successfully');
                fetchUsers();
                setShowRoleModal(false);
            } else {
                showError(result.error);
            }
        } catch (error) {
            showError('Failed to update role');
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone?.includes(searchQuery);

        const matchesRole = !roleFilter || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const userStats = {
        total: users.length,
        admins: users.filter((u) => u.role === 'ADMIN').length,
        regular: users.filter((u) => u.role === 'USER').length,
        active: users.filter((u) => u.status === 'active').length,
    };

    const roleConfig = {
        ADMIN: { color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-400/30' },
        USER: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-400/30' },
        ORGANIZER: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-400/30' },
    };

    if (loading) {
        return <Loader fullScreen size="lg" text="Loading users..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
                    <p className="text-white/70">Manage users, roles, and permissions</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/70 text-sm">Total Users</p>
                        <UserPlus className="text-purple-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">{userStats.total}</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/70 text-sm">Admins</p>
                        <Shield className="text-red-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">{userStats.admins}</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/70 text-sm">Regular Users</p>
                        <UserPlus className="text-blue-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">{userStats.regular}</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/70 text-sm">Active Users</p>
                        <Calendar className="text-green-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">{userStats.active}</p>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, email, or phone..."
                            icon={<Search size={20} />}
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">All Roles</option>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="ORGANIZER">Organizer</option>
                    </select>
                </div>
            </Card>

            {/* Users Table */}
            <Card className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">User</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Contact</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Role</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Joined</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Bookings</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Status</th>
                            <th className="text-right py-3 px-4 text-white/80 font-medium text-sm">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-white/60">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => {
                                const role = roleConfig[user.role] || roleConfig.USER;
                                return (
                                    <tr
                                        key={user.id}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{user.name}</p>
                                                    <p className="text-white/60 text-xs">ID: {user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="space-y-1">
                                                <p className="text-white/80 text-sm flex items-center gap-1">
                                                    <Mail size={14} className="text-purple-400" />
                                                    {user.email}
                                                </p>
                                                <p className="text-white/80 text-sm flex items-center gap-1">
                                                    <Phone size={14} className="text-purple-400" />
                                                    {user.phone || 'N/A'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${role.bg} ${role.border} ${role.color}`}
                        >
                          {user.role}
                        </span>
                                        </td>
                                        <td className="py-3 px-4 text-white/80 text-sm">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="py-3 px-4 text-white/80 text-sm">
                                            {user.totalBookings || 0}
                                        </td>
                                        <td className="py-3 px-4">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.status === 'active'
                                    ? 'bg-green-500/20 border border-green-400/30 text-green-400'
                                    : 'bg-gray-500/20 border border-gray-400/30 text-gray-400'
                            }`}
                        >
                          {user.status || 'active'}
                        </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowRoleModal(true);
                                                    }}
                                                    className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                                                    title="Change Role"
                                                >
                                                    <Shield size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Role Update Modal */}
            {selectedUser && (
                <RoleUpdateModal
                    isOpen={showRoleModal}
                    onClose={() => setShowRoleModal(false)}
                    user={selectedUser}
                    onUpdate={handleRoleUpdate}
                />
            )}
        </div>
    );
};

// Role Update Modal Component
const RoleUpdateModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [newRole, setNewRole] = useState(user.role);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await onUpdate(user.id, newRole);
        setIsSubmitting(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Update User Role" size="sm">
            <div className="space-y-4">
                <div className="p-4 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10">
                    <p className="text-white font-medium mb-1">{user.name}</p>
                    <p className="text-white/60 text-sm">{user.email}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">New Role</label>
                    <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="ORGANIZER">Organizer</option>
                    </select>
                </div>

                <div className="p-4 rounded-xl backdrop-blur-lg bg-orange-500/20 border border-orange-400/30">
                    <p className="text-sm text-orange-300">
                        <strong>Warning:</strong> Changing user roles will affect their permissions immediately.
                    </p>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button variant="outline" fullWidth onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handleSubmit}
                        loading={isSubmitting}
                        disabled={isSubmitting || newRole === user.role}
                    >
                        Update Role
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default UserManagement;
