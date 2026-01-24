import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useForm } from '../../hooks/useForm';
import Button from '../../components/common/Button';
import Toggle from '../../components/common/Toggle';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { trackPageView } from '../../utils/analytics';
import './SettingsPage.css';

const SettingsPage = () => {
    const { user, updateSettings, changePassword } = useAuth();
    const { showSuccess, showError } = useToast();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [settings, setSettings] = useState({
        emailNotifications: user?.settings?.emailNotifications ?? true,
        smsNotifications: user?.settings?.smsNotifications ?? false,
        marketingEmails: user?.settings?.marketingEmails ?? true,
        eventReminders: user?.settings?.eventReminders ?? true,
    });

    React.useEffect(() => {
        trackPageView('Settings');
    }, []);

    const passwordValidationRules = {
        currentPassword: { required: true, minLength: 6 },
        newPassword: { required: true, password: true },
        confirmPassword: { required: true, match: 'newPassword' },
    };

    const {
        values: passwordValues,
        errors: passwordErrors,
        handleChange: handlePasswordChange,
        handleSubmit: handlePasswordSubmit,
        reset: resetPasswordForm,
        isSubmitting: isChangingPassword,
    } = useForm(
        {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        passwordValidationRules
    );

    const handleSettingChange = (key, value) => {
        setSettings({ ...settings, [key]: value });
    };

    const handleSaveSettings = async () => {
        const result = await updateSettings(settings);

        if (result.success) {
            showSuccess('Settings updated successfully');
        } else {
            showError(result.error || 'Failed to update settings');
        }
    };

    const handlePasswordChangeSubmit = handlePasswordSubmit(async (values) => {
        const result = await changePassword({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
        });

        if (result.success) {
            showSuccess('Password changed successfully');
            resetPasswordForm();
        } else {
            showError(result.error || 'Failed to change password');
        }
    });

    return (
        <div className="settings-page">
            <div className="settings-container">
                <div className="settings-header">
                    <h1 className="page-title">Settings</h1>
                    <p className="page-subtitle">Manage your account preferences</p>
                </div>

                {/* Notifications Settings */}
                <div className="settings-section">
                    <div className="section-header">
                        <h2 className="section-title">Notifications</h2>
                        <p className="section-description">
                            Choose how you want to receive notifications
                        </p>
                    </div>

                    <div className="settings-list">
                        <div className="setting-item">
                            <div className="setting-info">
                                <h3 className="setting-title">Email Notifications</h3>
                                <p className="setting-description">
                                    Receive booking confirmations and updates via email
                                </p>
                            </div>
                            <Toggle
                                checked={settings.emailNotifications}
                                onChange={(checked) => handleSettingChange('emailNotifications', checked)}
                            />
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h3 className="setting-title">SMS Notifications</h3>
                                <p className="setting-description">
                                    Receive important updates via SMS
                                </p>
                            </div>
                            <Toggle
                                checked={settings.smsNotifications}
                                onChange={(checked) => handleSettingChange('smsNotifications', checked)}
                            />
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h3 className="setting-title">Event Reminders</h3>
                                <p className="setting-description">
                                    Get reminded about upcoming events
                                </p>
                            </div>
                            <Toggle
                                checked={settings.eventReminders}
                                onChange={(checked) => handleSettingChange('eventReminders', checked)}
                            />
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h3 className="setting-title">Marketing Emails</h3>
                                <p className="setting-description">
                                    Receive news about new events and offers
                                </p>
                            </div>
                            <Toggle
                                checked={settings.marketingEmails}
                                onChange={(checked) => handleSettingChange('marketingEmails', checked)}
                            />
                        </div>
                    </div>

                    <div className="section-actions">
                        <Button onClick={handleSaveSettings}>
                            Save Notification Settings
                        </Button>
                    </div>
                </div>

                {/* Password Change */}
                <div className="settings-section">
                    <div className="section-header">
                        <h2 className="section-title">Change Password</h2>
                        <p className="section-description">
                            Update your password to keep your account secure
                        </p>
                    </div>

                    <form className="password-form" onSubmit={handlePasswordChangeSubmit}>
                        <div className="form-group">
                            <label className="form-label">Current Password</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    name="currentPassword"
                                    value={passwordValues.currentPassword}
                                    onChange={handlePasswordChange}
                                    className={`form-input ${passwordErrors.currentPassword ? 'error' : ''}`}
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    className="input-action"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {passwordErrors.currentPassword && (
                                <span className="error-message">{passwordErrors.currentPassword}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    value={passwordValues.newPassword}
                                    onChange={handlePasswordChange}
                                    className={`form-input ${passwordErrors.newPassword ? 'error' : ''}`}
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    className="input-action"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {passwordErrors.newPassword && (
                                <span className="error-message">{passwordErrors.newPassword}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordValues.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className={`form-input ${passwordErrors.confirmPassword ? 'error' : ''}`}
                                    placeholder="Confirm new password"
                                />
                            </div>
                            {passwordErrors.confirmPassword && (
                                <span className="error-message">{passwordErrors.confirmPassword}</span>
                            )}
                        </div>

                        <div className="section-actions">
                            <Button
                                type="submit"
                                loading={isChangingPassword}
                            >
                                Change Password
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="settings-section danger">
                    <div className="section-header">
                        <h2 className="section-title">Danger Zone</h2>
                        <p className="section-description">
                            Irreversible actions for your account
                        </p>
                    </div>

                    <div className="danger-actions">
                        <div className="danger-item">
                            <div>
                                <h3 className="danger-title">Delete Account</h3>
                                <p className="danger-description">
                                    Permanently delete your account and all associated data
                                </p>
                            </div>
                            <Button variant="danger" onClick={() => alert('Delete account functionality')}>
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
