'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper/types';
import WishlistButton from '@/components/WishlistButton';
import { Product } from '@/types/products';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';

// interface Product {
//   id: string | number;
//   name: string;
//   image: string;
//   price: number;
//   rating?: number;
// }

interface Props {
  product: Product;
}

interface CenterTabbedSliderProps {
  title?: string;
  tabs: string[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
  products: Product[];
}

export default function CenterTabbedSlider({
  title,
  tabs,
  selectedTab,
  onTabChange,
  products,
}: CenterTabbedSliderProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const slidesPerView = 4;
  const shouldShowArrows = products.length > slidesPerView;

  const slidePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const slideNext = () => {
    swiperRef.current?.slideNext();
  };

    // const rating = products.rating ?? 0;
    const rating = 0;


  return (
    <div className="relative px-2 lg:px-0 bg-gray-100 text-center lg:py-18 pt-10 pb-0 px-4 lg:px-0">
      {/* Dynamic Title */}
      <div className="container mx-auto">
        {title && (
          <h2 className="text-2xl font-bold mb-4 text-slate-900">{title}</h2>
        )}
        {/* Tab Navigation */}
        <div className="flex justify-center space-x-6 mb-6 text-sm font-medium">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`border-b-2 pb-2 transition cursor-pointer ${
                tab === selectedTab
                  ? 'text-black border-black'
                  : 'text-gray-500 border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Swiper and Arrows */}
        <div className="relative">
          {shouldShowArrows && (
            <button
              onClick={slidePrev}
              aria-label="Previous"
              className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-8 z-10 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-md hover:bg-gray-100 cursor-pointer"
            >
              &#x276E;
            </button>
          )}

          {shouldShowArrows && (
            <button
              onClick={slideNext}
              aria-label="Next"
              className="absolute top-1/2 right-0 -translate-y-1/2 w-8 h-8 z-10 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-md hover:bg-gray-100 cursor-pointer"
            >
              &#x276F;
            </button>
          )}

          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            navigation={false}
            autoplay
            loop
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
          >
            {products.map((p) => (
              <SwiperSlide key={p.id} className=''>
                <Link className="" href={`/product/${p?.slug}`} prefetch={true}>
                <div className="p-2 min-h-[377px] w-full md:w-[240px]">
            
                  {/*<figure className='flex items-center justify-center md:h-[300px] h-full w-full md:w-[240px] bg-[#EDECE8]'>
                        <Image
                          src={p.images ? p.images[0].src : '/placeholder.jpg'}
                          alt={p.name}
                          className=" md:h-[300px] h-full w-full md:w-[240px]"
                          width={240}
                          height={300}
                          />
            </figure>*/}

                  <figure className="flex items-center overflow-hidden justify-center w-full aspect-[4/5] bg-[#EDECE8] rounded-md">
                    <Image
                      src={p.images ? p.images[0].src : '/placeholder.jpg'}
                      alt={p.name}
                      className="w-full h-full object-contain"
                      width={240}
                      height={300}
                    />
                  </figure>

                  {/* Star Rating with yellow square boxes */}
                    <div className="flex  gap-1 mt-2">
                      {Array.from({ length: 5 }, (_, i) => (
                          <div
                          key={i}
                          className={`w-5 h-5 rounded-[3px] flex items-center justify-center text-xs font-bold border ${
                              i < rating
                              ? 'bg-gray-200 text-yellow-600 border-yellow-800'
                              : 'bg-yellow-400 text-white border-white'
                          }`}
                          >
                              ★
                          </div>
                      ))}
                    </div>
                  <h3 className="text-sm text-left text-[18px] font-semibold mt-2 cursor-pointer truncate md:overflow-visible md:whitespace-normal">{p.name}</h3>
                  <p className="text-sm text-left text-[16px] font-[400]">€{p.price}</p>
                </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
