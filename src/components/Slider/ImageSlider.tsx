'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

const sliderItems = [
  { title: 'Running', image: '/images/running.png' },
  { title: 'Mountain Bike', image: '/images/mountain-bike.png' },
  { title: 'Swimming', image: '/images/swimming.png' },
  { title: 'Driving', image: '/images/driving.png' },
  { title: 'Mountain Bike', image: '/images/mountain-bike.png' },
];

export default function EyewearSlider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <>
    <div className="flex items-center justify-center mt-[20px]">
      <div className=' w-[33.2%] bg-[#fff] pt-[15px]'>
        <h2 className="text-[20px] md:text-[56px] text-right text-[#0A1C3C] font-bold  pr-4">EYEWEAR</h2>
      </div>
      <div className='flex items-center justify-between pr-[20px] w-[66.6%] bg-[#0A1C3C] pt-[15px]'>
          <h2 className="text-[20px] md:text-[56px] font-normal md:font-bold w-full text-white pl-4" style={{ color:'transparent',WebkitTextStrokeWidth:'1px',WebkitTextStrokeColor: '#fff'}}>FOR ANY ACTIVITY</h2>

          <div className=" transform -translate-y-1/2 gap-2 z-20 hidden lg:flex">
            <button
              ref={prevRef}
              className="w-8 h-8 cursor-pointer rounded-full border border-gray-300 text-white hover:bg-gray-100 hover:text-black flex items-center justify-center"
            >
              &#x276E;
            </button>
            <button
              ref={nextRef}
              className="w-8 h-8 cursor-pointer rounded-full border border-gray-300 text-white hover:bg-gray-100 hover:text-black flex items-center justify-center"
            >
              &#x276F;
            </button>
          </div>
      </div>
    </div>


    <div className="relative bg-white py-12 px-8">
      <div className="absolute right-0 top-0 w-full lg:w-2/3 h-1/4 lg:h-1/2 bg-[#0A1C3C] z-0" />

      <div className=" container mx-auto relative z-10">
        <div className="container m-auto">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            modules={[Navigation, Autoplay, Pagination]}
            autoplay={{ delay: 5000 }}
            loop={true}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            onInit={(swiper) => {
              // @ts-expect-error: Swiper types do not recognize navigation refs assignment
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-expect-error: Swiper types do not recognize navigation refs assignment
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
          >
            {sliderItems.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="text-center">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={300}
                    height={400}
                    className="w-full h-[450px] object-cover rounded"
                  />
                  <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Dots (only visible on small devices) */}
          <div className="swiper-pagination mt-6 block lg:hidden text-center" />
        </div>
      </div>
    </div>
    </>
  );
}
