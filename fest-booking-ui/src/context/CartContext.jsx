import React, { createContext, useState, useEffect, useCallback } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCart(parsedCart);
            } catch (error) {
                console.error('Failed to parse cart:', error);
            }
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        calculateTotal();
    }, [cart]);

    // Calculate total
    const calculateTotal = useCallback(() => {
        const sum = cart.reduce((acc, item) => {
            return acc + (item.price * item.quantity);
        }, 0);
        setTotal(sum);
    }, [cart]);

    // Add item to cart
    const addItem = useCallback((event, quantity = 1, seatType = 'general') => {
        setCart((prev) => {
            const existingItem = prev.find(
                (item) => item.eventId === event.id && item.seatType === seatType
            );

            if (existingItem) {
                return prev.map((item) =>
                    item.eventId === event.id && item.seatType === seatType
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [
                ...prev,
                {
                    eventId: event.id,
                    eventName: event.name,
                    eventImage: event.image,
                    eventDate: event.date,
                    price: event.price,
                    quantity,
                    seatType,
                },
            ];
        });
    }, []);

    // Remove item from cart
    const removeItem = useCallback((eventId, seatType) => {
        setCart((prev) =>
            prev.filter(
                (item) => !(item.eventId === eventId && item.seatType === seatType)
            )
        );
    }, []);

    // Update item quantity
    const updateQuantity = useCallback((eventId, seatType, quantity) => {
        if (quantity <= 0) {
            removeItem(eventId, seatType);
            return;
        }

        setCart((prev) =>
            prev.map((item) =>
                item.eventId === eventId && item.seatType === seatType
                    ? { ...item, quantity }
                    : item
            )
        );
    }, [removeItem]);

    // Clear cart
    const clearCart = useCallback(() => {
        setCart([]);
        setTotal(0);
    }, []);

    // Get cart item count
    const getItemCount = useCallback(() => {
        return cart.reduce((acc, item) => acc + item.quantity, 0);
    }, [cart]);

    // Check if event is in cart
    const isInCart = useCallback((eventId, seatType = 'general') => {
        return cart.some(
            (item) => item.eventId === eventId && item.seatType === seatType
        );
    }, [cart]);

    const value = {
        cart,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        isInCart,
        itemCount: getItemCount(),
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
