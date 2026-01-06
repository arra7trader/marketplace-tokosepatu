'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    baseImage: string;
    variants: any[];
}

export default function ProductListing() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Vans'];
    const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

    const selectedBrand = searchParams.get('brand');
    const selectedSize = searchParams.get('size');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params: any = {};
                if (selectedBrand) params.brand = selectedBrand;
                if (selectedSize) params.size = selectedSize;

                const response = await api.get('/products', { params });
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedBrand, selectedSize]);

    const handleFilter = (type: 'brand' | 'size', value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === (type === 'brand' ? selectedBrand : selectedSize)) {
            params.delete(type); // Toggle off
        } else {
            params.set(type, value);
        }

        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-8">All Products</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
                    <div>
                        <h3 className="font-bold uppercase mb-4">Brands</h3>
                        <div className="space-y-2">
                            {brands.map((brand) => (
                                <button
                                    key={brand}
                                    onClick={() => handleFilter('brand', brand)}
                                    className={`block w-full text-left px-2 py-1 text-sm ${selectedBrand === brand ? 'font-bold bg-black text-white' : 'text-gray-600 hover:text-black'
                                        }`}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold uppercase mb-4">Size</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleFilter('size', size.toString())}
                                    className={`text-sm py-2 border ${selectedSize === size.toString()
                                            ? 'bg-black text-white border-black'
                                            : 'border-gray-200 text-gray-600 hover:border-black'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gray-200 aspect-square mb-4"></div>
                                    <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {products.map((product) => (
                                        <Link key={product.id} href={`/products/${product.id}`} className="group">
                                            <div className="relative aspect-square mb-4 overflow-hidden bg-gray-100 border border-transparent group-hover:border-gray-200 transition-colors">
                                                <img
                                                    src={product.baseImage || 'https://via.placeholder.com/400'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <h3 className="text-lg font-bold uppercase tracking-tight">{product.name}</h3>
                                            <p className="text-gray-500 text-sm mb-2">{product.brand}</p>
                                            <p className="font-medium">${product.price.toLocaleString()}</p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50">
                                    <p className="text-gray-500">No products match your filters.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
