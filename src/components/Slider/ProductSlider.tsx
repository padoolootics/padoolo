"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";

import { Product } from "@/types/products";
import ProductSlide from "./ProductSlide";
import Grid2x2Slide from "./Grid2x2Slide";
import SingleSlide from "./SingleSlide";
import Row4Slide from "./Row4Slide";
import CenterTabbedSlider from "./CenterTabbedSlider";

interface ProductSliderProps {
  title?: string;
  products: Product[];
  layout?: "grid2x2" | "row4" | "single" | "tabbed" | "center-tabbed";
  tabs?: string[];
  selectedTab?: string;
  onTabChange?: (tab: string) => void;
}

const ProductSlider: React.FC<ProductSliderProps> = ({
  title,
  products,
  layout = "row4",
  tabs,
  selectedTab,
  onTabChange,
}) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const isTabbed = layout === "tabbed";
  const hasProducts = products && products.length > 0;
  const slidesPerView = isTabbed
    ? 5
    : layout === "single"
    ? 1
    : layout === "grid2x2"
    ? 2
    : layout === "row4"
    ? 4
    : 4;

  if (layout === "center-tabbed") {
    return (
      <CenterTabbedSlider
        title={title}
        products={products}
        tabs={tabs || []}
        selectedTab={selectedTab || ""}
        onTabChange={onTabChange || (() => {})}
      />
    );
  }

  return (
    <div className="relative mb-4 md:mb-12 overflow-visible">
      <div className="container m-auto px-4 lg:px-0">
        {title && (
          <h2 className="pb-3 border-b border-[#1A1A1A] w-[fit-content] tittle-text-in-slider text-2xl font-normal text-[#001F3E] px-4 md:px-0">{title}</h2>
        )}

        {isTabbed && tabs?.length ? (
          <div className=" flex items-center justify-between mb-4 relative">
            <div className="flex space-x-6 text-sm font-medium px-4 md:px-0">
              {tabs!.map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange?.(tab)}
                  className={`border-b-2 pb-2 transition cursor-pointer ${
                    tab === selectedTab
                      ? "text-black border-black"
                      : "text-gray-500 border-transparent"
                  }`}
                >
                  {tab}
                </button> 
              ))}
            </div>
            <div className="flex space-x-2 absolute top-0 right-4 md:right-0">
              <button
                ref={prevRef}
                className="w-8 h-8 z-50 cursor-pointer rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 bg-white"
              >
                &#x276E;
              </button>
              <button
                ref={nextRef}
                className="w-8 h-8 z-50 cursor-pointer rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 bg-white"
              >
                &#x276F;
              </button>
            </div>
          </div>
        ) : title ? (
          <div className=" flex justify-end mb-4 space-x-2 absolute top-0 right-4 md:right-0">
            <button
              ref={prevRef}
              className="w-8 h-8 z-50 cursor-pointer rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 bg-white"
            >
              &#x276E;
            </button>
            <button
              ref={nextRef}
              className="w-8 h-8 z-50 cursor-pointer rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 bg-white"
            >
              &#x276F;
            </button>
          </div>
        ) : null}

        <Swiper
          spaceBetween={20}
          slidesPerView={slidesPerView}
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
              slidesPerView: 2,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: slidesPerView,
            },
          }}
          className="!px-1"
        >
          {!hasProducts ? (
            <SwiperSlide className="pt-[20px] border-t border-[#EBEBEB]">
              <div className="flex items-center justify-center min-h-[377px] w-full text-center text-gray-500">
                Products not found
              </div>
            </SwiperSlide>
          ) : layout === "grid2x2" ? (
            products
              .filter((_, i) => i % 2 === 0)
              .map((_, i) => (
                <SwiperSlide className="pt-[20px] border-t border-[#EBEBEB]" key={i}>
                  <Grid2x2Slide products={products.slice(i * 2, i * 2 + 2)} />
                </SwiperSlide>
              ))
          ) : (
            products.map((product) => (
              <SwiperSlide className="pt-[20px] border-t border-[#EBEBEB]" key={product.id}>
                {layout === "single" && <SingleSlide product={product} />}
                {layout === "row4" && <Row4Slide product={product} />}
                {layout === "tabbed" && <ProductSlide product={product} />}
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductSlider;
