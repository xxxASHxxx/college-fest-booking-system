import React, { useState } from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import bookingService from '../../services/bookingService';
import { formatCurrency } from '../../utils/formatters';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

const TicketCancelModal = ({ isOpen, onClose, ticket }) => {
    const [reason, setReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState('');
    const { showSuccess, showError } = useToast();

    const refundAmount = ticket.amount * 0.8; // 80% refund (20% cancellation fee)
    const cancellationFee = ticket.amount * 0.2;

    const handleCancel = async () => {
        if (!reason.trim()) {
            setErrors('Please provide a reason for cancellation');
            return;
        }

        if (reason.trim().length < 10) {
            setErrors('Reason must be at least 10 characters long');
            return;
        }

        setIsProcessing(true);

        try {
            const result = await bookingService.cancelBooking(ticket.bookingId, reason);

            if (result.success) {
                showSuccess('Ticket cancelled successfully. Refund will be processed in 5-7 business days.');
                onClose();
                // Reload page to reflect changes
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                showError(result.error || 'Failed to cancel ticket');
            }
        } catch (error) {
            showError('Cancellation failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Cancel Ticket"
            size="md"
        >
            <div className="space-y-6">
                {/* Warning */}
                <div className="flex items-start gap-3 p-4 rounded-xl backdrop-blur-lg bg-red-500/20 border border-red-400/30">
                    <AlertTriangle size={24} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-300">
                        <p className="font-medium mb-1">Are you sure you want to cancel this ticket?</p>
                        <p className="text-red-200/80">
                            This action cannot be undone. Please review the refund policy below before proceeding.
                        </p>
                    </div>
                </div>

                {/* Ticket Info */}
                <div className="p-4 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10">
                    <p className="text-white font-bold mb-2">{ticket.event.name}</p>
                    <p className="text-sm text-white/70">Ticket ID: {ticket.id}</p>
                    <p className="text-sm text-white/70 capitalize">Seat Type: {ticket.seatType}</p>
                </div>

                {/* Refund Breakdown */}
                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white">Refund Breakdown</h3>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between text-white/80">
                            <span>Original Amount</span>
                            <span>{formatCurrency(ticket.amount)}</span>
                        </div>

                        <div className="flex items-center justify-between text-red-400">
                            <span>Cancellation Fee (20%)</span>
                            <span>-{formatCurrency(cancellationFee)}</span>
                        </div>

                        <div className="border-t border-white/10 my-2" />

                        <div className="flex items-center justify-between text-white font-bold text-lg">
                            <span>Refund Amount</span>
                            <span className="text-green-400">{formatCurrency(refundAmount)}</span>
                        </div>
                    </div>

                    <p className="text-xs text-white/60 mt-2">
                        * Refund will be processed to your original payment method within 5-7 business days
                    </p>
                </div>

                {/* Cancellation Reason */}
                <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                        Reason for Cancellation *
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            setErrors('');
                        }}
                        placeholder="Please tell us why you're cancelling this ticket..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                    {errors && (
                        <p className="mt-1.5 text-sm text-red-400">{errors}</p>
                    )}
                    <p className="text-xs text-white/60 mt-1">Minimum 10 characters required</p>
                </div>

                {/* Cancellation Policy */}
                <div className="p-4 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10">
                    <h4 className="text-sm font-bold text-white mb-2">Cancellation Policy</h4>
                    <ul className="space-y-1 text-xs text-white/70 list-disc list-inside">
                        <li>20% cancellation fee will be deducted from the refund amount</li>
                        <li>Refunds are processed within 5-7 business days</li>
                        <li>Cancellation is not allowed 24 hours before the event</li>
                        <li>No refunds for no-shows or partial attendance</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={onClose}
                        disabled={isProcessing}
                    >
                        Keep Ticket
                    </Button>
                    <Button
                        variant="danger"
                        fullWidth
                        onClick={handleCancel}
                        loading={isProcessing}
                        disabled={isProcessing}
                        icon={<XCircle size={18} />}
                    >
                        {isProcessing ? 'Cancelling...' : 'Cancel Ticket'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default TicketCancelModal;
