import React from 'react';
import PropTypes from 'prop-types';
import './Badge.css';

const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
    const baseClass = 'badge';
    const variantClass = `badge-${variant}`;
    const sizeClass = `badge-${size}`;

    return (
        <span className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}>
            {children}
        </span>
    );
};

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'info']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string,
};

export default Badge;
