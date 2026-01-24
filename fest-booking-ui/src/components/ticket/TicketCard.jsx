import React, { useState } from 'react';
import { Calendar, MapPin, Download, Share2, XCircle, QrCode, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { isUpcoming, isPast } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';
import ticketService from '../../services/ticketService';
import Button from '../common/Button';
import Card from '../common/Card';
import TicketQRCode from './TicketQRCode';
import TicketCancelModal from './TicketCancelModal';

const TicketCard = ({ ticket }) => {
    const [showQRCode, setShowQRCode] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const upcoming = isUpcoming(ticket.event.date);
    const past = isPast(ticket.event.date);

    const statusConfig = {
        active: {
            label: 'Active',
            color: 'text-green-400',
            bgColor: 'bg-green-500/20',
            borderColor: 'border-green-400/30',
        },
        used: {
            label: 'Used',
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/20',
            borderColor: 'border-blue-400/30',
        },
        cancelled: {
            label: 'Cancelled',
            color: 'text-red-400',
            bgColor: 'bg-red-500/20',
            borderColor: 'border-red-400/30',
        },
        expired: {
            label: 'Expired',
            color: 'text-gray-400',
            bgColor: 'bg-gray-500/20',
            borderColor: 'border-gray-400/30',
        },
    };

    const currentStatus = statusConfig[ticket.status] || statusConfig.active;

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const result = await ticketService.downloadTicket(ticket.id);
            if (result.success) {
                showSuccess('Ticket downloaded successfully!');
            } else {
                showError('Failed to download ticket');
            }
        } catch (error) {
            showError('Download failed. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `${ticket.event.name} - Ticket`,
                    text: `My ticket for ${ticket.event.name}`,
                    url: window.location.origin + `/tickets/${ticket.id}`,
                });
            } else {
                await navigator.clipboard.writeText(window.location.origin + `/tickets/${ticket.id}`);
                showSuccess('Ticket link copied to clipboard!');
            }
        } catch (error) {
            showError('Failed to share ticket');
        }
    };

    return (
        <>
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                    {/* Left Section - Event Image */}
                    <div className="md:w-64 h-48 md:h-auto relative flex-shrink-0">
                        <img
                            src={ticket.event.image || '/images/placeholder-event.jpg'}
                            alt={ticket.event.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-transparent" />

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
              <span
                  className={`px-3 py-1 rounded-full backdrop-blur-lg border text-xs font-bold ${currentStatus.bgColor} ${currentStatus.borderColor} ${currentStatus.color}`}
              >
                {currentStatus.label}
              </span>
                        </div>

                        {/* Check-in Status */}
                        {ticket.isCheckedIn && (
                            <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-lg bg-green-500/90 border border-green-400/30">
                                <CheckCircle2 size={14} className="text-white" />
                                <span className="text-white text-xs font-bold">Checked In</span>
                            </div>
                        )}
                    </div>

                    {/* Middle Section - Event Details */}
                    <div className="flex-1 p-6">
                        <div className="space-y-4">
                            {/* Event Name */}
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1 line-clamp-2">
                                    {ticket.event.name}
                                </h3>
                                <p className="text-sm text-purple-400 font-medium">
                                    Ticket ID: {ticket.id}
                                </p>
                            </div>

                            {/* Event Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-start gap-2 text-white/80">
                                    <Calendar size={18} className="mt-0.5 flex-shrink-0 text-purple-400" />
                                    <div>
                                        <p className="text-white/60 text-xs">Date & Time</p>
                                        <p className="font-medium">{formatDate(ticket.event.date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 text-white/80">
                                    <MapPin size={18} className="mt-0.5 flex-shrink-0 text-purple-400" />
                                    <div>
                                        <p className="text-white/60 text-xs">Venue</p>
                                        <p className="font-medium line-clamp-1">{ticket.event.venue}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Details */}
                            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-white/10">
                                <div>
                                    <p className="text-white/60 text-xs">Seat Type</p>
                                    <p className="text-white font-medium capitalize">{ticket.seatType}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs">Quantity</p>
                                    <p className="text-white font-medium">{ticket.quantity || 1}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs">Amount Paid</p>
                                    <p className="text-white font-bold">{formatCurrency(ticket.amount)}</p>
                                </div>
                            </div>

                            {/* Attendee Info */}
                            {ticket.attendeeName && (
                                <div className="pt-3 border-t border-white/10">
                                    <p className="text-white/60 text-xs">Attendee</p>
                                    <p className="text-white font-medium">{ticket.attendeeName}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="md:w-48 p-6 md:border-l border-t md:border-t-0 border-white/10 flex md:flex-col justify-center gap-3">
                        {ticket.status === 'active' && upcoming && (
                            <>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    fullWidth
                                    onClick={() => setShowQRCode(true)}
                                    icon={<QrCode size={18} />}
                                >
                                    Show QR
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    fullWidth
                                    onClick={handleDownload}
                                    loading={downloading}
                                    icon={<Download size={18} />}
                                >
                                    Download
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    fullWidth
                                    onClick={handleShare}
                                    icon={<Share2 size={18} />}
                                >
                                    Share
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    fullWidth
                                    onClick={() => setShowCancelModal(true)}
                                    icon={<XCircle size={18} />}
                                    className="text-red-400 hover:bg-red-500/10"
                                >
                                    Cancel
                                </Button>
                            </>
                        )}

                        {ticket.status === 'active' && past && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    fullWidth
                                    onClick={handleDownload}
                                    loading={downloading}
                                    icon={<Download size={18} />}
                                >
                                    Download
                                </Button>
                                <p className="text-center text-sm text-white/60">
                                    Event has ended
                                </p>
                            </>
                        )}

                        {(ticket.status === 'used' || ticket.status === 'cancelled' || ticket.status === 'expired') && (
                            <Button
                                variant="outline"
                                size="sm"
                                fullWidth
                                onClick={handleDownload}
                                loading={downloading}
                                icon={<Download size={18} />}
                            >
                                Download
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* QR Code Modal */}
            <TicketQRCode
                isOpen={showQRCode}
                onClose={() => setShowQRCode(false)}
                ticket={ticket}
            />

            {/* Cancel Modal */}
            <TicketCancelModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                ticket={ticket}
            />
        </>
    );
};

export default TicketCard;
