import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Share2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { generateQRData } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';
import Modal from '../common/Modal';
import Button from '../common/Button';

const TicketQRCode = ({ isOpen, onClose, ticket }) => {
    const qrRef = useRef(null);
    const { showSuccess, showError } = useToast();

    // Generate QR code data
    const qrData = generateQRData(ticket.id, ticket.bookingId, ticket.event.id);

    const handleDownloadQR = () => {
        try {
            const canvas = qrRef.current.querySelector('canvas');
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = url;
            link.download = `ticket-${ticket.id}-qr.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showSuccess('QR code downloaded successfully!');
        } catch (error) {
            showError('Failed to download QR code');
        }
    };

    const handleShare = async () => {
        try {
            const canvas = qrRef.current.querySelector('canvas');
            canvas.toBlob(async (blob) => {
                const file = new File([blob], `ticket-${ticket.id}.png`, { type: 'image/png' });

                if (navigator.share && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'My Ticket QR Code',
                        text: `Ticket for ${ticket.event.name}`,
                        files: [file],
                    });
                } else {
                    showError('Sharing not supported on this device');
                }
            });
        } catch (error) {
            showError('Failed to share QR code');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Your Ticket QR Code"
            size="md"
        >
            <div className="space-y-6">
                {/* Event Info */}
                <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{ticket.event.name}</h3>
                    <p className="text-white/70">{formatDate(ticket.event.date)}</p>
                    <p className="text-white/70">{ticket.event.venue}</p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center" ref={qrRef}>
                    <div className="p-6 rounded-2xl backdrop-blur-lg bg-white border-4 border-white/20">
                        <QRCodeCanvas
                            value={qrData}
                            size={280}
                            level="H"
                            includeMargin={false}
                        />
                    </div>
                </div>

                {/* Ticket ID */}
                <div className="text-center">
                    <p className="text-white/60 text-sm mb-1">Ticket ID</p>
                    <p className="text-white font-mono font-bold text-lg">{ticket.id}</p>
                </div>

                {/* Important Notice */}
                <div className="p-4 rounded-xl backdrop-blur-lg bg-orange-500/20 border border-orange-400/30">
                    <p className="text-sm text-orange-300 text-center">
                        <strong>Important:</strong> Show this QR code at the venue entrance for verification.
                        Do not share with others.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={handleDownloadQR}
                        icon={<Download size={18} />}
                    >
                        Download QR
                    </Button>
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={handleShare}
                        icon={<Share2 size={18} />}
                    >
                        Share
                    </Button>
                </div>

                {/* Instructions */}
                <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-white/80 font-medium mb-2">Instructions:</p>
                    <ul className="space-y-1 text-sm text-white/70 list-disc list-inside">
                        <li>Arrive at least 30 minutes before the event</li>
                        <li>Carry a valid ID proof along with this QR code</li>
                        <li>Keep your phone charged or carry a printed copy</li>
                        <li>Each QR code can only be scanned once for entry</li>
                    </ul>
                </div>
            </div>
        </Modal>
    );
};

export default TicketQRCode;
