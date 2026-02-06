import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Tabs.css';

const Tabs = ({ tabs, defaultTab, onChange, className = '' }) => {
    const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0]?.value));

    const handleTabClick = (value) => {
        setActiveTab(value);
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <div className={`tabs-container ${className}`}>
            <div className="tabs-list">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabClick(tab.value)}
                        className={`tab-button ${activeTab === tab.value ? 'active' : ''}`}
                        disabled={tab.disabled}
                    >
                        {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                        <span>{tab.label}</span>
                        {tab.badge && (
                            <span className="tab-badge">{tab.badge}</span>
                        )}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {tabs.find(tab => tab.value === activeTab)?.content}
            </div>
        </div>
    );
};

Tabs.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            content: PropTypes.node,
            icon: PropTypes.node,
            badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            disabled: PropTypes.bool,
        })
    ).isRequired,
    defaultTab: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
};

export default Tabs;
