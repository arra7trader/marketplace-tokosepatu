'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
    productVariantId: string;
    productId: string;
    name: string;
    price: number;
    size: number;
    image: string;
    quantity: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productVariantId: string) => void;
    clearCart: () => void;
    cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to local storage on change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.productVariantId === item.productVariantId);
            if (existingItem) {
                return prevCart.map((i) =>
                    i.productVariantId === item.productVariantId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prevCart, item];
        });
    };

    const removeFromCart = (productVariantId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.productVariantId !== productVariantId));
    };

    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
