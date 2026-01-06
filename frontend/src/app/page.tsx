'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  baseImage: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        // Take first 4 products as "New Arrivals"
        setProducts(response.data.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gray-900 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Sneaker"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <h1 className="text-5xl sm:text-7xl font-black text-white italic tracking-tighter mb-6 uppercase">
            Run The <br /> Future
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-xl">
            Experience the next generation of comfort and style.
            Exclusive drops from top brands.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
          >
            Shop Now <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">New Arrivals</h2>
          <Link href="/products" className="text-sm font-bold uppercase underline hover:text-gray-600">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square mb-4"></div>
                <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="relative aspect-square mb-4 overflow-hidden bg-gray-100">
                    <img
                      src={product.baseImage || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Size Badge Overlay could go here */}
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-tight">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{product.brand}</p>
                  <p className="font-medium">${product.price.toLocaleString()}</p>
                </Link>
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-400 py-20">No products found. Start by adding some in the backend!</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
