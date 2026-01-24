import React from 'react';

const Loader = ({ size = 'md', text = '', fullScreen = false }) => {
    // Size classes
    const sizes = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4',
        xl: 'w-24 h-24 border-[6px]',
    };

    const sizeClass = sizes[size] || sizes.md;

    const loaderContent = (
        <div className="flex flex-col items-center justify-center gap-4">
            {/* Spinner */}
            <div
                className={`
          ${sizeClass} rounded-full border-white/20
          border-t-white animate-spin
        `}
                role="status"
                aria-label="Loading"
            />

            {/* Loading Text */}
            {text && (
                <p className="text-white/80 text-sm font-medium animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-black/40">
                {loaderContent}
            </div>
        );
    }

    return loaderContent;
};

export default Loader;
