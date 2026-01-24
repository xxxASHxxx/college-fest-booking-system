import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            style={{
                zIndex: 9999,
            }}
            toastClassName="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl"
            bodyClassName="text-white"
            progressClassName="bg-gradient-to-r from-purple-500 to-blue-500"
        />
    );
};

export default Toast;
