"use client"; 

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link  from "next/link";

const slides = [
  {
    id: 1,
    title: "Fashion Fusion",
    price: "$123.99",
    button: "Shop Now",
    image: "/images/hero1.png", 
  },
  {
    id: 2,
    title: "Urban Explorer",
    price: "$89.50",
    button: "Explore Now",
    image: "/images/hero1.png",
  },
];

export default function HeroSwiperSlider(data:any) {
  // console.log("data", data);
  return (
    <div className="h-full xl:h-[80vh] w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={false}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="w-full h-full"
      >
          <SwiperSlide >
            <div className="relative w-full h-full">
              {/* Background Image */}
              <Image
                src={data?.data?.banner_image}
                alt={data?.data?.banner_title}
                className="object-cover brightness-[.5]"
                width={1920}
                height={600}
                priority
              />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center px-6 md:px-50">
                <div className="text-white space-y-4 max-w-[400px]">
                  <div className="text-xl font-semibold">{data?.data?.banner_sub_title}</div>
                  <h2 className="text-3xl md:text-5xl font-bold">{data?.data?.banner_title}</h2>
                  <Link href={data?.data?.banner_button} className="w-[fit-content] block px-6 py-2 bg-white text-black font-semibold hover:bg-gray-200 transition rounded-sm">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
      </Swiper>
    </div>
  );
}
