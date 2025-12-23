"use client";

import React from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import WishlistButton from "@/components/WishlistButton";
import Link from "next/link";

interface ProductCardProps {
  product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { id, name, image, images, price, is_variable, price_range, slug } =
    product;
  const rating = product.rating || 0;
  return (
    <div className="relative bg-white border border-gray-200 rounded cursor-pointer group transition overflow-hidden">
      {/* Wishlist Button */}
      <div className="absolute top-2 right-2 z-10">
        <WishlistButton product_id={id} liked={false} />
      </div>
      <Link href={`/product/${slug}`} className="group" prefetch={true}>
        {/* Image Section */}
        <div className="w-full h-[300px] relative overflow-hidden bg-white shrink-0">
          <Image
            src={images[0].src}
            alt={name}
            fill
            // width={250}
            // height={320}
            className="w-full h-auto object-contain transition-transform duration-300"
          />
        </div>

        {/* Star Rating with yellow square boxes */}
        {/* <div className="flex  gap-1 m-2 mb-0 ">
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
        </div> */}

        <div className="text-sm text-gray-500 mb-2 text-center mt-4">
          {product.brands.length > 0 ? (
            <p className="text-base font-semibold text-gray-500">
              {product.brands.map((c: any) => c.name).join(", ")}
            </p>
          ) : (
            ""
          )}
        </div>

        {/* Info Section */}
        <div className="p-3">
          {/* Product Name */}
          <h3 className="text-base text-center font-medium text-gray-700 truncate mb-1">
            {name}
          </h3>

          {/* Pricing */}
          <div className="flex items-center space-x-2 justify-center">
            <span className="text-gray-500 font-medium text-base ">
              €{is_variable ? price_range.min + "-" + price_range.max : price}
            </span>
          </div>

          {/* Add to Cart Button */}
          {/* <button
          onClick={() => addToCart(product)}
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Add to Cart
        </button> */}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
