"use client";
import SingleSlide from "@/components/Slider/SingleSlide";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";

type Product = {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  rating?: number;
};

export default function RelatedProductSlider({
  products,
}: {
  products: any[];
}) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  console.log("products in related", products);

  return (
    <div className="container m-auto">
      <h2 className="pb-3 border-b border-[#1A1A1A] w-[fit-content] tittle-text-in-slider text-2xl font-normal text-[#001F3E] px-4 md:px-0">
        Related Products
      </h2>
      <Swiper
        spaceBetween={20}
        slidesPerView={4}
        modules={[Navigation, Autoplay, Pagination]}
        autoplay={{ delay: 5500 }}
        loop={true}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          // @ts-expect-error: Swiper types do not recognize navigation refs assignment
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-expect-error: Swiper types do not recognize navigation refs assignment
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        className="!px-1"
      >
        {products.map((product) => (
          <SwiperSlide
            className="pt-[20px] border-t border-[#EBEBEB]"
            key={product.id}
          >
            <SingleSlide product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
