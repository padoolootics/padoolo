"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Image from "next/image";

interface ProductSwiperProps {
  images: { src: string; alt: string }[];
}

export default function ProductImageSwiper({ images }: ProductSwiperProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slidePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const slideNext = () => {
    swiperRef.current?.slideNext();
  };

  const onMainSwiperChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] lg:grid-cols-[150px_1fr] gap-4 px-4">
      {/* Thumbnail Swiper */}
      <div className="flex flex-col items-center order-2 md:order-1">
        <button
          onClick={slidePrev}
          aria-label="Previous image"
          className="p-2 absolute hidden md:visible t-[-25px] z-10 bg-white mb-2 rounded-full cursor-pointer border border-gray-300 hover:bg-gray-100"
        >
          &#x2191;
        </button>
        <div className="w-full h-[75px] md:w-[85px] md:h-[400px] md:w-[150px] md:h-[620px]">
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[Navigation, Thumbs]}
            spaceBetween={10}
            slidesPerView={3}
            direction={"vertical"}
            watchSlidesProgress={true}
            className="h-full"
            breakpoints={{
              640: {
                direction: "vertical", // On screens 640px and wider, use vertical layout
              },
              0: {
                direction: "horizontal", // On screens smaller than 640px, use horizontal
              },
            }}
          >
            {images.map((s, index) => (
              <SwiperSlide
                key={index}
                className={`group cursor-pointer !h-auto ${
                  activeIndex === index ? "z-10" : ""
                }`}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={100}
                  height={200}
                  objectFit="cover"
                  className="rounded-md border-2 border-transparent group-hover:border-black transition-colors object-scale-down duration-200 h-full w-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <button
          onClick={slideNext}
          aria-label="Next image"
          className="p-2 mt-2 absolute hidden md:visible bottom-[-25px] z-10 bg-white rounded-full cursor-pointer border border-gray-300 hover:bg-gray-100"
        >
          &#x2193;
        </button>
      </div>

      {/* Main Image Swiper */}
      <div className="flex-1 w-100% md:w-[220px] lg:w-[480px] order-1 md:order-2">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Navigation, Thumbs]}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          slidesPerView={1}
          loop={true}
          className="w-full h-full"
          onSlideChange={onMainSwiperChange}
        >
          {images.map((s, index) => (
            <SwiperSlide key={index}>
              <Image
                src={s.src}
                alt={s.alt}
                width={800}
                height={1200}
                objectFit="contain"
                className="w-full h-full object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
