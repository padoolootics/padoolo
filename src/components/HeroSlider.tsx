"use client"; 

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

type HeroAcf = {
  sec1_main_background_image?: string;
  sec1_main_heading?: string;
  sec1_sub_heading?: string;
  sec1_button_text?: string;
  sec1_button_url?: string;
  // backward compatibility (older ACF keys)
  banner_image?: string;
  banner_title?: string;
  banner_sub_title?: string;
  banner_button?: string;
};

export default function HeroSwiperSlider({ data }: { data?: HeroAcf }) {
  const imageSrc =
    data?.sec1_main_background_image || data?.banner_image || "/images/hero1.png";
  const title = data?.sec1_main_heading || data?.banner_title || "";
  const subTitle = data?.sec1_sub_heading || data?.banner_sub_title || "";
  const buttonText = data?.sec1_button_text || "Shop Now";
  const buttonUrl = data?.sec1_button_url || data?.banner_button || "/shop";

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
                src={imageSrc}
                alt={title || "Hero"}
                className="object-cover brightness-[.5]"
                width={1920}
                height={600}
                priority
              />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center px-6 md:px-50">
                <div className="text-white space-y-4 max-w-[400px]">
                  {subTitle ? (
                    <div className="text-xl font-semibold">{subTitle}</div>
                  ) : null}
                  {title ? (
                    <h2 className="text-3xl md:text-5xl font-bold">{title}</h2>
                  ) : null}
                  <Link
                    href={buttonUrl}
                    className="w-[fit-content] block px-6 py-2 bg-white text-black font-semibold hover:bg-gray-200 transition rounded-sm"
                  >
                    {buttonText}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
      </Swiper>
    </div>
  );
}
