import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);

        // Set initial value
        setMatches(media.matches);

        // Define listener
        const listener = (e) => setMatches(e.matches);

        // Add listener
        if (media.addEventListener) {
            media.addEventListener('change', listener);
        } else {
            media.addListener(listener);
        }

        // Cleanup
        return () => {
            if (media.removeEventListener) {
                media.removeEventListener('change', listener);
            } else {
                media.removeListener(listener);
            }
        };
    }, [query]);

    return matches;
};

// Predefined breakpoints
export const useBreakpoint = () => {
    const isMobile = useMediaQuery('(max-width: 639px)');
    const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    return {
        isMobile,
        isTablet,
        isDesktop,
    };
};
