import { useState, useCallback } from 'react';

export const useApi = (apiFunc) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(
        async (...args) => {
            setLoading(true);
            setError(null);

            try {
                const result = await apiFunc(...args);

                if (result.success) {
                    setData(result.data);
                    return { success: true, data: result.data };
                } else {
                    setError(result.error || 'Request failed');
                    return { success: false, error: result.error };
                }
            } catch (err) {
                const errorMessage = err.message || 'An error occurred';
                setError(errorMessage);
                return { success: false, error: errorMessage };
            } finally {
                setLoading(false);
            }
        },
        [apiFunc]
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, loading, error, execute, reset };
};
