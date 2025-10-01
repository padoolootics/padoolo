import React from "react";
import WishlistButton from "@/components/WishlistButton";
import { Product } from "@/types/products";
import Link from "next/link";
import Image from "next/image";

interface Row4SlideProps {
  product: Product;
}

const Row4Slide: React.FC<Row4SlideProps> = ({ product }) => {
  const hasDiscount = !!product.discountPercent;
  // const discountedPrice = hasDiscount
  //   ? (product.price * (1 - product.discountPercent! / 100)).toFixed(2)
  //   : product.price.toFixed(2);

  // Assume product.rating is a number between 0 and 5
  const rating = product.rating ?? 0;

  return (
    <>
      {/* Wishlist */}
      <div className="absolute top-2 right-6 z-10">
        <WishlistButton product_id={product.id} liked={false} />
      </div>
      <Link className="" href={`/product/${product?.slug}`} prefetch={true}>
        <div className="relative p-4 bg-white">
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
              -{product.discountPercent}%
            </div>
          )}

          {/* Product Image */}
          <Image
            src={product.images[0].src}
            alt={product.name}
            className="mx-auto w-full h-50 bg-white border border-gray-200 object-contain"
            width={240}
            height={300}
          />

          {/* Product Name */}
          <div className="mt-2 text-sm font-medium">{product.name}</div>

          {/* Price */}
          <div className="text-sm mt-1">
            {hasDiscount ? (
              <>
                <span className="text-gray-400 line-through mr-2">
                  €{product.regular_price}
                </span>
                <span className="text-red-600 font-semibold">
                  €{product.sale_price}
                </span>
              </>
            ) : (
              <span className="text-gray-800 font-medium">
                €{product.price}
              </span>
            )}
          </div>

          {/* Star Rating with yellow square boxes */}
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-[3px] flex items-center justify-center text-xs font-bold border ${
                  i < rating
                    ? "bg-gray-200 text-yellow-600 border-yellow-800"
                    : "bg-yellow-400 text-white border-white"
                }`}
              >
                ★
              </div>
            ))}
          </div>
        </div>
      </Link>
    </>
  );
};

export default Row4Slide;
