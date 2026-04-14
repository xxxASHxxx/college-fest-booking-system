import React from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { FiShield, FiUser } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';
import './UserTable.css';

const UserTable = ({ users, onUpdateRole, onToggleStatus }) => {
    if (!users || users.length === 0) {
        return (
            <div className="table-empty">
                <p>No users found. Backend may be offline — users will appear when connected.</p>
            </div>
        );
    }

    // UserRole is an enum: USER, ADMIN
    const getRoleVariant = (role) => {
        const r = (role || '').toString().toUpperCase();
        return r === 'ADMIN' ? 'danger' : 'default';
    };

    // User entity has isVerified (Boolean), no status field
    const getVerifiedVariant = (isVerified) => {
        return isVerified === true ? 'success' : 'warning';
    };

    const getVerifiedLabel = (isVerified) => {
        return isVerified === true ? 'Verified' : 'Unverified';
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
                        {users.map((user) => {
                            // Backend returns fullName (not name), phoneNumber (not phone)
                            const displayName = user.fullName || user.name || user.email || '—';
                            const phone = user.phoneNumber || user.phone || 'N/A';
                            // id is Long (number) — do not call .slice()
                            const shortId = user.id != null ? String(user.id).padStart(4, '0') : '—';

                            return (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <Avatar
                                                src={user.avatar}
                                                alt={displayName}
                                                size="md"
                                                name={displayName}
                                            />
                                            <div className="user-info">
                                                <span className="user-name">{displayName}</span>
                                                <span className="user-id">ID: {shortId}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="user-email">{user.email || '—'}</span>
                                    </td>
                                    <td>
                                        <span className="user-phone">{phone}</span>
                                    </td>
                                    <td>
                                        <Badge variant={getRoleVariant(user.role)}>
                                            {user.role === 'ADMIN' ? <FiShield /> : <FiUser />}
                                            {user.role || 'USER'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge variant={getVerifiedVariant(user.isVerified)}>
                                            {getVerifiedLabel(user.isVerified)}
                                        </Badge>
                                    </td>
                                    <td>
                                        <span className="user-joined">{formatDate(user.createdAt)}</span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <select
                                                className="role-select"
                                                value={user.role || 'USER'}
                                                onChange={(e) => onUpdateRole && onUpdateRole(user.id, e.target.value)}
                                            >
                                                <option value="USER">User</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                            <button
                                                className={`status-toggle ${user.isVerified ? 'active' : 'inactive'}`}
                                                onClick={() => onToggleStatus && onToggleStatus(user.id, user.isVerified ? 'active' : 'inactive')}
                                                title={user.isVerified ? 'Mark Unverified' : 'Mark Verified'}
                                            >
                                                {user.isVerified ? 'Verified' : 'Unverified'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
