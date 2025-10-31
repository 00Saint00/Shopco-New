import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// import "swiper/swiper.min.css";
import "swiper/css";
import "swiper/css/autoplay";

function Slider({ slides = [], settings = {} }) {
  // Simple rule: enable loop only when there are more than 1 slide
  const computedSettings = { ...settings, loop: slides.length > 1 };

  return (
    <div>
      <Swiper {...computedSettings}>
        {slides.map((slide, i) => (
          <SwiperSlide
            key={`slider-${slide.id || slide.brand || slide.title || i}`}
          >
            {slide.image && (
              <img
                src={slide.image}
                alt={slide.title || slide.brand || "slide"}
                loading="lazy"
              />
            )}
            {slide.title && <p className="text-white">{slide.title}</p>}
            {slide.brand && (
              <p className="text-white text-[30px] lg:text-[50px]  font-bold font-poppins">
                {slide.brand}
              </p>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Slider;
