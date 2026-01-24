import { toast } from 'react-toastify';
import { useCallback } from 'react';

export const useToast = () => {
    const showSuccess = useCallback((message) => {
        toast.success(message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }, []);

    const showError = useCallback((message) => {
        toast.error(message, {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }, []);

    const showInfo = useCallback((message) => {
        toast.info(message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }, []);

    const showWarning = useCallback((message) => {
        toast.warning(message, {
            position: 'top-right',
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }, []);

    return { showSuccess, showError, showInfo, showWarning };
};
