import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { CartProvider } from './contexts/CartContext';
import AppRoutes from './routes';
import ScrollToTop from './components/common/ScrollToTop';
import { initializeAnalytics } from './utils/analytics';
import './App.css';

function App() {
    useEffect(() => {
        // Initialize analytics
        initializeAnalytics();

        // Set page title
        document.title = 'FestBook - College Event Booking Platform';

        // Log app version
        console.log('FestBook v1.0.0');
    }, []);

    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <ToastProvider>
                        <CartProvider>
                            <ScrollToTop />
                            <AppRoutes />
                        </CartProvider>
                    </ToastProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
