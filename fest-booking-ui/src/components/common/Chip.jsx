import React from 'react';
import { X } from 'lucide-react';

const Chip = ({
    children,
    variant = 'default',
    size = 'md',
    onRemove,
    icon,
    className = '',
    ...props
}) => {
    const baseStyles = `
    inline-flex items-center gap-1.5 rounded-full font-medium
    transition-all duration-200 ease-in-out
  `;

    const variants = {
        default: 'bg-bg-card border border-border text-text-secondary hover:border-border-light',
        primary: 'bg-primary-dark/20 border border-primary-dark/40 text-teal-accent',
        teal: 'bg-teal-accent/10 border border-teal-accent/30 text-teal-accent',
        success: 'bg-success/10 border border-success/30 text-success',
        warning: 'bg-warning/10 border border-warning/30 text-warning',
        error: 'bg-error/10 border border-error/30 text-error',
        outline: 'bg-transparent border border-border-light text-text-secondary hover:bg-bg-card',
    };

    const sizes = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
    };

    const variantClass = variants[variant] || variants.default;
    const sizeClass = sizes[size] || sizes.md;

    return (
        <span
            className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
            {...props}
        >
            {icon && <span className="inline-flex">{icon}</span>}
            <span>{children}</span>
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="inline-flex hover:bg-white/10 rounded-full p-0.5 transition-colors"
                    aria-label="Remove"
                >
                    <X size={14} />
                </button>
            )}
        </span>
    );
};

export default Chip;
