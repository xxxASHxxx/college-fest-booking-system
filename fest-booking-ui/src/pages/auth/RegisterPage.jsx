import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import RegisterForm from '../../components/auth/RegisterForm';
import './RegisterPage.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (userData) => {
        setLoading(true);
        setError('');

        try {
            await register(userData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-header">
                    <h1>Create Account</h1>
                    <p>Sign up to start booking events</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <RegisterForm onSubmit={handleRegister} loading={loading} />

                <div className="register-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="login-link">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
