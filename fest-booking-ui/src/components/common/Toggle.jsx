import React from 'react';
import PropTypes from 'prop-types';
import './Toggle.css';

const Toggle = ({
    checked,
    onChange,
    label,
    disabled = false,
    size = 'md',
    className = ''
}) => {
    const handleToggle = () => {
        if (!disabled && onChange) {
            onChange(!checked);
        }
    };

    const sizeClass = `toggle-${size}`;

    return (
        <label className={`toggle-container ${className} ${disabled ? 'disabled' : ''}`}>
            <div className={`toggle-wrapper ${sizeClass}`}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleToggle}
                    disabled={disabled}
                    className="toggle-input"
                />
                <span className={`toggle-slider ${checked ? 'checked' : ''}`}>
                    <span className="toggle-knob"></span>
                </span>
            </div>
            {label && <span className="toggle-label">{label}</span>}
        </label>
    );
};

Toggle.propTypes = {
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string,
};

export default Toggle;
