import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

const Input = forwardRef(({
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
                          }, ref) => {
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
                    className="block text-sm font-medium text-white/90 mb-2"
                >
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}

            {/* Input Container */}
            <div className="relative">
                {/* Icon */}
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
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
            w-full backdrop-blur-lg bg-white/10 border rounded-xl
            px-4 py-2.5 text-white placeholder-white/50
            transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${showPasswordToggle ? 'pr-10' : ''}
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/50' : ''}
            ${success ? 'border-green-400 focus:border-green-500 focus:ring-green-500/50' : ''}
            ${!error && !success ? 'border-white/20 focus:border-purple-500 focus:ring-purple-500/50' : ''}
            ${isFocused ? 'bg-white/15 shadow-lg' : ''}
          `}
                    {...props}
                />

                {/* Password Toggle */}
                {showPasswordToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}

                {/* Error/Success Icons */}
                {error && !showPasswordToggle && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
                        <AlertCircle size={20} />
                    </div>
                )}
                {success && !showPasswordToggle && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                        <Check size={20} />
                    </div>
                )}
            </div>

            {/* Helper Text / Error Message */}
            {(helperText || error) && (
                <p className={`mt-1.5 text-sm ${error ? 'text-red-400' : 'text-white/60'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
