import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
    // Get initial value from localStorage or use provided initial value
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return initialValue;
        }
    });

    // Update localStorage when value changes
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }, [key, storedValue]);

    // Update value
    const setValue = useCallback((value) => {
        setStoredValue((prev) => {
            const newValue = value instanceof Function ? value(prev) : value;
            return newValue;
        });
    }, []);

    // Remove value
    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
};
