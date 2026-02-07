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
  const baseStyles = `
    relative inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-dark
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-teal-accent to-primary-dark
      text-white font-semibold
      hover:shadow-glow-accent hover:scale-105
      focus:ring-teal-accent
      active:scale-95
    `,
    secondary: `
      bg-secondary-dark border-2 border-teal-accent/30
      text-white font-semibold
      hover:bg-teal-accent/10 hover:border-teal-accent hover:shadow-glow-accent
      focus:ring-teal-accent
      active:scale-95
    `,
    outline: `
      bg-transparent border-2 border-border-light
      text-text-primary font-medium
      hover:border-teal-accent hover:bg-teal-accent/5 hover:text-teal-accent
      focus:ring-teal-accent
      active:scale-95
    `,
    ghost: `
      bg-transparent text-text-secondary font-medium
      hover:bg-bg-card hover:text-teal-accent
      focus:ring-teal-accent
    `,
    danger: `
      bg-error border-2 border-error
      text-white font-semibold
      hover:bg-error-dark hover:shadow-lg
      focus:ring-error
      active:scale-95
    `,
    success: `
      bg-success border-2 border-success
      text-white font-semibold
      hover:bg-success-dark hover:shadow-lg
      focus:ring-success
      active:scale-95
    `,
  };

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
