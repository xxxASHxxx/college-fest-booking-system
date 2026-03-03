import React, { useState } from 'react';
import { CreditCard, Smartphone, Building2, Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { validateForm, isValidCardNumber, isValidCVV, isValidExpiryDate } from '../../utils/validators';
import { PAYMENT_METHODS } from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import Loader from '../common/Loader';

// PaymentForm: collects and validates payment details, then calls onSubmit({ method })
// Actual booking API call happens in BookingPage.handleBookingSubmit — this component
// only handles the payment UI and simulated processing delay.
const PaymentForm = ({ event, bookingData, onBack, onSubmit, submitting: externalSubmitting }) => {
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

    const { showError } = useToast();

    // Calculate total from selected tier in event
    const getAmount = () => {
        if (!event || !bookingData) return 0;
        const qty = bookingData.quantity || 1;
        // Try to find the selected tier
        if (bookingData.priceTierId && event.priceTiers) {
            const tier = event.priceTiers.find((t) => t.id === bookingData.priceTierId);
            if (tier) return parseFloat(tier.price) * qty;
        }
        // Fallback to first tier
        if (event.priceTiers && event.priceTiers.length > 0) {
            return parseFloat(event.priceTiers[0].price) * qty;
        }
        // Fallback to event.price
        return (parseFloat(event.price) || 0) * qty;
    };

    const totalAmount = getAmount();

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

        if (name === 'cardNumber') {
            value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            if (value.length > 19) return;
        }
        if (name === 'expiryDate') {
            value = value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            if (value.length > 5) return;
        }
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

            const cleanCardNumber = cardDetails.cardNumber.replace(/\s/g, '');
            if (!isValidCardNumber(cleanCardNumber)) {
                setErrors({ cardNumber: 'Invalid card number' });
                return false;
            }

            if (!isValidExpiryDate(cardDetails.expiryDate)) {
                setErrors({ expiryDate: 'Card has expired or invalid date' });
                return false;
            }

            if (!isValidCVV(cardDetails.cvv)) {
                setErrors({ cvv: 'Invalid CVV' });
                return false;
            }
        }

        if (paymentMethod === PAYMENT_METHODS.UPI) {
            if (!upiId.trim() || !upiId.includes('@')) {
                setErrors({ upiId: 'Invalid UPI ID (e.g. name@upi)' });
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
        if (!validatePaymentDetails()) return;

        setIsProcessing(true);

        // Simulate processing delay for realism
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsProcessing(false);

        // Delegate actual API call to BookingPage
        if (onSubmit) {
            onSubmit({ method: paymentMethod });
        }
    };

    const isLoading = isProcessing || externalSubmitting;

    if (isLoading) {
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
                                className={`p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === option.id
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
                                if (errors.upiId) setErrors((prev) => ({ ...prev, upiId: '' }));
                            }}
                            placeholder="yourname@upi"
                            error={errors.upiId}
                            helperText="Enter your UPI ID (e.g., 9876543210@paytm)"
                            required
                        />
                        <div className="p-4 rounded-xl backdrop-blur-lg bg-blue-500/20 border border-blue-400/30">
                            <p className="text-sm text-blue-300">
                                Payment will be processed instantly via UPI.
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
                                Payment will be processed via your selected bank.
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
                            Terms &amp; Conditions
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
                    disabled={isLoading}
                    className="flex-1"
                >
                    Back
                </Button>
                <Button
                    variant="primary"
                    onClick={handlePayment}
                    disabled={isLoading}
                    loading={isLoading}
                    className="flex-1"
                >
                    Pay {totalAmount > 0
                        ? totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
                        : ''}
                </Button>
            </div>
        </Card>
    );
};

export default PaymentForm;
