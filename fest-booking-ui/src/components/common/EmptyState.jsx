import React from 'react';
import PropTypes from 'prop-types';
import './EmptyState.css';

const EmptyState = ({
    icon,
    title,
    description,
    action,
    className = ''
}) => {
    return (
        <div className={`empty-state ${className}`}>
            {icon && (
                <div className="empty-state-icon">
                    {typeof icon === 'string' ? (
                        <span className="empty-state-emoji">{icon}</span>
                    ) : (
                        icon
                    )}
                </div>
            )}
            {title && <h3 className="empty-state-title">{title}</h3>}
            {description && (
                <p className="empty-state-description">{description}</p>
            )}
            {action && <div className="empty-state-action">{action}</div>}
        </div>
    );
};

EmptyState.propTypes = {
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    title: PropTypes.string,
    description: PropTypes.string,
    action: PropTypes.node,
    className: PropTypes.string,
};

export default EmptyState;
