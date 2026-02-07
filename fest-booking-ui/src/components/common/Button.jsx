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
    relative inline-flex items-center justify-center font-semibold rounded-[14px]
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-dark
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    primary: `
      text-white
      hover:scale-105 hover:-translate-y-0.5
      active:scale-95
    `,
    secondary: `
      border text-white
      hover:scale-105
      active:scale-95
    `,
    outline: `
      bg-transparent border-2 text-teal-accent
      hover:scale-105
      active:scale-95
    `,
    ghost: `
      bg-transparent text-text-secondary
      hover:bg-bg-card hover:text-teal-accent
    `,
    danger: `
      border-2 text-white
      hover:scale-105 hover:shadow-lg
      active:scale-95
    `,
    success: `
      border-2 text-white
      hover:scale-105 hover:shadow-lg
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

  // Dynamic inline styles for variant-specific backgrounds
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #F48C06, #D00000)',
          boxShadow: 'none',
        };
      case 'secondary':
        return {
          background: 'rgba(55, 6, 23, 0.35)',
          borderColor: 'rgba(255, 186, 8, 0.25)',
          backdropFilter: 'blur(8px)',
        };
      case 'outline':
        return {
          borderColor: 'rgba(244, 140, 6, 0.45)',
        };
      case 'danger':
        return {
          background: '#9D0208',
          borderColor: '#9D0208',
        };
      case 'success':
        return {
          background: '#F48C06',
          borderColor: '#F48C06',
        };
      default:
        return {};
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
      style={getVariantStyle()}
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
