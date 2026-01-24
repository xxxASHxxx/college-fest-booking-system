import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import './NotFoundPage.css';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="not-found-container">
                <div className="not-found-content">
                    <div className="error-code">404</div>
                    <h1 className="error-title">Page Not Found</h1>
                    <p className="error-message">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>

                    <div className="error-actions">
                        <Button
                            size="large"
                            icon={<FiHome />}
                            onClick={() => navigate('/')}
                        >
                            Go Home
                        </Button>
                        <Button
                            size="large"
                            variant="outline"
                            icon={<FiArrowLeft />}
                            onClick={() => navigate(-1)}
                        >
                            Go Back
                        </Button>
                    </div>
                </div>

                <div className="error-illustration">
                    <div className="illustration-circle"></div>
                    <div className="illustration-text">🎪</div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
