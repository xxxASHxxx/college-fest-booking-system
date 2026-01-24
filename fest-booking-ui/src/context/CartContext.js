import React, { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(parsedCart);
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        calculateTotal();
    }, [cartItems]);

    // Calculate total amount
    const calculateTotal = useCallback(() => {
        const total = cartItems.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);
        setTotalAmount(total);
    }, [cartItems]);

    // Add item to cart
    const addToCart = useCallback((event, quantity = 1) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.eventId === event.id);

            if (existingItem) {
                // Update quantity if item already exists
                toast.info('Cart updated!');
                return prevItems.map((item) =>
                    item.eventId === event.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Add new item
                toast.success('Added to cart!');
                return [
                    ...prevItems,
                    {
                        eventId: event.id,
                        eventName: event.name,
                        eventDate: event.date,
                        eventImage: event.image,
                        price: event.price,
                        quantity,
                        availableSeats: event.availableSeats,
                    },
                ];
            }
        });
    }, []);

    // Remove item from cart
    const removeFromCart = useCallback((eventId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.eventId !== eventId));
        toast.info('Item removed from cart');
    }, []);

    // Update item quantity
    const updateQuantity = useCallback((eventId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(eventId);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.eventId === eventId ? { ...item, quantity: newQuantity } : item
            )
        );
    }, [removeFromCart]);

    // Clear cart
    const clearCart = useCallback(() => {
        setCartItems([]);
        localStorage.removeItem('cart');
        toast.info('Cart cleared');
    }, []);

    // Get cart item count
    const getItemCount = useCallback(() => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    }, [cartItems]);

    // Check if event is in cart
    const isInCart = useCallback(
        (eventId) => {
            return cartItems.some((item) => item.eventId === eventId);
        },
        [cartItems]
    );

    const value = {
        cartItems,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        isInCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
