import React from 'react';
import { Calendar, MapPin, Users, Tag, Receipt } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { calculateTotal } from '../../utils/helpers';
import Card from '../common/Card';

const BookingSummary = ({ event, bookingData, currentStep }) => {
    const seatTypes = {
        general: { label: 'General', price: event.price },
        vip: { label: 'VIP', price: event.price * 1.5 },
        premium: { label: 'Premium', price: event.price * 2 },
    };

    const selectedSeatType = seatTypes[bookingData.seatType];
    const basePrice = selectedSeatType.price;
    const pricing = calculateTotal(basePrice, bookingData.quantity);

    // Apply discount if any
    let finalAmount = pricing.total;
    let discountAmount = 0;
    if (bookingData.discount > 0) {
        discountAmount = (pricing.subtotal * bookingData.discount) / 100;
        finalAmount = pricing.subtotal - discountAmount + pricing.tax + pricing.serviceFee;
    }

    return (
        <div className="space-y-4 sticky top-24">
            {/* Event Summary */}
            <Card className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Receipt size={20} className="text-purple-400" />
                    Booking Summary
                </h3>

                {/* Event Image */}
                <div className="relative h-32 rounded-xl overflow-hidden">
                    <img
                        src={event.image || '/images/placeholder-event.jpg'}
                        alt={event.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white font-bold text-sm line-clamp-2">{event.name}</p>
                    </div>
                </div>

                {/* Event Details */}
                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2 text-white/80">
                        <Calendar size={16} className="mt-0.5 flex-shrink-0 text-purple-400" />
                        <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-start gap-2 text-white/80">
                        <MapPin size={16} className="mt-0.5 flex-shrink-0 text-purple-400" />
                        <span className="line-clamp-2">{event.venue}</span>
                    </div>
                    {currentStep >= 1 && bookingData.quantity > 0 && (
                        <div className="flex items-start gap-2 text-white/80">
                            <Users size={16} className="mt-0.5 flex-shrink-0 text-purple-400" />
                            <span>
                {bookingData.quantity} × {selectedSeatType.label} Ticket
                                {bookingData.quantity > 1 ? 's' : ''}
              </span>
                        </div>
                    )}
                </div>
            </Card>

            {/* Price Breakdown */}
            {currentStep >= 1 && bookingData.quantity > 0 && (
                <Card className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white">Price Details</h3>

                    <div className="space-y-3 text-sm">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between text-white/80">
              <span>
                {selectedSeatType.label} × {bookingData.quantity}
              </span>
                            <span>{formatCurrency(pricing.subtotal)}</span>
                        </div>

                        {/* Discount */}
                        {bookingData.discount > 0 && (
                            <div className="flex items-center justify-between text-green-400">
                <span className="flex items-center gap-1">
                  <Tag size={14} />
                  Promo Discount ({bookingData.discount}%)
                </span>
                                <span>-{formatCurrency(discountAmount)}</span>
                            </div>
                        )}

                        {/* Tax */}
                        <div className="flex items-center justify-between text-white/80">
                            <span>GST ({pricing.breakdown.taxRate})</span>
                            <span>{formatCurrency(pricing.tax)}</span>
                        </div>

                        {/* Service Fee */}
                        <div className="flex items-center justify-between text-white/80">
                            <span>Convenience Fee</span>
                            <span>{formatCurrency(pricing.serviceFee)}</span>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-white/10 my-2" />

                        {/* Total */}
                        <div className="flex items-center justify-between text-white font-bold text-lg">
                            <span>Total Amount</span>
                            <span>{formatCurrency(finalAmount)}</span>
                        </div>
                    </div>
                </Card>
            )}

            {/* Contact Info (Step 2+) */}
            {currentStep >= 2 && bookingData.contactInfo.name && (
                <Card className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-white">Contact Details</h3>
                    <div className="space-y-2 text-sm text-white/80">
                        <p>
                            <span className="text-white/60">Name: </span>
                            {bookingData.contactInfo.name}
                        </p>
                        <p>
                            <span className="text-white/60">Email: </span>
                            {bookingData.contactInfo.email}
                        </p>
                        <p>
                            <span className="text-white/60">Phone: </span>
                            {bookingData.contactInfo.phone}
                        </p>
                    </div>
                </Card>
            )}

            {/* Security Badge */}
            <div className="p-4 rounded-xl backdrop-blur-lg bg-green-500/20 border border-green-400/30 text-center">
                <p className="text-sm text-green-300 font-medium">🔒 Secure & Encrypted</p>
                <p className="text-xs text-green-200/80 mt-1">
                    Your payment information is protected
                </p>
            </div>
        </div>
    );
};

export default BookingSummary;
