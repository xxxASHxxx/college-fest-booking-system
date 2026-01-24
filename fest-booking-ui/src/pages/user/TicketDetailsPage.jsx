import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import ticketService from '../../services/ticketService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import QRCode from 'react-qr-code';
import { FiDownload, FiMail, FiMapPin, FiCalendar, FiClock, FiArrowLeft } from 'react-icons/fi';
import { formatDate, formatTime } from '../../utils/formatters';
import { trackPageView } from '../../utils/analytics';
import './TicketDetailsPage.css';

const TicketDetailsPage = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        trackPageView('Ticket Details');
        fetchTicketDetails();
    }, [ticketId]);

    const fetchTicketDetails = async () => {
        setLoading(true);
        try {
            const result = await ticketService.getTicketById(ticketId);
            if (result.success) {
                setTicket(result.data);
            } else {
                showError('Ticket not found');
                navigate('/my-tickets');
            }
        } catch (error) {
            showError('Failed to load ticket');
            navigate('/my-tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const result = await ticketService.downloadTicket(ticketId);
            if (result.success) {
                showSuccess('Ticket downloaded successfully');
            }
        } catch (error) {
            showError('Failed to download ticket');
        }
    };

    const handleEmail = async () => {
        try {
            const result = await ticketService.emailTicket(ticketId);
            if (result.success) {
                showSuccess('Ticket sent to your email');
            }
        } catch (error) {
            showError('Failed to send ticket');
        }
    };

    if (loading) {
        return (
            <div className="ticket-details-loading">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (!ticket) {
        return null;
    }

    return (
        <div className="ticket-details-page">
            <div className="ticket-container">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    icon={<FiArrowLeft />}
                    onClick={() => navigate('/my-tickets')}
                >
                    Back to Tickets
                </Button>

                {/* Ticket Card */}
                <div className="ticket-card-large">
                    {/* Header */}
                    <div className="ticket-header">
                        <div className="ticket-badge">
                            <span className="badge-icon">🎫</span>
                            <span className="badge-text">E-Ticket</span>
                        </div>
                        <div className="ticket-number">#{ticket.ticketNumber}</div>
                    </div>

                    {/* Content */}
                    <div className="ticket-content">
                        {/* Event Info */}
                        <div className="ticket-info">
                            <h1 className="event-name">{ticket.event.name}</h1>

                            <div className="event-details">
                                <div className="detail-row">
                                    <FiCalendar className="detail-icon" />
                                    <span>{formatDate(ticket.event.date)}</span>
                                </div>
                                <div className="detail-row">
                                    <FiClock className="detail-icon" />
                                    <span>{formatTime(ticket.event.date)}</span>
                                </div>
                                <div className="detail-row">
                                    <FiMapPin className="detail-icon" />
                                    <span>{ticket.event.venue}</span>
                                </div>
                            </div>

                            <div className="ticket-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Name</span>
                                    <span className="meta-value">{ticket.booking.userDetails.name}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Email</span>
                                    <span className="meta-value">{ticket.booking.userDetails.email}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Seat Type</span>
                                    <span className="meta-value">{ticket.seatType}</span>
                                </div>
                                {ticket.seatNumber && (
                                    <div className="meta-item">
                                        <span className="meta-label">Seat Number</span>
                                        <span className="meta-value">{ticket.seatNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="ticket-qr">
                            <div className="qr-container">
                                <QRCode
                                    value={ticket.qrCode}
                                    size={200}
                                    level="H"
                                />
                            </div>
                            <p className="qr-instruction">
                                Show this QR code at the venue entrance
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="ticket-footer">
                        <div className="ticket-status">
              <span className={`status-badge ${ticket.status}`}>
                {ticket.status}
              </span>
                        </div>
                        <div className="ticket-actions">
                            <Button
                                variant="primary"
                                icon={<FiDownload />}
                                onClick={handleDownload}
                            >
                                Download
                            </Button>
                            <Button
                                variant="outline"
                                icon={<FiMail />}
                                onClick={handleEmail}
                            >
                                Email
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Important Info */}
                <div className="important-info">
                    <h3>Important Information</h3>
                    <ul>
                        <li>This ticket is valid for one person only</li>
                        <li>Please arrive at least 30 minutes before the event</li>
                        <li>Carry a valid ID proof for verification</li>
                        <li>This ticket cannot be transferred or refunded</li>
                        <li>The QR code will be scanned at the entrance</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailsPage;
