'use client';

import React, { useState } from 'react';
import ProductCard from './ProductCard';

interface ProductGridProps {
  viewMode: 'grid' | 'list';
  sort: string;
  categorySlug: string;
}

const allProducts = Array.from({ length: 32 }).map((_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: 29.99 + i,
  image: '/images/product.png',
  category: 'Test',
  oldPrice: 89,
  discountPercent: 20,
  rating: 4,
}));

export default function ProductGrid({ viewMode }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  
  const start = (currentPage - 1) * productsPerPage;
  const paginatedProducts = allProducts.slice(start, start + productsPerPage);
  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <div className={`gap-10 ${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3' : 'flex flex-col'}`}>
        {paginatedProducts.map((product: any) => (
          <ProductCard
            key={product.id}
            viewMode={viewMode}
            product={product}
            image={product.image}
            name={product.name}
            price={product.price}
            oldPrice={product.oldPrice}
            discountPercent={product.discountPercent}
            rating={product.rating}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
}
