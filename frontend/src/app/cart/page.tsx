'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
    const { cart, removeFromCart, clearCart } = useCart();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <h1 className="text-3xl font-black uppercase italic mb-6">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8">Looks like you haven't added any kicks yet.</p>
                <Link href="/products" className="px-8 py-3 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-12">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-8">
                    {cart.map((item) => (
                        <div key={item.productVariantId} className="flex gap-6 border-b border-gray-100 pb-8">
                            <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                                <img
                                    src={item.image || 'https://via.placeholder.com/150'}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <h3 className="font-bold uppercase">{item.name}</h3>
                                    <p className="font-bold">${item.price.toLocaleString()}</p>
                                </div>
                                <p className="text-sm text-gray-500 mb-1">Size: {item.size}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    <button
                                        onClick={() => removeFromCart(item.productVariantId)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={clearCart} className="text-sm text-red-500 underline font-medium">
                        Clear Cart
                    </button>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 p-8 h-fit">
                    <h2 className="text-xl font-bold uppercase mb-6">Order Summary</h2>
                    <div className="flex justify-between mb-4 text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-4 text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">Free</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between mb-8">
                        <span className="font-bold uppercase">Total</span>
                        <span className="font-bold text-xl">${total.toLocaleString()}</span>
                    </div>
                    <button className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
