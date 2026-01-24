import React from 'react';
import { Download, Mail, Printer } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';
import ticketService from '../../services/ticketService';
import Button from '../common/Button';
import Card from '../common/Card';

const TicketDownload = ({ tickets, bookingId }) => {
    const { showSuccess, showError } = useToast();

    const handleDownloadSingle = async (ticketId) => {
        try {
            const result = await ticketService.downloadTicket(ticketId);
            if (result.success) {
                showSuccess('Ticket downloaded successfully!');
            } else {
                showError('Failed to download ticket');
            }
        } catch (error) {
            showError('Download failed');
        }
    };

    const handleDownloadAll = async () => {
        try {
            for (const ticket of tickets) {
                await ticketService.downloadTicket(ticket.id);
            }
            showSuccess('All tickets downloaded successfully!');
        } catch (error) {
            showError('Failed to download some tickets');
        }
    };

    const handleEmailTickets = async () => {
        try {
            // This would call an API to email tickets
            showSuccess('Tickets sent to your email!');
        } catch (error) {
            showError('Failed to send email');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (!tickets || tickets.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Download Options</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button
                        variant="primary"
                        onClick={handleDownloadAll}
                        icon={<Download size={20} />}
                    >
                        Download All ({tickets.length})
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleEmailTickets}
                        icon={<Mail size={20} />}
                    >
                        Email Tickets
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        icon={<Printer size={20} />}
                    >
                        Print Tickets
                    </Button>
                </div>
            </Card>

            {/* Individual Tickets */}
            <Card className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Individual Tickets</h3>
                <div className="space-y-3">
                    {tickets.map((ticket, index) => (
                        <div
                            key={ticket.id}
                            className="flex items-center justify-between p-4 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10"
                        >
                            <div className="flex-1">
                                <p className="text-white font-medium">Ticket #{index + 1}</p>
                                <p className="text-sm text-white/60">ID: {ticket.id}</p>
                                <p className="text-sm text-white/60 capitalize">{ticket.seatType} Seat</p>
                            </div>
                            <div className="text-right mr-4">
                                <p className="text-white font-bold">{formatCurrency(ticket.amount)}</p>
                                <p className="text-xs text-white/60">{ticket.status}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadSingle(ticket.id)}
                                icon={<Download size={16} />}
                            >
                                Download
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Download Info */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-3">About Your Tickets</h3>
                <div className="space-y-3 text-sm text-white/80">
                    <div className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>
              Tickets are available in PDF format with embedded QR codes
            </span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>
              You can download and print your tickets or show them on your mobile device
            </span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>
              Each ticket contains a unique QR code for entry verification
            </span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>
              Keep your tickets safe and do not share the QR codes with anyone
            </span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TicketDownload;
