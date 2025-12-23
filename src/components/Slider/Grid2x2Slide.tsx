"use client";
import React from "react";
import { Product } from "@/types/products";
import WishlistButton from "@/components/WishlistButton";
import { useCartContext } from "@/lib/Contexts/CartContext";
import Link from "next/link";
import Image from "next/image";

interface Grid2x2SlideProps {
  products: Product[];
}

const Grid2x2Slide: React.FC<Grid2x2SlideProps> = ({ products }) => {
  const { addToCart, cart } = useCartContext();

  return (
    <div className="flex flex-col space-y-4">
      {products.map((product) => {
        const hasDiscount = !!product.discountPercent;
        const discountedPrice = 0;

        return (
          <div className="relative " key={product.id}>
            {/* Wishlist Button */}
            <div className="absolute top-2 right-2 z-10">
              <WishlistButton product_id={product.id} liked={false} />
            </div>
            <Link
              key={product.id}
              href={`/product/${product?.slug}`}
              className="font-[500] text-[20px]"
              prefetch={true}
            >
              <div className="relative p-2 lg:p-0 bg-white text-center">
                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    -{product.discountPercent}%
                  </div>
                )}

                {/* Product Image */}
                {/*<figure className="flex items-center justify-center overflow-hidden h-full md:h-[400px] w-full bg-[#EDECE8]">
                <Image
                  src={product.images[0].src}
                  className="mx-auto w-full h-auto mb-2 bg-gray-200"
                  alt={product.name}
                  width={240}
                  height={300}
                />
              </figure>*/}

                <figure className="flex items-center overflow-hidden justify-center w-full aspect-[4/5] border border-gray-200 bg-[#ffffff] rounded-md">
                  <Image
                    src={product.images[0].src}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    width={240}
                    height={300}
                  />
                </figure>

                <div className="text-sm text-gray-500 mb-2 text-center mt-4">
                  {product.brands.length > 0 ? (
                    <p className="text-base font-semibold text-gray-500">
                      {product.brands.map((c: any) => c.name).join(", ")}
                    </p>
                  ) : (
                    ""
                  )}
                </div>

                {/* Product Info */}
                <div
                  className="text-lg font-medium text-black cursor-pointer truncate md:overflow-visible md:whitespace-normal"
                  dangerouslySetInnerHTML={{ __html: product.name }}
                />

                {/* Price Info */}
                <div className="text-sm">
                  {hasDiscount ? (
                    <>
                      <span className="text-gray-400 line-through mr-2">
                        €{product.price}
                      </span>
                      <span className="text-red-600 text-[18px] font-semibold">
                        €{discountedPrice}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-800 font-[500] text-[18px]">
                      €{product.price}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Grid2x2Slide;
