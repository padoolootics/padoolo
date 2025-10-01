import React from "react";
import { Product } from "@/types/products";
import WishlistButton from "@/components/WishlistButton";
import Link from "next/link";
import Image from "next/image";

interface SingleSlideProps {
  product: Product;
}

const SingleSlide: React.FC<SingleSlideProps> = ({ product }) => {
  const hasDiscount = !!product.discountPercent;
  // const discountedPrice = hasDiscount
  //   ? (product.price * (1 - product.discountPercent! / 100)).toFixed(2)
  //   : product.price.toFixed(2);

  return (
    <div className="relative">
      {/* Wishlist Button */}
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton product_id={product.id} liked={false} />
        </div>
    <Link
      className=""
      href={`/product/${product?.slug}`}
      prefetch={true}
    >
      <div className="relative p-2 lg:p-0 text-center bg-white">
        

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            -{product.discountPercent}%
          </div>
        )}

        {/* Product Image */}
        {/*<figure className=" bg-[#feffff] mt-0 mb-4 w-full  flex items-center justify-center border border-[#00000015]">
          <Image
            src={product.images[0].src}
            alt={product.name}
            className="w-full h-auto bg-gray-200"
            width={240}
            height={300}
          />
        </figure>*/}

        <figure className="flex items-center overflow-hidden justify-center w-full aspect-[4/5] bg-[#EDECE8] rounded-md">
          <Image
            src={product.images[0].src}
            alt={product.name}
            className="w-full h-full object-contain"
            width={240}
            height={300}
          />
        </figure>

        {/* Product Name */}
        <h3 className="text-lg font-medium text-black">{product.name}</h3>

        {/* Price Info */}
        <div className="text-sm mt-1">
          {hasDiscount ? (
            <>
              <span className="text-gray-400 line-through mr-2">
                €{product.regular_price}
              </span>
              <span className="text-red-600 text-[20px] font-semibold">
                €{product.sale_price}
              </span>
            </>
          ) : (
            <span className="text-gray-800 text-[20px] font-medium">
              €{product.price}
            </span>
          )}
        </div>
      </div>
    </Link>
    </div>
  );
};

export default SingleSlide;
