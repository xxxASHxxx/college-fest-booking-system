import React from 'react';

const Card = ({
  children,
  variant = 'default',
  hoverable = false,
  onClick,
  className = '',
  padding = 'md',
  ...props
}) => {
  const baseStyles = `
    rounded-2xl border transition-all duration-300 ease-in-out
    ${onClick || hoverable ? 'cursor-pointer' : ''}
  `;

  const variants = {
    default: `
      bg-bg-card border-border
      ${hoverable || onClick ? 'hover:bg-bg-card-hover hover:border-border-light hover:shadow-lg hover:scale-[1.02]' : ''}
    `,
    glass: `
      bg-bg-card/50 backdrop-blur-lg border-border/50
      ${hoverable || onClick ? 'hover:bg-bg-card/70 hover:border-border-light hover:shadow-glow' : ''}
    `,
    primary: `
      bg-gradient-to-br from-primary-dark to-secondary-dark border-teal-accent/30
      ${hoverable || onClick ? 'hover:border-teal-accent hover:shadow-glow-accent' : ''}
    `,
    outline: `
      bg-transparent border-border-light
      ${hoverable || onClick ? 'hover:bg-bg-card/30 hover:border-teal-accent' : ''}
    `,
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClass = variants[variant] || variants.default;
  const paddingClass = paddings[padding] || paddings.md;

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variantClass} ${paddingClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
