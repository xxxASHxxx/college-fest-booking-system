import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import './StatCard.css';

const StatCard = ({ title, value, change, icon, color = 'primary' }) => {
    const isPositive = change >= 0;

    return (
        <div className={`stat-card stat-card-${color}`}>
            <div className="stat-card-header">
                <div className="stat-icon-wrapper">
                    {icon}
                </div>
                {change !== undefined && (
                    <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
                        {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                        <span>{Math.abs(change)}%</span>
                    </div>
                )}
            </div>

            <div className="stat-card-body">
                <h3 className="stat-value">{value}</h3>
                <p className="stat-title">{title}</p>
            </div>
        </div>
    );
};

export default StatCard;
