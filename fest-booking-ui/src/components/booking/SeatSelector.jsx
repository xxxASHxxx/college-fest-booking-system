import React, { useState } from 'react';
import { Plus, Minus, Tag } from 'lucide-react';
import { validateForm } from '../../utils/validators';
import { useToast } from '../../hooks/useToast';
import bookingService from '../../services/bookingService';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

const SeatSelector = ({ event, bookingData, setBookingData, onNext }) => {
    const [contactInfo, setContactInfo] = useState(bookingData.contactInfo);
    const [promoCode, setPromoCode] = useState('');
    const [applyingPromo, setApplyingPromo] = useState(false);
    const [errors, setErrors] = useState({});
    const { showSuccess, showError } = useToast();

    const seatTypes = [
        { value: 'general', label: 'General', price: event.price, available: event.availableSeats },
        { value: 'vip', label: 'VIP', price: event.price * 1.5, available: Math.floor(event.availableSeats * 0.2) },
        { value: 'premium', label: 'Premium', price: event.price * 2, available: Math.floor(event.availableSeats * 0.1) },
    ];

    const selectedSeatType = seatTypes.find((st) => st.value === bookingData.seatType);
    const maxQuantity = Math.min(selectedSeatType?.available || 0, 10);

    const handleQuantityChange = (change) => {
        const newQuantity = bookingData.quantity + change;
        if (newQuantity >= 1 && newQuantity <= maxQuantity) {
            setBookingData((prev) => ({
                ...prev,
                quantity: newQuantity,
            }));
        }
    };

    const handleSeatTypeChange = (type) => {
        setBookingData((prev) => ({
            ...prev,
            seatType: type,
            quantity: 1,
        }));
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContactInfo((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) {
            showError('Please enter a promo code');
            return;
        }

        setApplyingPromo(true);
        try {
            const result = await bookingService.applyPromoCode(promoCode, {
                eventId: event.id,
                quantity: bookingData.quantity,
                seatType: bookingData.seatType,
            });

            if (result.success) {
                setBookingData((prev) => ({
                    ...prev,
                    promoCode,
                    discount: result.data.discount,
                }));
                showSuccess(`Promo code applied! ${result.data.discount}% off`);
            } else {
                showError(result.error);
            }
        } catch (error) {
            showError('Invalid promo code');
        } finally {
            setApplyingPromo(false);
        }
    };

    const handleNext = () => {
        // Validate contact info
        const validation = validateForm(contactInfo, {
            name: { required: true, minLength: 2 },
            email: { required: true, email: true },
            phone: { required: true, phone: true },
        });

        if (!validation.isValid) {
            setErrors(validation.errors);
            showError('Please fill in all required fields correctly');
            return;
        }

        setBookingData((prev) => ({
            ...prev,
            contactInfo,
        }));
        onNext();
    };

    return (
        <Card className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-white">Select Your Tickets</h2>

            {/* Seat Type Selection */}
            <div>
                <label className="block text-sm font-medium text-white/90 mb-3">
                    Select Seat Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {seatTypes.map((type) => (
                        <button
                            key={type.value}
                            onClick={() => handleSeatTypeChange(type.value)}
                            disabled={type.available === 0}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                                bookingData.seatType === type.value
                                    ? 'border-purple-500 backdrop-blur-lg bg-purple-500/20'
                                    : 'border-white/20 backdrop-blur-lg bg-white/5 hover:bg-white/10'
                            } ${type.available === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <p className="text-lg font-bold text-white">{type.label}</p>
                            <p className="text-2xl font-bold text-purple-400 mt-1">
                                ₹{type.price.toFixed(0)}
                            </p>
                            <p className="text-sm text-white/60 mt-1">
                                {type.available === 0 ? 'Sold Out' : `${type.available} available`}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Quantity Selector */}
            <div>
                <label className="block text-sm font-medium text-white/90 mb-3">
                    Number of Tickets
                </label>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={bookingData.quantity <= 1}
                        icon={<Minus size={20} />}
                    />

                    <div className="flex-1 text-center">
            <span className="text-4xl font-bold text-white">
              {bookingData.quantity}
            </span>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => handleQuantityChange(1)}
                        disabled={bookingData.quantity >= maxQuantity}
                        icon={<Plus size={20} />}
                    />
                </div>
                <p className="text-sm text-white/60 text-center mt-2">
                    Maximum {maxQuantity} tickets per booking
                </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 pt-6 border-t border-white/10">
                <h3 className="text-xl font-bold text-white">Contact Information</h3>

                <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    value={contactInfo.name}
                    onChange={handleContactChange}
                    placeholder="John Doe"
                    error={errors.name}
                    required
                />

                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleContactChange}
                    placeholder="you@example.com"
                    error={errors.email}
                    required
                />

                <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleContactChange}
                    placeholder="9876543210"
                    error={errors.phone}
                    required
                />
            </div>

            {/* Promo Code */}
            <div className="pt-6 border-t border-white/10">
                <label className="block text-sm font-medium text-white/90 mb-3">
                    Have a promo code?
                </label>
                <div className="flex gap-3">
                    <Input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE"
                        icon={<Tag size={20} />}
                        className="flex-1"
                    />
                    <Button
                        variant="outline"
                        onClick={handleApplyPromo}
                        loading={applyingPromo}
                        disabled={!promoCode.trim()}
                    >
                        Apply
                    </Button>
                </div>
            </div>

            {/* Action */}
            <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleNext}
            >
                Continue to Payment
            </Button>
        </Card>
    );
};

export default SeatSelector;
