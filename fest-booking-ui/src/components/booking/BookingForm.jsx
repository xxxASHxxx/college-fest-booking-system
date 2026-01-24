import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { BOOKING_TIMER } from '../../utils/constants';
import SeatSelector from './SeatSelector';
import PaymentForm from './PaymentForm';
import BookingConfirmation from './BookingConfirmation';
import BookingSummary from './BookingSummary';
import Button from '../common/Button';
import Card from '../common/Card';

const BookingForm = ({ event }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        eventId: event.id,
        quantity: 1,
        seatType: 'general',
        selectedSeats: [],
        contactInfo: {
            name: '',
            email: '',
            phone: '',
        },
        promoCode: '',
        discount: 0,
    });
    const [timeRemaining, setTimeRemaining] = useState(BOOKING_TIMER * 60);
    const [bookingId, setBookingId] = useState(null);

    const { user, isAuthenticated } = useAuth();
    const { showError, showWarning } = useToast();
    const navigate = useNavigate();

    // Timer countdown
    useEffect(() => {
        if (currentStep === 1 || currentStep === 2) {
            const interval = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        showWarning('Booking time expired. Please start again.');
                        navigate(`/events/${event.id}`);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [currentStep, event.id, navigate, showWarning]);

    // Pre-fill user data
    useEffect(() => {
        if (user && isAuthenticated) {
            setBookingData((prev) => ({
                ...prev,
                contactInfo: {
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                },
            }));
        }
    }, [user, isAuthenticated]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleNext = () => {
        if (currentStep === 1) {
            if (bookingData.quantity < 1) {
                showError('Please select at least one ticket');
                return;
            }
        }
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleBookingComplete = (id) => {
        setBookingId(id);
        setCurrentStep(3);
    };

    const steps = [
        { number: 1, title: 'Select Tickets' },
        { number: 2, title: 'Payment' },
        { number: 3, title: 'Confirmation' },
    ];

    return (
        <div className="space-y-6">
            {/* Progress Stepper */}
            <Card className="p-6">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                                        currentStep >= step.number
                                            ? 'backdrop-blur-lg bg-purple-500 text-white border-2 border-purple-400'
                                            : 'backdrop-blur-lg bg-white/10 text-white/60 border-2 border-white/20'
                                    }`}
                                >
                                    {currentStep > step.number ? '✓' : step.number}
                                </div>
                                <span
                                    className={`mt-2 text-sm font-medium ${
                                        currentStep >= step.number ? 'text-white' : 'text-white/60'
                                    }`}
                                >
                  {step.title}
                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-1 mx-4 rounded transition-all ${
                                        currentStep > step.number
                                            ? 'bg-purple-500'
                                            : 'bg-white/20'
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Timer */}
                {currentStep < 3 && (
                    <div className="mt-6 flex items-center justify-center gap-2 text-orange-400">
                        <Clock size={20} />
                        <span className="font-mono text-lg font-bold">
              Time remaining: {formatTime(timeRemaining)}
            </span>
                    </div>
                )}
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    {currentStep === 1 && (
                        <SeatSelector
                            event={event}
                            bookingData={bookingData}
                            setBookingData={setBookingData}
                            onNext={handleNext}
                        />
                    )}

                    {currentStep === 2 && (
                        <PaymentForm
                            event={event}
                            bookingData={bookingData}
                            onBack={handleBack}
                            onComplete={handleBookingComplete}
                        />
                    )}

                    {currentStep === 3 && (
                        <BookingConfirmation
                            bookingId={bookingId}
                            event={event}
                            bookingData={bookingData}
                        />
                    )}
                </div>

                {/* Sidebar Summary */}
                {currentStep < 3 && (
                    <div className="lg:col-span-1">
                        <BookingSummary
                            event={event}
                            bookingData={bookingData}
                            currentStep={currentStep}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingForm;
