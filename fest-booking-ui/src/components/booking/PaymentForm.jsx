import React, { useState } from 'react';
import { CreditCard, Smartphone, Building2, Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import bookingService from '../../services/bookingService';
import { validateForm, isValidCardNumber, isValidCVV, isValidExpiryDate } from '../../utils/validators';
import { calculateTotal, generateBookingId } from '../../utils/helpers';
import { PAYMENT_METHODS } from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import Loader from '../common/Loader';

const PaymentForm = ({ event, bookingData, onBack, onComplete }) => {
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CARD);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
    });
    const [upiId, setUpiId] = useState('');
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const { user } = useAuth();
    const { showSuccess, showError } = useToast();

    const seatTypes = {
        general: event.price,
        vip: event.price * 1.5,
        premium: event.price * 2,
    };

    const basePrice = seatTypes[bookingData.seatType];
    const pricing = calculateTotal(basePrice, bookingData.quantity);

    // Apply discount if any
    let finalAmount = pricing.total;
    let discountAmount = 0;
    if (bookingData.discount > 0) {
        discountAmount = (pricing.subtotal * bookingData.discount) / 100;
        finalAmount = pricing.subtotal - discountAmount + pricing.tax + pricing.serviceFee;
    }

    const paymentOptions = [
        {
            id: PAYMENT_METHODS.CARD,
            label: 'Credit/Debit Card',
            icon: CreditCard,
            description: 'Visa, Mastercard, RuPay',
        },
        {
            id: PAYMENT_METHODS.UPI,
            label: 'UPI',
            icon: Smartphone,
            description: 'Google Pay, PhonePe, Paytm',
        },
        {
            id: PAYMENT_METHODS.NET_BANKING,
            label: 'Net Banking',
            icon: Building2,
            description: 'All major banks',
        },
        {
            id: PAYMENT_METHODS.WALLET,
            label: 'Wallet',
            icon: Wallet,
            description: 'Paytm, PhonePe, Amazon Pay',
        },
    ];

    const handleCardDetailsChange = (e) => {
        let { name, value } = e.target;

        // Format card number with spaces
        if (name === 'cardNumber') {
            value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            if (value.length > 19) return;
        }

        // Format expiry date
        if (name === 'expiryDate') {
            value = value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            if (value.length > 5) return;
        }

        // Format CVV
        if (name === 'cvv') {
            value = value.replace(/\D/g, '');
            if (value.length > 4) return;
        }

        setCardDetails((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validatePaymentDetails = () => {
        if (paymentMethod === PAYMENT_METHODS.CARD) {
            const validation = validateForm(cardDetails, {
                cardNumber: { required: true },
                cardHolder: { required: true, minLength: 3 },
                expiryDate: { required: true },
                cvv: { required: true },
            });

            if (!validation.isValid) {
                setErrors(validation.errors);
                return false;
            }

            // Validate card number
            const cleanCardNumber = cardDetails.cardNumber.replace(/\s/g, '');
            if (!isValidCardNumber(cleanCardNumber)) {
                setErrors({ cardNumber: 'Invalid card number' });
                return false;
            }

            // Validate expiry date
            if (!isValidExpiryDate(cardDetails.expiryDate)) {
                setErrors({ expiryDate: 'Card has expired or invalid date' });
                return false;
            }

            // Validate CVV
            if (!isValidCVV(cardDetails.cvv)) {
                setErrors({ cvv: 'Invalid CVV' });
                return false;
            }
        }

        if (paymentMethod === PAYMENT_METHODS.UPI) {
            if (!upiId.trim() || !upiId.includes('@')) {
                setErrors({ upiId: 'Invalid UPI ID' });
                return false;
            }
        }

        if (!agreeToTerms) {
            showError('Please agree to the terms and conditions');
            return false;
        }

        return true;
    };

    const handlePayment = async () => {
        if (!validatePaymentDetails()) {
            return;
        }

        setIsProcessing(true);

        try {
            // Create booking
            const bookingPayload = {
                eventId: event.id,
                userId: user.id,
                quantity: bookingData.quantity,
                seatType: bookingData.seatType,
                contactName: bookingData.contactInfo.name,
                contactEmail: bookingData.contactInfo.email,
                contactPhone: bookingData.contactInfo.phone,
                promoCode: bookingData.promoCode || null,
                totalAmount: finalAmount,
                paymentMethod,
            };

            const bookingResult = await bookingService.createBooking(bookingPayload);

            if (!bookingResult.success) {
                throw new Error(bookingResult.error);
            }

            const bookingId = bookingResult.data.id;

            // Simulate payment processing (Replace with actual payment gateway integration)
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Verify payment
            const paymentData = {
                bookingId,
                paymentMethod,
                amount: finalAmount,
                transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                status: 'SUCCESS',
            };

            const verifyResult = await bookingService.verifyPayment(paymentData);

            if (verifyResult.success) {
                showSuccess('Payment successful! Your booking is confirmed.');
                onComplete(bookingId);
            } else {
                throw new Error('Payment verification failed');
            }
        } catch (error) {
            showError(error.message || 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isProcessing) {
        return (
            <Card className="p-12">
                <Loader size="lg" text="Processing your payment..." />
                <p className="text-center text-white/70 mt-4">
                    Please do not close or refresh this page
                </p>
            </Card>
        );
    }

    return (
        <Card className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-white">Payment Details</h2>

            {/* Payment Method Selection */}
            <div>
                <label className="block text-sm font-medium text-white/90 mb-3">
                    Select Payment Method
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                            <button
                                key={option.id}
                                onClick={() => setPaymentMethod(option.id)}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${
                                    paymentMethod === option.id
                                        ? 'border-purple-500 backdrop-blur-lg bg-purple-500/20'
                                        : 'border-white/20 backdrop-blur-lg bg-white/5 hover:bg-white/10'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <Icon size={24} className="text-purple-400 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-white">{option.label}</p>
                                        <p className="text-sm text-white/60 mt-1">{option.description}</p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Payment Forms */}
            <div className="pt-6 border-t border-white/10">
                {paymentMethod === PAYMENT_METHODS.CARD && (
                    <div className="space-y-4">
                        <Input
                            label="Card Number"
                            type="text"
                            name="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={handleCardDetailsChange}
                            placeholder="1234 5678 9012 3456"
                            error={errors.cardNumber}
                            required
                        />

                        <Input
                            label="Cardholder Name"
                            type="text"
                            name="cardHolder"
                            value={cardDetails.cardHolder}
                            onChange={handleCardDetailsChange}
                            placeholder="JOHN DOE"
                            error={errors.cardHolder}
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Expiry Date"
                                type="text"
                                name="expiryDate"
                                value={cardDetails.expiryDate}
                                onChange={handleCardDetailsChange}
                                placeholder="MM/YY"
                                error={errors.expiryDate}
                                required
                            />

                            <Input
                                label="CVV"
                                type="password"
                                name="cvv"
                                value={cardDetails.cvv}
                                onChange={handleCardDetailsChange}
                                placeholder="123"
                                error={errors.cvv}
                                maxLength={4}
                                required
                            />
                        </div>

                        {/* Security Notice */}
                        <div className="flex items-start gap-3 p-4 rounded-xl backdrop-blur-lg bg-green-500/20 border border-green-400/30">
                            <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-green-300">
                                <p className="font-medium">Secure Payment</p>
                                <p className="text-green-200/80 mt-1">
                                    Your card details are encrypted and secure. We never store your CVV.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {paymentMethod === PAYMENT_METHODS.UPI && (
                    <div className="space-y-4">
                        <Input
                            label="UPI ID"
                            type="text"
                            name="upiId"
                            value={upiId}
                            onChange={(e) => {
                                setUpiId(e.target.value);
                                if (errors.upiId) {
                                    setErrors((prev) => ({ ...prev, upiId: '' }));
                                }
                            }}
                            placeholder="yourname@upi"
                            error={errors.upiId}
                            helperText="Enter your UPI ID (e.g., 9876543210@paytm)"
                            required
                        />

                        <div className="p-4 rounded-xl backdrop-blur-lg bg-blue-500/20 border border-blue-400/30">
                            <p className="text-sm text-blue-300">
                                You will be redirected to your UPI app to complete the payment.
                            </p>
                        </div>
                    </div>
                )}

                {paymentMethod === PAYMENT_METHODS.NET_BANKING && (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-white/90 mb-3">
                            Select Your Bank
                        </label>
                        <select className="w-full px-4 py-2.5 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="">Choose your bank</option>
                            <option value="sbi">State Bank of India</option>
                            <option value="hdfc">HDFC Bank</option>
                            <option value="icici">ICICI Bank</option>
                            <option value="axis">Axis Bank</option>
                            <option value="kotak">Kotak Mahindra Bank</option>
                            <option value="pnb">Punjab National Bank</option>
                        </select>

                        <div className="p-4 rounded-xl backdrop-blur-lg bg-blue-500/20 border border-blue-400/30">
                            <p className="text-sm text-blue-300">
                                You will be redirected to your bank's secure payment gateway.
                            </p>
                        </div>
                    </div>
                )}

                {paymentMethod === PAYMENT_METHODS.WALLET && (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-white/90 mb-3">
                            Select Your Wallet
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {['Paytm', 'PhonePe', 'Amazon Pay', 'Google Pay'].map((wallet) => (
                                <button
                                    key={wallet}
                                    className="p-4 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all text-white font-medium"
                                >
                                    {wallet}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Terms Agreement */}
            <div className="pt-6 border-t border-white/10">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="w-5 h-5 mt-0.5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-sm text-white/80 leading-relaxed">
            I agree to the{' '}
                        <a href="/terms" target="_blank" className="text-purple-400 hover:text-purple-300">
              Terms & Conditions
            </a>{' '}
                        and{' '}
                        <a href="/privacy" target="_blank" className="text-purple-400 hover:text-purple-300">
              Privacy Policy
            </a>
            . I understand that this payment is non-refundable.
          </span>
                </label>
            </div>

            {/* Important Notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl backdrop-blur-lg bg-orange-500/20 border border-orange-400/30">
                <AlertCircle size={20} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-300">
                    <p className="font-medium">Important</p>
                    <p className="text-orange-200/80 mt-1">
                        Please verify all booking details before proceeding. Tickets are non-refundable and non-transferable.
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
                <Button
                    variant="outline"
                    onClick={onBack}
                    disabled={isProcessing}
                    className="flex-1"
                >
                    Back
                </Button>
                <Button
                    variant="primary"
                    onClick={handlePayment}
                    disabled={isProcessing}
                    loading={isProcessing}
                    className="flex-1"
                >
                    Pay {finalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </Button>
            </div>
        </Card>
    );
};

export default PaymentForm;
