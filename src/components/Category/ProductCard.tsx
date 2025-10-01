'use client';

import { Product } from '@/types/products';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  product: Product;
  oldPrice?: number;
  discountPercent?: number;
  rating?: number;
  viewMode?: 'grid' | 'list';
}

const ProductCard = ({
  image,
  name,
  price,
  oldPrice,
  discountPercent,
  rating = 4,
  viewMode = 'grid',
}: ProductCardProps) => {
  const isList = viewMode === 'list';

  return (
    <div
      className={`relative bg-white shadow-sm rounded group hover:shadow-md transition overflow-hidden
        ${isList ? 'flex flex-row w-full max-h-[220px]' : 'flex flex-col max-w-full w-full'}`}
    >
      {/* Discount Badge */}
      {discountPercent && (
        <span className="absolute top-2 left-2 bg-blue-900 text-white text-xs font-semibold px-2 py-0.5 rounded z-10">
          {discountPercent}%
        </span>
      )}

      {/* Wishlist Button */}
      <button
        className={`absolute top-2 ${isList ? 'right-4' : 'right-2'} text-gray-600 hover:text-red-500 transition z-10`}
      >
        <Heart size={18} strokeWidth={1.5} />
      </button>

      {/* Image Section */}
      <div className={`${isList ? 'w-[180px] h-[220px]' : 'w-full h-[250px]'} bg-gray-100 shrink-0`}>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info Section */}
      <div className={`${isList ? 'flex-1 px-4 py-3 flex flex-col justify-center' : 'p-3'}`}>
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`text-xs ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-800 truncate mb-1">{name}</h3>

        {/* Pricing */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-800 font-semibold text-sm">€{price}</span>
          {oldPrice && (
            <span className="text-gray-400 text-xs line-through">€{oldPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
