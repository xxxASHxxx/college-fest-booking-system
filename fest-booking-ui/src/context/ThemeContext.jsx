import React, { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');
    const [accentColor, setAccentColor] = useState('purple');

    // Initialize theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const savedAccent = localStorage.getItem('accentColor') || 'purple';

        setTheme(savedTheme);
        setAccentColor(savedAccent);

        // Apply theme to document
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.documentElement.setAttribute('data-accent', savedAccent);
    }, []);

    // Toggle theme
    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }, [theme]);

    // Change accent color
    const changeAccentColor = useCallback((color) => {
        setAccentColor(color);
        localStorage.setItem('accentColor', color);
        document.documentElement.setAttribute('data-accent', color);
    }, []);

    const value = {
        theme,
        accentColor,
        toggleTheme,
        changeAccentColor,
        isDark: theme === 'dark',
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
