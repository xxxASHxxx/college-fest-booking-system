import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateForm } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const validation = validateForm(formData, {
            email: { required: true, email: true },
            password: { required: true, minLength: 6 },
        });

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const result = await login(formData.email, formData.password, formData.rememberMe);

            if (result.success) {
                // Redirect based on user role
                if (result.user.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
                if (onClose) onClose();
            } else {
                setErrors({ submit: result.error });
            }
        } catch (error) {
            setErrors({ submit: 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submit Error */}
            {errors.submit && (
                <div className="flex items-start gap-3 p-4 rounded-xl backdrop-blur-lg bg-red-500/20 border border-red-500/30 text-red-300">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{errors.submit}</p>
                </div>
            )}

            {/* Email Input */}
            <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                icon={<Mail size={20} />}
                error={errors.email}
                required
                autoComplete="email"
            />

            {/* Password Input */}
            <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                icon={<Lock size={20} />}
                error={errors.password}
                showPasswordToggle
                required
                autoComplete="current-password"
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-white/80">Remember me</span>
                </label>

                <Link
                    to="/forgot-password"
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                    Forgot password?
                </Link>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
          <span className="px-4 backdrop-blur-lg bg-black/20 text-white/60">
            Or continue with
          </span>
                </div>
            </div>

            {/* Social Login Placeholders */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
                    onClick={() => alert('Google login coming soon!')}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Google
                </button>

                <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
                    onClick={() => alert('Facebook login coming soon!')}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                </button>
            </div>
        </form>
    );
};

export default LoginForm;
