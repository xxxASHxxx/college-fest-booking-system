import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LiquidEtherBackground from '../../components/backgrounds/LiquidEtherBackground';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login({
                email: formData.email,
                password: formData.password
            });

            console.log('[LoginPage] Login result:', result);

            if (result.success && result.data?.user) {
                const user = result.data.user;
                console.log('[LoginPage] Login successful, user role:', user.role);

                // Role-based redirect
                const redirectPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/my-bookings';
                console.log('[LoginPage] Redirecting to:', redirectPath);

                navigate(redirectPath, { replace: true });
            } else {
                setError(result.error || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('[LoginPage] Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LiquidEtherBackground>
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                {/* Content */}
                <div className="max-w-md w-full">
                    {/* Glassmorphism Card */}
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10 animate-fadeIn">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-accent/20 border border-teal-accent/40 text-teal-accent text-sm font-medium mb-4">
                                <Sparkles size={16} />
                                <span>FestBook</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>
                            <p className="text-gray-200">Sign in to continue booking amazing events</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 rounded-xl text-sm" style={{
                                background: 'rgba(157, 2, 8, 0.3)',
                                border: '1px solid rgba(208, 0, 0, 0.5)',
                                color: '#fca5a5'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                icon={<Mail size={20} />}
                                required
                                darkMode
                            />

                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                icon={<Lock size={20} />}
                                showPasswordToggle
                                required
                                darkMode
                            />

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded"
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            borderColor: 'rgba(255,255,255,0.3)',
                                            accentColor: '#FAA307'
                                        }}
                                    />
                                    <span className="text-gray-200">Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-teal-accent hover:text-warm-highlight transition-colors">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                fullWidth
                                loading={loading}
                                icon={<ArrowRight size={20} />}
                                iconPosition="right"
                            >
                                Sign In
                            </Button>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-200 text-sm">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-teal-accent hover:text-warm-highlight font-medium transition-colors">
                                    Sign up now
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Additional Links */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-gray-200 hover:text-teal-accent transition-colors text-sm px-2 py-1"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </LiquidEtherBackground>
    );
};

export default LoginPage;
