import { useState, useCallback } from 'react';

export const useApi = (apiFunc) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(
        async (...params) => {
            try {
                setLoading(true);
                setError(null);
                const result = await apiFunc(...params);

                if (result.success) {
                    setData(result.data);
                    return { success: true, data: result.data };
                } else {
                    setError(result.error);
                    return { success: false, error: result.error };
                }
            } catch (err) {
                const errorMsg = err.message || 'An error occurred';
                setError(errorMsg);
                return { success: false, error: errorMsg };
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
