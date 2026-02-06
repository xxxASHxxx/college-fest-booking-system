import React, { useState } from 'react';
import { User, Mail, Phone, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateForm, validatePassword } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';

const RegisterForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        // Check password strength
        if (name === 'password') {
            const strength = validatePassword(value);
            setPasswordStrength(strength);
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const validation = validateForm(formData, {
            name: { required: true, minLength: 2 },
            email: { required: true, email: true },
            phone: { required: true, phone: true },
            password: { required: true, minLength: 8 },
            confirmPassword: { required: true, matches: 'password' },
        });

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        // Check terms agreement
        if (!formData.agreeToTerms) {
            setErrors({ agreeToTerms: 'You must agree to the terms and conditions' });
            return;
        }

        // Check password strength
        if (!passwordStrength || !passwordStrength.isValid) {
            setErrors({ password: 'Please use a stronger password' });
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const userData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            };

            const result = await register(userData);

            if (result.success) {
                navigate('/');
                if (onClose) onClose();
            } else {
                setErrors({ submit: result.error });
            }
        } catch (error) {
            setErrors({ submit: 'Registration failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Password strength indicator
    const getStrengthColor = () => {
        if (!passwordStrength) return '';
        switch (passwordStrength.level) {
            case 'weak':
                return 'bg-red-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'strong':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStrengthWidth = () => {
        if (!passwordStrength) return '0%';
        return `${(passwordStrength.score / 5) * 100}%`;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Submit Error */}
            {errors.submit && (
                <div className="flex items-start gap-3 p-4 rounded-xl backdrop-blur-lg bg-red-500/20 border border-red-500/30 text-red-300">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{errors.submit}</p>
                </div>
            )}

            {/* Name Input */}
            <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                icon={<User size={20} />}
                error={errors.name}
                required
                autoComplete="name"
            />

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

            {/* Phone Input */}
            <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                icon={<Phone size={20} />}
                error={errors.phone}
                helperText="10-digit mobile number"
                required
                autoComplete="tel"
            />

            {/* Password Input */}
            <div>
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    icon={<Lock size={20} />}
                    error={errors.password}
                    showPasswordToggle
                    required
                    autoComplete="new-password"
                />

                {/* Password Strength Indicator */}
                {formData.password && (
                    <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${getStrengthColor()} transition-all duration-300`}
                                    style={{ width: getStrengthWidth() }}
                                />
                            </div>
                            <span className="text-xs text-white/70 capitalize">
                                {passwordStrength?.level}
                            </span>
                        </div>

                        {passwordStrength && passwordStrength.feedback.length > 0 && (
                            <ul className="space-y-1">
                                {passwordStrength.feedback.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 text-xs text-white/60">
                                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Confirm Password Input */}
            <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                icon={<Lock size={20} />}
                error={errors.confirmPassword}
                success={formData.confirmPassword && formData.password === formData.confirmPassword}
                showPasswordToggle
                required
                autoComplete="new-password"
            />

            {/* Terms Agreement */}
            <div>
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="w-5 h-5 mt-0.5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-white/80 leading-relaxed">
                        I agree to the{' '}
                        <a href="/terms" className="text-purple-400 hover:text-purple-300">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-purple-400 hover:text-purple-300">
                            Privacy Policy
                        </a>
                    </span>
                </label>
                {errors.agreeToTerms && (
                    <p className="mt-1.5 text-sm text-red-400">{errors.agreeToTerms}</p>
                )}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
            >
                {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 backdrop-blur-lg bg-black/20 text-white/60">
                        Or sign up with
                    </span>
                </div>
            </div>

            {/* Social Sign Up */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
                    onClick={() => alert('Google sign up coming soon!')}
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
                    onClick={() => alert('Facebook sign up coming soon!')}
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

export default RegisterForm;
