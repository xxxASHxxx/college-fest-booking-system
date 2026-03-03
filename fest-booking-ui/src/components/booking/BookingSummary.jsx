import React from 'react';
import { Calendar, MapPin, Users, Receipt } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';
import Card from '../common/Card';

const BookingSummary = ({ event, bookingData, currentStep }) => {
    // Resolve the price for the selected tier
    const getBasePrice = () => {
        if (bookingData.priceTierId && event?.priceTiers) {
            const tier = event.priceTiers.find((t) => t.id === bookingData.priceTierId);
            if (tier) return parseFloat(tier.price);
        }
        if (event?.priceTiers && event.priceTiers.length > 0) {
            return parseFloat(event.priceTiers[0].price);
        }
        return parseFloat(event?.price) || 0;
    };

    const basePrice = getBasePrice();
    const qty = bookingData.quantity || 1;
    const subtotal = basePrice * qty;

    // Contact info is stored as userDetails in BookingPage
    const contactInfo = bookingData.userDetails || bookingData.contactInfo;

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
                        src={event?.bannerImageUrl || event?.coverImage || event?.image || '/images/placeholder-event.jpg'}
                        alt={event?.eventName || event?.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white font-bold text-sm line-clamp-2">
                            {event?.eventName || event?.name}
                        </p>
                    </div>
                </div>

                {/* Event Details */}
                <div className="space-y-3 text-sm">
                    {(event?.startDate || event?.eventDate || event?.date) && (
                        <div className="flex items-start gap-2 text-white/80">
                            <Calendar size={16} className="mt-0.5 flex-shrink-0 text-purple-400" />
                            <span>{formatDate(event.startDate || event.eventDate || event.date)}</span>
                        </div>
                    )}
                    {event?.venue && (
                        <div className="flex items-start gap-2 text-white/80">
                            <MapPin size={16} className="mt-0.5 flex-shrink-0 text-purple-400" />
                            <span className="line-clamp-2">
                                {typeof event.venue === 'object' ? (event.venue.venueName || event.venue.name) : event.venue}
                            </span>
                        </div>
                    )}
                    {currentStep >= 1 && qty > 0 && (
                        <div className="flex items-start gap-2 text-white/80">
                            <Users size={16} className="mt-0.5 flex-shrink-0 text-purple-400" />
                            <span>
                                {qty} × {bookingData.seatType || 'general'}
                            </span>
                        </div>
                    )}
                </div>
            </Card>

            {/* Price Breakdown */}
            {currentStep >= 1 && qty > 0 && subtotal > 0 && (
                <Card className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white">Price Details</h3>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between text-white/80">
                            <span>{bookingData.seatType || 'Ticket'} × {qty}</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>

                        <div className="border-t border-white/10 my-2" />

                        <div className="flex items-center justify-between text-white font-bold text-lg">
                            <span>Total Amount</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                    </div>
                </Card>
            )}

            {/* Contact Info (Step 2+) */}
            {currentStep >= 2 && contactInfo?.name && (
                <Card className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-white">Contact Details</h3>
                    <div className="space-y-2 text-sm text-white/80">
                        <p>
                            <span className="text-white/60">Name: </span>
                            {contactInfo.name}
                        </p>
                        <p>
                            <span className="text-white/60">Email: </span>
                            {contactInfo.email}
                        </p>
                        <p>
                            <span className="text-white/60">Phone: </span>
                            {contactInfo.phone}
                        </p>
                    </div>
                </Card>
            )}

            {/* Security Badge */}
            <div className="p-4 rounded-xl backdrop-blur-lg bg-green-500/20 border border-green-400/30 text-center">
                <p className="text-sm text-green-300 font-medium">🔒 Secure &amp; Encrypted</p>
                <p className="text-xs text-green-200/80 mt-1">
                    Your payment information is protected
                </p>
            </div>
        </div>
    );
};

export default BookingSummary;
