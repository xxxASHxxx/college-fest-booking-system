import React from 'react';
import './AnalyticsCard.css';

const AnalyticsCard = ({ title, data, icon, color = 'primary' }) => {
    return (
        <div className={`analytics-card analytics-card-${color}`}>
            <div className="analytics-header">
                <div className="analytics-icon">{icon}</div>
                <h3 className="analytics-title">{title}</h3>
            </div>

            <div className="analytics-body">
                {data.map((item, index) => (
                    <div key={index} className="analytics-item">
                        <div className="item-info">
                            <span className="item-label">{item.label}</span>
                            <span className="item-description">{item.description}</span>
                        </div>
                        <span className="item-value">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsCard;
