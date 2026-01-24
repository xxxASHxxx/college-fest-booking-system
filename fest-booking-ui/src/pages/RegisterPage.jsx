import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useForm } from '../../hooks/useForm';
import Button from '../../components/common/Button';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { trackPageView, trackSignup } from '../../utils/analytics';
import './AuthPages.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { showSuccess, showError } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    React.useEffect(() => {
        trackPageView('Register');
    }, []);

    const validationRules = {
        name: { required: true, minLength: 2 },
        email: { required: true, email: true },
        phone: { required: true, phone: true },
        password: { required: true, password: true },
        confirmPassword: { required: true, match: 'password' },
    };

    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        isSubmitting,
    } = useForm(
        {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
        validationRules
    );

    const handleRegister = handleSubmit(async (formValues) => {
        const { confirmPassword, ...userData } = formValues;
        const result = await register(userData);

        if (result.success) {
            showSuccess('Registration successful!');
            trackSignup('email');
            navigate('/');
        } else {
            showError(result.error || 'Registration failed');
        }
    });

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    {/* Header */}
                    <div className="auth-header">
                        <div className="auth-logo">
                            <span className="logo-icon">🎫</span>
                            <span className="logo-text">FestBook</span>
                        </div>
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Sign up to get started</p>
                    </div>

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleRegister}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div className="input-wrapper">
                                <FiUser className="input-icon" />
                                <input
                                    type="text"
                                    name="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    className={`form-input ${errors.name ? 'error' : ''}`}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            {errors.name && (
                                <span className="error-message">{errors.name}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div className="input-wrapper">
                                <FiMail className="input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && (
                                <span className="error-message">{errors.email}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <div className="input-wrapper">
                                <FiPhone className="input-icon" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={values.phone}
                                    onChange={handleChange}
                                    className={`form-input ${errors.phone ? 'error' : ''}`}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            {errors.phone && (
                                <span className="error-message">{errors.phone}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    className="input-action"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="error-message">{errors.password}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    className="input-action"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="error-message">{errors.confirmPassword}</span>
                            )}
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" required />
                                <span>
                  I agree to the{' '}
                                    <Link to="/terms" className="link">
                    Terms & Conditions
                  </Link>
                </span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            size="large"
                            loading={isSubmitting}
                        >
                            Create Account
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="auth-divider">
                        <span>or continue with</span>
                    </div>

                    {/* Social Login */}
                    <div className="social-login">
                        <button className="social-btn google">
                            <img src="/icons/google.svg" alt="Google" />
                            Google
                        </button>
                        <button className="social-btn facebook">
                            <img src="/icons/facebook.svg" alt="Facebook" />
                            Facebook
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="link">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Side Image */}
                <div className="auth-side">
                    <div className="auth-side-content">
                        <h2>Join FestBook Today</h2>
                        <p>
                            Start booking tickets for amazing college events and never miss out
                        </p>
                        <div className="auth-features">
                            <div className="feature">
                                <span className="feature-icon">🎟️</span>
                                <span>Easy Booking</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">🎊</span>
                                <span>Exclusive Events</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">💳</span>
                                <span>Secure Payment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
