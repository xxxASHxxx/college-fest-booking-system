import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useForm } from '../../hooks/useForm';
import Button from '../../components/common/Button';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { trackPageView, trackLogin } from '../../utils/analytics';
import './AuthPages.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { showSuccess, showError } = useToast();
    const [showPassword, setShowPassword] = useState(false);

    const from = location.state?.from?.pathname || '/';

    React.useEffect(() => {
        trackPageView('Login');
    }, []);

    const validationRules = {
        email: { required: true, email: true },
        password: { required: true, minLength: 6 },
    };

    const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm(
        { email: '', password: '' },
        validationRules
    );

    const handleLogin = handleSubmit(async (formValues) => {
        const result = await login(formValues);

        if (result.success) {
            showSuccess('Login successful!');
            trackLogin('email');
            navigate(from, { replace: true });
        } else {
            showError(result.error || 'Login failed');
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
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Login to access your account</p>
                    </div>

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleLogin}>
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
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                    placeholder="Enter your password"
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

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="link">
                                Forgot Password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            size="large"
                            loading={isSubmitting}
                        >
                            Login
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
                            Don't have an account?{' '}
                            <Link to="/register" className="link">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Side Image */}
                <div className="auth-side">
                    <div className="auth-side-content">
                        <h2>Discover Amazing Events</h2>
                        <p>
                            Join thousands of students booking tickets for the best college
                            events
                        </p>
                        <div className="auth-features">
                            <div className="feature">
                                <span className="feature-icon">✨</span>
                                <span>Easy Booking</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">🎉</span>
                                <span>Best Events</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">🔒</span>
                                <span>Secure Payment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
