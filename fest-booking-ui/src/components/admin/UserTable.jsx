import React from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { FiEdit2, FiShield, FiUser } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';
import './UserTable.css';

const UserTable = ({ users, onUpdateRole, onToggleStatus }) => {
    if (!users || users.length === 0) {
        return (
            <div className="table-empty">
                <p>No users found</p>
            </div>
        );
    }

    const getRoleVariant = (role) => {
        return role === 'ADMIN' ? 'danger' : 'default';
    };

    const getStatusVariant = (status) => {
        return status === 'active' ? 'success' : 'default';
    };

    return (
        <div className="user-table-wrapper">
            <div className="user-table">
                <table>
                    <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <div className="user-cell">
                                    <Avatar
                                        src={user.avatar}
                                        alt={user.name}
                                        size="md"
                                        name={user.name}
                                    />
                                    <div className="user-info">
                                        <span className="user-name">{user.name}</span>
                                        <span className="user-id">ID: {user.id.slice(0, 8)}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className="user-email">{user.email}</span>
                            </td>
                            <td>
                                <span className="user-phone">{user.phone || 'N/A'}</span>
                            </td>
                            <td>
                                <Badge variant={getRoleVariant(user.role)}>
                                    {user.role === 'ADMIN' ? <FiShield /> : <FiUser />}
                                    {user.role}
                                </Badge>
                            </td>
                            <td>
                                <Badge variant={getStatusVariant(user.status)}>
                                    {user.status}
                                </Badge>
                            </td>
                            <td>
                                <span className="user-joined">{formatDate(user.createdAt)}</span>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <select
                                        className="role-select"
                                        value={user.role}
                                        onChange={(e) => onUpdateRole(user.id, e.target.value)}
                                    >
                                        <option value="USER">User</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                    <button
                                        className={`status-toggle ${user.status === 'active' ? 'active' : 'inactive'}`}
                                        onClick={() => onToggleStatus(user.id, user.status)}
                                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                                    >
                                        {user.status === 'active' ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
