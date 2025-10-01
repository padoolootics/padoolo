"use client";

import { useEffect, useState } from "react";
import { useWishlistContext } from "@/lib/Contexts/WishlistContextMain";
import ProductServices from "@/lib/api/services/ProductServices";
import { Product } from "@/types/products";
import ProductCard from "@/components/Category/ProductCard";
import WishlistButton from "@/components/WishlistButton";
import Link from "next/link";
import Image from "next/image";

const WishlistPage = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlistContext(); // Access wishlist state and functions
  const [isEmpty, setIsEmpty] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const rating = 0;

  useEffect(() => {
    const ids = wishlist.map((item) => item.id).join(",");

    // Early return if ids is falsy
    if (!ids) return;

    const fetchProducts = async () => {
      const res = await ProductServices.getProductBySpecificIds(ids);
      setProducts(res);
      //   console.log("Fetched products:", res);
    };

    fetchProducts();
  }, [wishlist]);

  useEffect(() => {
    setIsEmpty(wishlist.length === 0); // Check if the wishlist is empty
  }, [wishlist]);

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId); // Remove item from wishlist
  };

  if (loading) {
    return <div>Loading wishlist...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold my-6 ">Your Wishlist</h1>
      {isEmpty ? (
        <p>Your wishlist is empty. Start adding items!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((item: Product, i: any) => (
            <div key={i}>
              {/* <ProductCard
                key={item.id}
                image={item.images[0]?.src}
                name={item.name}
                price={item.price}
                product={item}
                oldPrice={item.regular_price}
                viewMode="grid"
              /> */}
              <div className="relative bg-white rounded cursor-pointer group transition overflow-hidden">
                {/* Wishlist Button */}
                <div className="absolute top-2 right-2 z-10">
                  <WishlistButton product_id={item.id} liked={false} />
                </div>
                <Link
                  href={`/product/${item.slug}`}
                  className="group"
                  prefetch={true}
                >
                  {/* Image Section */}
                  <div className="w-full h-[300px] relative overflow-hidden bg-white shrink-0">
                    <Image
                      src={item.images[0]?.src}
                      alt={item.name}
                      fill
                      // width={250}
                      // height={320}
                      className="w-full h-auto object-contain transition-transform duration-300"
                    />
                  </div>

                  {/* Star Rating with yellow square boxes */}
                  <div className="flex  gap-1 m-2 mb-0 ">
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

                  {/* Info Section */}
                  <div className="p-3">
                    {/* Product Name */}
                    <h3 className="text-base font-semibold text-gray-800 truncate mb-1">
                      {item.name}
                    </h3>

                    {/* Pricing */}
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-800 font-semibold text-sm">
                        €{item.price}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
