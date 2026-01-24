import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { useForm } from '../../hooks/useForm';
import adminService from '../../services/adminService';
import Button from '../../components/common/Button';
import EventForm from '../../components/admin/EventForm';
import { trackPageView } from '../../utils/analytics';
import './CreateEventPage.css';

const CreateEventPage = () => {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        trackPageView('Admin - Create Event');
    }, []);

    const handleSubmit = async (eventData) => {
        setSubmitting(true);
        try {
            const result = await adminService.createEvent(eventData);

            if (result.success) {
                showSuccess('Event created successfully!');
                navigate('/admin/events');
            } else {
                showError(result.error || 'Failed to create event');
            }
        } catch (error) {
            showError('Failed to create event');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure? All changes will be lost.')) {
            navigate('/admin/events');
        }
    };

    return (
        <div className="create-event-page">
            <div className="admin-container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Create New Event</h1>
                        <p className="page-subtitle">Fill in the details to create an event</p>
                    </div>
                </div>

                <div className="form-container">
                    <EventForm
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        submitting={submitting}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateEventPage;
