import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

const Input = forwardRef((
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
        ...props
    },
    ref
) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle && showPassword ? 'text' : type;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Label */}
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-text-primary mb-2"
                >
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}

            {/* Input Container */}
            <div className="relative">
                {/* Icon */}
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
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
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`
            w-full bg-bg-input border rounded-xl
            px-4 py-3 text-text-primary placeholder-text-muted
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-teal-accent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${showPasswordToggle || error || success ? 'pr-10' : ''}
            ${error ? 'border-error focus:ring-error' : ''}
            ${success ? 'border-success focus:ring-success' : ''}
            ${!error && !success ? 'border-border hover:border-border-light' : ''}
            ${isFocused ? 'bg-bg-card shadow-lg' : ''}
          `}
                    {...props}
                />

                {/* Password Toggle */}
                {showPasswordToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-teal-accent transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}

                {/* Error/Success Icons */}
                {error && !showPasswordToggle && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-error">
                        <AlertCircle size={20} />
                    </div>
                )}
                {success && !showPasswordToggle && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
                        <Check size={20} />
                    </div>
                )}
            </div>

            {/* Helper Text / Error Message */}
            {(helperText || error) && (
                <p className={`mt-1.5 text-sm ${error ? 'text-error' : 'text-text-muted'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
