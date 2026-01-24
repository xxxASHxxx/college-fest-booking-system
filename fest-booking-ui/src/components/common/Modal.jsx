import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

const Modal = ({
                   isOpen,
                   onClose,
                   title,
                   children,
                   size = 'md',
                   showCloseButton = true,
                   closeOnBackdropClick = true,
                   footer = null,
               }) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Size classes
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4',
    };

    const sizeClass = sizes[size] || sizes.md;

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={closeOnBackdropClick ? onClose : undefined}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div
                className={`
          relative w-full ${sizeClass} backdrop-blur-xl bg-white/10 
          border border-white/20 rounded-2xl shadow-2xl
          transform transition-all animate-slideUp
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h3 id="modal-title" className="text-2xl font-bold text-white">
                        {title}
                    </h3>
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default Modal;
