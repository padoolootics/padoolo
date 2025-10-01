'use client';

import { Product } from '@/types/products';
import { HeartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

export default function NewArrivalSection({ products }: { products: Product[] }) {

  return (
      <div className="lg:pr-42 p-4">
        {/* Right: Headline and Products */}
        <div className="w-full lg:w-full">
          <div className="relative inline-block mb-8 text-left">
            {/* Background Circle or Image */}
            <div className="absolute -left-10 -top-3 w-30 h-30 bg-gray-200 rounded-full z-0 hidden lg:block" style={{ backgroundImage: "url('/watches/circle-bg.png')" }}></div>

            {/* Title Text */}
            <h2 className="relative z-10 lg:text-4xl text-2xl text-center lg:text-left font-bold leading-tight text-black">
              New Arrival Men Watch <br /> <span className="block">Look Style</span>
            </h2>
          </div>
          

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            {products.slice(0, 3).map((product) => (
              <Link key={product.id} href={`product/${product.slug}`} prefetch={true}>
              <div  className="relative min-h-[377px] w-full md:w-[240px] lg:text-left">
                <div className="bg-white ">
                  {/* Discount badge */}
                  {product?.discount && (
                    <div className="absolute top-2 left-2 bg-blue-900 text-white text-xs px-2 py-1 rounded-sm">
                      {product.discount}
                    </div>
                  )}
                  {/* Wishlist Icon */}
                  <div className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer">
                    <HeartIcon className="w-5 h-5" />
                  </div>
                    {/*<figure className='flex items-center justify-center w-full h-full md:w-[240px] md:h-[240px] bg-[#EDECE8]'>
                      <Image
                        src={product.images[0].src}
                        alt={product.name}
                        className="w-full h-full md:w-[240px] md:h-[240px]"
                        width={240}
                        height={240}
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
                </div>
                {/* Rating */}
                <div className="flex space-x-1 mt-2 text-yellow-400 text-sm">
                  {/* {Array.from({ length: product.rating }, (_, i) => (
                    <div
                          key={i}
                          className={`w-5 h-5 rounded-[3px] flex items-center justify-center text-xs font-bold border bg-yellow-400 text-white border-white`
                          }
                          >
                              ★
                          </div>
                  ))} */}
                </div>
                <h3 className="mt-4 font-semibold text-sm">{product.name}</h3>
                
                {/* Pricing */}
                <div className="mt-1 text-sm font-bold text-gray-900">
                  €{product.price}
                  {product.sale_price && (
                    <span className="line-through text-gray-400 text-xs ml-1">
                      €{product.regular_price}
                    </span>
                  )}
                </div>
              </div>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link href={"/shop"} className="bg-yellow-600 text-white px-6 py-2 text-sm font-medium rounded shadow hover:bg-yellow-700 transition cursor-pointer">
              VIEW ALL
            </Link>
          </div>
        </div>
      </div>
  );
}
