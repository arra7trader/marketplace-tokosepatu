import Link from 'next/link';
import { Twitter, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    <div className="space-y-4">
                        <h3 className="text-2xl font-black tracking-tighter italic uppercase">SNEAKER<span className="text-gray-500">STORE</span></h3>
                        <p className="text-gray-400 text-sm">
                            Premium sneakers for the urban explorer.
                            Authentic. Edgy. Yours.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">Shop</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/products" className="hover:text-white transition-colors">Men</Link></li>
                            <li><Link href="/products" className="hover:text-white transition-colors">Women</Link></li>
                            <li><Link href="/products" className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link href="/products" className="hover:text-white transition-colors">Sale</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">Support</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
                            <li><Link href="/status" className="hover:text-white transition-colors">Order Status</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">Connect</h4>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                        </div>
                        <div className="mt-8">
                            <p className="text-xs text-gray-500">© 2026 SneakerStore Inc.</p>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}
