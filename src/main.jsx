// Entry point - re-exports from fest-booking-ui
import React from 'react';
import ReactDOM from 'react-dom/client';
import '../fest-booking-ui/src/index.css';
import App from '../fest-booking-ui/src/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
