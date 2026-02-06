import React from 'react';
import PropTypes from 'prop-types';
import './Avatar.css';

const Avatar = ({
    src,
    alt,
    name,
    size = 'md',
    className = '',
    fallbackColor = '#667eea'
}) => {
    const [imageError, setImageError] = React.useState(false);

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const sizeClass = `avatar-${size}`;

    return (
        <div className={`avatar ${sizeClass} ${className}`}>
            {src && !imageError ? (
                <img
                    src={src}
                    alt={alt || name || 'Avatar'}
                    onError={() => setImageError(true)}
                    className="avatar-image"
                />
            ) : (
                <div
                    className="avatar-fallback"
                    style={{ backgroundColor: fallbackColor }}
                >
                    {getInitials(name || alt || 'User')}
                </div>
            )}
        </div>
    );
};

Avatar.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    className: PropTypes.string,
    fallbackColor: PropTypes.string,
};

export default Avatar;
