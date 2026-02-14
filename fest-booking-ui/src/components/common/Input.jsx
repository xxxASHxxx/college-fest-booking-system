import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

const Input = forwardRef(
    (
        {
            label,
            type = 'text',
            name,
            value,
            onChange,
            onBlur,
            placeholder,
            error,
            success,
            disabled = false,
            required = false,
            icon = null,
            className = '',
            helperText = '',
            showPasswordToggle = false,
            darkMode = false,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);

        const inputType = showPasswordToggle && showPassword ? 'text' : type;

        // Dynamic styles based on mode
        const labelClass = darkMode
            ? 'block text-sm font-medium text-gray-200 mb-2'
            : 'block text-sm font-medium text-gray-700 mb-2';

        const iconClass = darkMode
            ? 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            : 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-500';

        const toggleClass = darkMode
            ? 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-accent transition-colors'
            : 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors';

        const helperClass = darkMode
            ? `mt-1.5 text-sm ${error ? 'text-red-400' : 'text-gray-400'}`
            : `mt-1.5 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`;

        const autofillStyle = darkMode
            ? {
                WebkitBoxShadow: '0 0 0 1000px rgba(55, 6, 23, 0.6) inset',
                WebkitTextFillColor: '#F8F8F8',
            }
            : {
                WebkitBoxShadow: '0 0 0 1000px rgba(243, 244, 246, 1) inset',
                WebkitTextFillColor: '#111827',
            };

        const inputBaseClass = darkMode
            ? `
                w-full rounded-xl
                px-4 py-3 placeholder-gray-500
                transition-colors duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-teal-accent
                disabled:opacity-50 disabled:cursor-not-allowed
                ${icon ? 'pl-10' : ''}
                ${showPasswordToggle || error || success ? 'pr-10' : ''}
                ${error ? 'border-red-500 focus:ring-red-500' : ''}
                ${success ? 'border-green-500 focus:ring-green-500' : ''}
                ${!error && !success ? 'hover:border-gray-500' : ''}
            `
            : `
                w-full bg-gray-100 border rounded-xl
                px-4 py-3 text-gray-900 placeholder-gray-500
                transition-colors duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                disabled:opacity-50 disabled:cursor-not-allowed
                ${icon ? 'pl-10' : ''}
                ${showPasswordToggle || error || success ? 'pr-10' : ''}
                ${error ? 'border-red-500 focus:ring-red-500' : ''}
                ${success ? 'border-green-500 focus:ring-green-500' : ''}
                ${!error && !success ? 'border-gray-300 hover:border-gray-400' : ''}
            `;

        const darkInputInlineStyle = darkMode
            ? {
                ...autofillStyle,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#F8F8F8',
            }
            : autofillStyle;

        return (
            <div className={`w-full ${className}`}>
                {/* Label */}
                {label && (
                    <label
                        htmlFor={name}
                        className={labelClass}
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                {/* Input Container */}
                <div className="relative">
                    {/* Icon */}
                    {icon && (
                        <div className={iconClass}>
                            {icon}
                        </div>
                    )}

                    {/* Input Field */}
                    <input
                        ref={ref}
                        type={inputType}
                        name={name}
                        id={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                        style={darkInputInlineStyle}
                        className={inputBaseClass}
                        {...props}
                    />

                    {/* Password Toggle */}
                    {showPasswordToggle && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={toggleClass}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    )}

                    {/* Error/Success Icons */}
                    {error && !showPasswordToggle && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                            <AlertCircle size={20} />
                        </div>
                    )}
                    {success && !showPasswordToggle && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                            <Check size={20} />
                        </div>
                    )}
                </div>

                {/* Helper Text / Error Message */}
                {(helperText || error) && (
                    <p className={helperClass}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
