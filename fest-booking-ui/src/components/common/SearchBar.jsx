import React from 'react';
import PropTypes from 'prop-types';
import { FiSearch, FiX } from 'react-icons/fi';
import './SearchBar.css';

const SearchBar = ({
    value,
    onChange,
    onClear,
    placeholder = 'Search...',
    className = '',
    autoFocus = false
}) => {
    const handleClear = () => {
        if (onClear) {
            onClear();
        } else {
            onChange({ target: { value: '' } });
        }
    };

    return (
        <div className={`search-bar ${className}`}>
            <FiSearch className="search-icon" />
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="search-input"
                autoFocus={autoFocus}
            />
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="search-clear"
                    aria-label="Clear search"
                >
                    <FiX />
                </button>
            )}
        </div>
    );
};

SearchBar.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    autoFocus: PropTypes.bool,
};

export default SearchBar;
