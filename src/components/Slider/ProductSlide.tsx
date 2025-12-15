import React from "react";
import { Product } from "@/types/products";
import WishlistButton from "@/components/WishlistButton";
import Link from "next/link";
import Image from "next/image";

interface Props {
  product: Product;
}

const ProductSlide: React.FC<Props> = ({ product }) => {
  const hasDiscount = !!product.discountPercent;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discountPercent! / 100)
    : product.price;

  // Assume product.rating is a number between 0 and 5
  const rating = product.rating ?? 0;

  return (
    <>
    {/* Wishlist Button */}
        <div className="absolute top-8 right-4 z-10">
          <WishlistButton product_id={product.id} liked={false} />
        </div>
    <Link
      className="text-sm text-left text-[18px] font-semibold mt-2"
      href={`/product/${product?.slug}`}
      prefetch={true}
    >
      <div className=" w-full p-2 lg:p-0 relative group  transition-all duration-300">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
            -{product.discountPercent}%
          </div>
        )}

        
        {/*<figure className="flex items-center overflow-hidden justify-center w-full h-[180px] md:w-[240px] md:h-[300px] bg-[#EDECE8]">
          <Image
            src={product.images ? product.images[0].src : "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full md:w-[240px] md:h-[300px] object-scale-down"
            width={240}
            height={300}
          />
        </figure>*/}

        <figure className="flex items-center overflow-hidden justify-center w-full aspect-[4/5] bg-[#ffffff] border border-gray-200 rounded-md">
          <Image
            src={product.images ? product.images[0].src : "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-contain"
            width={240}
            height={300}
          />
        </figure>


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

        <div className="text-sm text-left text-[18px] font-semibold mt-2" dangerouslySetInnerHTML={{ __html: product.name }} />
        
        {/* Price Info */}
        <div className="text-sm text-left text-[16px] font-[400] mt-1">
          {hasDiscount ? (
            <>
              <span className="text-gray-400 font-[400] line-through mr-2">
                €{product.price}
              </span>
              <span className="text-red-600 font-[400]">
                €{discountedPrice}
              </span>
            </>
          ) : (
            <span className="text-gray-800 font-[400]">€{product.price}</span>
          )}
        </div>
      </div>
    </Link>
    </>
  );
};

export default ProductSlide;
