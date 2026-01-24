import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import Button from '../common/Button';
import { FiUpload, FiX } from 'react-icons/fi';
import './EventForm.css';

const EventForm = ({ initialData, onSubmit, onCancel, submitting }) => {
    const [imagePreview, setImagePreview] = useState(initialData?.image || null);

    const validationRules = {
        name: { required: true, minLength: 3 },
        description: { required: true, minLength: 20 },
        category: { required: true },
        date: { required: true },
        venue: { required: true },
        price: { required: true, min: 0 },
        totalSeats: { required: true, min: 1 },
    };

    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        setFieldValue,
    } = useForm(
        initialData || {
            name: '',
            description: '',
            category: '',
            date: '',
            venue: '',
            address: '',
            price: '',
            totalSeats: '',
            duration: '',
            organizer: '',
            featured: false,
        },
        validationRules
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFieldValue('image', file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setFieldValue('image', null);
    };

    const handleFormSubmit = handleSubmit(async (formValues) => {
        await onSubmit(formValues);
    });

    return (
        <form className="event-form" onSubmit={handleFormSubmit}>
            {/* Image Upload */}
            <div className="form-section">
                <h3 className="section-title">Event Image</h3>
                <div className="image-upload">
                    {imagePreview ? (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Event preview" />
                            <button
                                type="button"
                                className="remove-image"
                                onClick={handleRemoveImage}
                            >
                                <FiX />
                            </button>
                        </div>
                    ) : (
                        <label className="upload-label">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                hidden
                            />
                            <FiUpload />
                            <span>Upload Event Image</span>
                        </label>
                    )}
                </div>
            </div>

            {/* Basic Information */}
            <div className="form-section">
                <h3 className="section-title">Basic Information</h3>
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label className="form-label">Event Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            className={`form-input ${errors.name ? 'error' : ''}`}
                            placeholder="Enter event name"
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Description *</label>
                        <textarea
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                            className={`form-textarea ${errors.description ? 'error' : ''}`}
                            placeholder="Enter event description"
                            rows="5"
                        />
                        {errors.description && (
                            <span className="error-message">{errors.description}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category *</label>
                        <select
                            name="category"
                            value={values.category}
                            onChange={handleChange}
                            className={`form-select ${errors.category ? 'error' : ''}`}
                        >
                            <option value="">Select category</option>
                            <option value="music">Music</option>
                            <option value="dance">Dance</option>
                            <option value="drama">Drama</option>
                            <option value="sports">Sports</option>
                            <option value="tech">Tech</option>
                            <option value="art">Art</option>
                            <option value="cultural">Cultural</option>
                            <option value="workshop">Workshop</option>
                        </select>
                        {errors.category && (
                            <span className="error-message">{errors.category}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date & Time *</label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={values.date}
                            onChange={handleChange}
                            className={`form-input ${errors.date ? 'error' : ''}`}
                        />
                        {errors.date && <span className="error-message">{errors.date}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Duration</label>
                        <input
                            type="text"
                            name="duration"
                            value={values.duration}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="e.g., 2 hours"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Organizer</label>
                        <input
                            type="text"
                            name="organizer"
                            value={values.organizer}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter organizer name"
                        />
                    </div>
                </div>
            </div>

            {/* Venue Information */}
            <div className="form-section">
                <h3 className="section-title">Venue Information</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Venue Name *</label>
                        <input
                            type="text"
                            name="venue"
                            value={values.venue}
                            onChange={handleChange}
                            className={`form-input ${errors.venue ? 'error' : ''}`}
                            placeholder="Enter venue name"
                        />
                        {errors.venue && <span className="error-message">{errors.venue}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={values.address}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter venue address"
                        />
                    </div>
                </div>
            </div>

            {/* Pricing & Seating */}
            <div className="form-section">
                <h3 className="section-title">Pricing & Seating</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Price (₹) *</label>
                        <input
                            type="number"
                            name="price"
                            value={values.price}
                            onChange={handleChange}
                            className={`form-input ${errors.price ? 'error' : ''}`}
                            placeholder="Enter price"
                            min="0"
                            step="0.01"
                        />
                        {errors.price && <span className="error-message">{errors.price}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Total Seats *</label>
                        <input
                            type="number"
                            name="totalSeats"
                            value={values.totalSeats}
                            onChange={handleChange}
                            className={`form-input ${errors.totalSeats ? 'error' : ''}`}
                            placeholder="Enter total seats"
                            min="1"
                        />
                        {errors.totalSeats && (
                            <span className="error-message">{errors.totalSeats}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional Options */}
            <div className="form-section">
                <h3 className="section-title">Additional Options</h3>
                <div className="form-options">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="featured"
                            checked={values.featured}
                            onChange={(e) => setFieldValue('featured', e.target.checked)}
                        />
                        <span>Mark as Featured Event</span>
                    </label>
                </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </Button>
                <Button type="submit" loading={submitting}>
                    {initialData ? 'Update Event' : 'Create Event'}
                </Button>
            </div>
        </form>
    );
};

export default EventForm;
