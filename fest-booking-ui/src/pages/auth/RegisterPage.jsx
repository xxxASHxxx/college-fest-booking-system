import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import RegisterForm from '../../components/auth/RegisterForm';
import LiquidEtherBackground from '../../components/backgrounds/LiquidEtherBackground';

const RegisterPage = () => {
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
                            <h1 className="text-3xl font-bold mb-2 text-white">Create Account</h1>
                            <p className="text-gray-200">Join us to book amazing college events</p>
                        </div>

                        {/* Form */}
                        <RegisterForm />

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-200 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-teal-accent hover:text-warm-highlight font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-accent focus-visible:outline-offset-2 rounded">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Additional Links */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-gray-200 hover:text-teal-accent transition-colors text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-accent focus-visible:outline-offset-2 rounded px-2 py-1"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </LiquidEtherBackground>
    );
};

export default RegisterPage;

