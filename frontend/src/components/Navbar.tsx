'use client';

import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { cartCount } = useCart();

    return (
        <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-black tracking-tighter italic uppercase">
                            SNEAKER<span className="text-gray-400">STORE</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/products" className="hover:text-gray-500 font-medium transition-colors">Men</Link>
                            <Link href="/products" className="hover:text-gray-500 font-medium transition-colors">Women</Link>
                            <Link href="/products" className="hover:text-gray-500 font-medium transition-colors">New Arrivals</Link>
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-1 focus:ring-black w-40 transition-all group-hover:w-64"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>

                        <Link href="/cart" className="hover:text-gray-500 transition-colors relative">
                            <ShoppingBag className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <Link href="/profile" className="hover:text-gray-500 transition-colors">
                            <User className="h-6 w-6" />
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/products" className="block px-3 py-2 text-base font-medium hover:bg-gray-50">Men</Link>
                        <Link href="/products" className="block px-3 py-2 text-base font-medium hover:bg-gray-50">Women</Link>
                        <Link href="/products" className="block px-3 py-2 text-base font-medium hover:bg-gray-50">New Arrivals</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
