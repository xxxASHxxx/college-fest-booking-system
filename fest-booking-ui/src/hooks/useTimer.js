import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimer = (initialSeconds = 0, autoStart = false) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(autoStart);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSeconds((prev) => {
                    if (prev <= 0) {
                        setIsRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    const start = useCallback(() => {
        setIsRunning(true);
    }, []);

    const pause = useCallback(() => {
        setIsRunning(false);
    }, []);

    const reset = useCallback((newSeconds = initialSeconds) => {
        setSeconds(newSeconds);
        setIsRunning(false);
    }, [initialSeconds]);

    const restart = useCallback(() => {
        setSeconds(initialSeconds);
        setIsRunning(true);
    }, [initialSeconds]);

    const formatTime = useCallback(() => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, [seconds]);

    return {
        seconds,
        isRunning,
        start,
        pause,
        reset,
        restart,
        formatTime,
    };
};
