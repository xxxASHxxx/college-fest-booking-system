import React from 'react';

const Card = ({
                  children,
                  variant = 'default',
                  hoverable = false,
                  className = '',
                  onClick,
                  ...props
              }) => {
    // Base glassmorphism styles
    const baseStyles = `
    backdrop-blur-lg rounded-2xl border shadow-xl
    transition-all duration-300 ease-in-out
  `;

    // Variant styles
    const variants = {
        default: `
      bg-white/10 border-white/20
      ${hoverable ? 'hover:bg-white/15 hover:shadow-2xl hover:scale-[1.02]' : ''}
      ${onClick ? 'cursor-pointer' : ''}
    `,
        solid: `
      bg-white/20 border-white/30
      ${hoverable ? 'hover:bg-white/25 hover:shadow-2xl hover:scale-[1.02]' : ''}
      ${onClick ? 'cursor-pointer' : ''}
    `,
        gradient: `
      bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-white/20
      ${hoverable ? 'hover:from-purple-500/30 hover:to-blue-500/30 hover:shadow-2xl hover:scale-[1.02]' : ''}
      ${onClick ? 'cursor-pointer' : ''}
    `,
        dark: `
      bg-black/30 border-white/10
      ${hoverable ? 'hover:bg-black/40 hover:shadow-2xl hover:scale-[1.02]' : ''}
      ${onClick ? 'cursor-pointer' : ''}
    `,
    };

    const variantClass = variants[variant] || variants.default;

    return (
        <div
            onClick={onClick}
            className={`${baseStyles} ${variantClass} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
