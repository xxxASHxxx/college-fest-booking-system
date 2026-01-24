import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useForm } from '../../hooks/useForm';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import { FiEdit2, FiSave, FiX, FiCamera } from 'react-icons/fi';
import { validateForm } from '../../utils/validators';
import { trackPageView } from '../../utils/analytics';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const { showSuccess, showError } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);

    const validationRules = {
        name: { required: true, minLength: 2 },
        email: { required: true, email: true },
        phone: { required: true, phone: true },
    };

    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        setValues,
        isSubmitting,
    } = useForm(
        {
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            bio: user?.bio || '',
        },
        validationRules
    );

    React.useEffect(() => {
        trackPageView('Profile');
    }, []);

    const handleProfileUpdate = handleSubmit(async (formValues) => {
        const result = await updateProfile(formValues);

        if (result.success) {
            showSuccess('Profile updated successfully');
            setIsEditing(false);
        } else {
            showError(result.error || 'Failed to update profile');
        }
    });

    const handleCancel = () => {
        setValues({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            bio: user?.bio || '',
        });
        setIsEditing(false);
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            // Upload avatar logic here
            showSuccess('Avatar updated successfully');
        } catch (error) {
            showError('Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h1 className="page-title">My Profile</h1>
                    <p className="page-subtitle">Manage your account information</p>
                </div>

                <div className="profile-content">
                    {/* Avatar Section */}
                    <div className="profile-avatar-section">
                        <div className="avatar-wrapper">
                            <Avatar
                                src={user?.avatar}
                                alt={user?.name}
                                size="xl"
                                name={user?.name}
                            />
                            <label className="avatar-upload-btn">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={uploading}
                                    hidden
                                />
                                <FiCamera />
                            </label>
                        </div>
                        <div className="avatar-info">
                            <h2>{user?.name}</h2>
                            <p>{user?.email}</p>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div className="profile-form-section">
                        <div className="section-header">
                            <h3>Personal Information</h3>
                            {!isEditing ? (
                                <Button
                                    variant="outline"
                                    size="small"
                                    icon={<FiEdit2 />}
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="edit-actions">
                                    <Button
                                        variant="ghost"
                                        size="small"
                                        icon={<FiX />}
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="small"
                                        icon={<FiSave />}
                                        onClick={handleProfileUpdate}
                                        loading={isSubmitting}
                                    >
                                        Save
                                    </Button>
                                </div>
                            )}
                        </div>

                        <form className="profile-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`form-input ${errors.name ? 'error' : ''}`}
                                    />
                                    {errors.name && (
                                        <span className="error-message">{errors.name}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`form-input ${errors.email ? 'error' : ''}`}
                                    />
                                    {errors.email && (
                                        <span className="error-message">{errors.email}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={values.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`form-input ${errors.phone ? 'error' : ''}`}
                                    />
                                    {errors.phone && (
                                        <span className="error-message">{errors.phone}</span>
                                    )}
                                </div>

                                <div className="form-group full-width">
                                    <label className="form-label">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={values.bio}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="form-textarea"
                                        rows="4"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Account Stats */}
                    <div className="profile-stats-section">
                        <h3>Account Statistics</h3>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">🎫</div>
                                <div className="stat-value">{user?.stats?.totalBookings || 0}</div>
                                <div className="stat-label">Total Bookings</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🎉</div>
                                <div className="stat-value">{user?.stats?.eventsAttended || 0}</div>
                                <div className="stat-label">Events Attended</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">💰</div>
                                <div className="stat-value">₹{user?.stats?.totalSpent || 0}</div>
                                <div className="stat-label">Total Spent</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⭐</div>
                                <div className="stat-value">{user?.stats?.favoriteEvents || 0}</div>
                                <div className="stat-label">Favorite Events</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile
