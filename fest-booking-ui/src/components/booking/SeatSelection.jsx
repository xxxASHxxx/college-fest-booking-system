import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SeatSelection.css';

const SeatSelection = ({
    totalSeats,
    bookedSeats = [],
    selectedSeats = [],
    onSeatSelect,
    seatsPerRow = 10
}) => {
    const rows = Math.ceil(totalSeats / seatsPerRow);

    const getSeatStatus = (seatNumber) => {
        if (bookedSeats.includes(seatNumber)) return 'booked';
        if (selectedSeats.includes(seatNumber)) return 'selected';
        return 'available';
    };

    const handleSeatClick = (seatNumber) => {
        const status = getSeatStatus(seatNumber);
        if (status === 'booked') return;

        if (onSeatSelect) {
            onSeatSelect(seatNumber);
        }
    };

    const renderSeats = () => {
        const seats = [];
        for (let row = 0; row < rows; row++) {
            const rowSeats = [];
            for (let col = 0; col < seatsPerRow; col++) {
                const seatNumber = row * seatsPerRow + col + 1;
                if (seatNumber > totalSeats) break;

                const status = getSeatStatus(seatNumber);
                rowSeats.push(
                    <button
                        key={seatNumber}
                        className={`seat ${status}`}
                        onClick={() => handleSeatClick(seatNumber)}
                        disabled={status === 'booked'}
                        title={`Seat ${seatNumber}`}
                    >
                        {seatNumber}
                    </button>
                );
            }
            seats.push(
                <div key={row} className="seat-row">
                    <span className="row-label">{String.fromCharCode(65 + row)}</span>
                    <div className="seats-container">
                        {rowSeats}
                    </div>
                </div>
            );
        }
        return seats;
    };

    return (
        <div className="seat-selection">
            <div className="seat-legend">
                <div className="legend-item">
                    <div className="seat available small"></div>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <div className="seat selected small"></div>
                    <span>Selected</span>
                </div>
                <div className="legend-item">
                    <div className="seat booked small"></div>
                    <span>Booked</span>
                </div>
            </div>

            <div className="seat-map">
                <div className="screen">Screen</div>
                {renderSeats()}
            </div>

            <div className="selection-summary">
                <p>
                    Selected Seats: <strong>{selectedSeats.length}</strong>
                    {selectedSeats.length > 0 && (
                        <span className="selected-numbers">
                            {' '}({selectedSeats.sort((a, b) => a - b).join(', ')})
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
};

SeatSelection.propTypes = {
    totalSeats: PropTypes.number.isRequired,
    bookedSeats: PropTypes.arrayOf(PropTypes.number),
    selectedSeats: PropTypes.arrayOf(PropTypes.number),
    onSeatSelect: PropTypes.func.isRequired,
    seatsPerRow: PropTypes.number,
};

export default SeatSelection;
