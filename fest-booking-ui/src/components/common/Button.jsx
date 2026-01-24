import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
                    children,
                    variant = 'primary',
                    size = 'md',
                    loading = false,
                    disabled = false,
                    fullWidth = false,
                    icon = null,
                    iconPosition = 'left',
                    type = 'button',
                    onClick,
                    className = '',
                    ...props
                }) => {
    // Base styles with glassmorphism
    const baseStyles = `
    relative inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-4 focus:ring-opacity-50
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

    // Variant styles with glassmorphism effects
    const variants = {
        primary: `
      backdrop-blur-lg bg-gradient-to-r from-purple-500/80 to-blue-500/80
      border border-white/20 text-white shadow-xl
      hover:from-purple-600/90 hover:to-blue-600/90 hover:shadow-2xl hover:scale-105
      focus:ring-purple-500
    `,
        secondary: `
      backdrop-blur-lg bg-white/10 border border-white/20 text-white shadow-lg
      hover:bg-white/20 hover:shadow-xl hover:scale-105
      focus:ring-white
    `,
        danger: `
      backdrop-blur-lg bg-gradient-to-r from-red-500/80 to-pink-500/80
      border border-white/20 text-white shadow-xl
      hover:from-red-600/90 hover:to-pink-600/90 hover:shadow-2xl hover:scale-105
      focus:ring-red-500
    `,
        success: `
      backdrop-blur-lg bg-gradient-to-r from-green-500/80 to-emerald-500/80
      border border-white/20 text-white shadow-xl
      hover:from-green-600/90 hover:to-emerald-600/90 hover:shadow-2xl hover:scale-105
      focus:ring-green-500
    `,
        outline: `
      backdrop-blur-lg bg-transparent border-2 border-white/30 text-white shadow-lg
      hover:bg-white/10 hover:border-white/50 hover:shadow-xl
      focus:ring-white
    `,
        ghost: `
      bg-transparent text-white hover:bg-white/10
      focus:ring-white
    `,
    };

    // Size styles
    const sizes = {
        sm: 'px-4 py-2 text-sm gap-1.5',
        md: 'px-6 py-2.5 text-base gap-2',
        lg: 'px-8 py-3 text-lg gap-2.5',
        xl: 'px-10 py-4 text-xl gap-3',
    };

    const variantClass = variants[variant] || variants.primary;
    const sizeClass = sizes[size] || sizes.md;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
            {...props}
        >
            {loading && (
                <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
            )}

            {!loading && icon && iconPosition === 'left' && (
                <span className="inline-flex">{icon}</span>
            )}

            <span>{children}</span>

            {!loading && icon && iconPosition === 'right' && (
                <span className="inline-flex">{icon}</span>
            )}
        </button>
    );
};

export default Button;
