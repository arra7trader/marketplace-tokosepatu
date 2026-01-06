'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { Check } from 'lucide-react';

interface ProductVariant {
    id: string;
    size: number;
    color: string;
    stockQuantity: number;
}

interface Product {
    id: string;
    name: string;
    brand: string;
    description: string;
    price: number;
    baseImage: string;
    variants: ProductVariant[];
}

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Failed to fetch product', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product && selectedVariant) {
            addToCart({
                productVariantId: selectedVariant.id,
                productId: product.id,
                name: product.name,
                price: product.price,
                size: selectedVariant.size,
                image: product.baseImage,
                quantity: 1,
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>;

    // Group variants by unique sizes for the selector
    // Assuming one color for now as per prompt request "Size selector"
    const sortedVariants = product.variants.sort((a, b) => a.size - b.size);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                {/* Product Image */}
                <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
                    <img
                        src={product.baseImage || 'https://via.placeholder.com/800'}
                        alt={product.name}
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-center">
                    <h2 className="text-xl text-gray-500 uppercase font-bold tracking-wider mb-2">{product.brand}</h2>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6">{product.name}</h1>
                    <p className="text-2xl font-bold mb-8">${product.price.toLocaleString()}</p>

                    <div className="mb-8">
                        <h3 className="font-bold uppercase mb-4 text-sm">Select Size</h3>
                        <div className="grid grid-cols-5 gap-3">
                            {sortedVariants.map((variant) => {
                                const isOutOfStock = variant.stockQuantity <= 0;
                                const isSelected = selectedVariant?.id === variant.id;

                                return (
                                    <button
                                        key={variant.id}
                                        disabled={isOutOfStock}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`
                      py-3 text-sm font-bold border transition-all
                      ${isSelected ? 'bg-black text-white border-black ring-2 ring-black ring-offset-2' : ''}
                      ${isOutOfStock
                                                ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed decoration-slice'
                                                : isSelected ? '' : 'border-gray-200 hover:border-black'}
                    `}
                                    >
                                        {variant.size}
                                    </button>
                                );
                            })}
                        </div>
                        {sortedVariants.length === 0 && <p className="text-red-500 text-sm mt-2">No sizes available.</p>}
                    </div>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {product.description}
                    </p>

                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant || added}
                        className={`
              w-full py-4 text-white font-bold uppercase tracking-widest transition-all
              ${added ? 'bg-green-600' : 'bg-black hover:bg-gray-800'}
              ${!selectedVariant ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                    >
                        {added ? (
                            <span className="flex items-center justify-center gap-2">
                                <Check className="w-5 h-5" /> Added to Cart
                            </span>
                        ) : (
                            'Add to Cart'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
