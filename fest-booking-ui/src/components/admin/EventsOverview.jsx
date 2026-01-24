import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './EventsOverview.css';

const EventsOverview = ({ stats }) => {
    if (!stats) {
        return (
            <div className="overview-empty">
                <p>No data available</p>
            </div>
        );
    }

    const data = [
        { name: 'Active', value: stats.active || 0, color: '#00B894' },
        { name: 'Upcoming', value: stats.upcoming || 0, color: '#0984E3' },
        { name: 'Past', value: stats.past || 0, color: '#636E72' },
        { name: 'Cancelled', value: stats.cancelled || 0, color: '#D63031' },
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{payload[0].name}</p>
                    <p className="tooltip-value">{payload[0].value} events</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="events-overview">
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            <div className="overview-legend">
                {data.map((item) => (
                    <div key={item.name} className="legend-item">
                        <div
                            className="legend-color"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="legend-label">{item.name}</span>
                        <span className="legend-value">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventsOverview;
