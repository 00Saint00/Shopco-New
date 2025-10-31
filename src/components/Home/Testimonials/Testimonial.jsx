import React, { useRef, useEffect, useState, Suspense } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
// import { MoveLeft, ArrowRightIcon } from "@heroicons/react/16/solid";
import { Move, MoveLeft, MoveRight } from "lucide-react";
import axios from "axios";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import Spinner from "../../UI/Spiner";

function Testimonials({ reviews }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const starRating = function (rating) {
    return [...Array(5)].map((_, i) => (
      <span
        key={`star-${i}`}
        className={`text-[22px] ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        &#9733;
      </span>
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[32px] lg:text-[48px] font-bold font-poppins">
          OUR HAPPY CUSTOMERS
        </h2>
        <div className="flex gap-3">
          <button ref={prevRef} className="">
            <MoveLeft className="h-[24px] w-[24px] text-black cursor-pointer" />
          </button>
          <button ref={nextRef} className="">
            <MoveRight className="h-[24px] w-[24px] text-black cursor-pointer" />
          </button>
        </div>
      </div>
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        spaceBetween={30}
        slidesPerView={3}
        breakpoints={{
          320: {
            slidesPerView: 1,
            centeredSlides: true,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 60,
          },
          1280: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        className="mt-8"
      >
        {reviews.map((review, i) => (
          <SwiperSlide key={`testimonial-${review._id || review.id || i}`}>
            <div className="slide-to-the-next-slide ">
              <div className="border border-black/10 rounded-[20px] lg:py-[50px] px-[24px] lg:px-[32px]">
                <div>{starRating(review.rating)}</div>
                <span className="font-bold lg:text-[20px] lg:leading-[22px]">
                  {review.user && review.user.name}
                </span>
                <p className="text-[18px] lg:leading-[22px] text-black text-opacity-60 py-[12px]">
                  {review.comment}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Testimonials;
