import React, { useState } from 'react';
import Modal from '../common/Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode);

    const handleClose = () => {
        onClose();
        // Reset to initial mode after modal closes
        setTimeout(() => setMode(initialMode), 300);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={mode === 'login' ? 'Welcome Back!' : 'Create Account'}
            size="md"
        >
            {mode === 'login' ? (
                <LoginForm onClose={handleClose} />
            ) : (
                <RegisterForm onClose={handleClose} />
            )}

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
                <p className="text-white/70 text-sm">
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                    >
                        {mode === 'login' ? 'Sign up' : 'Login'}
                    </button>
                </p>
            </div>
        </Modal>
    );
};

export default AuthModal;
