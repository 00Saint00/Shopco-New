import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// import "swiper/swiper.min.css";
import "swiper/css";
import "swiper/css/autoplay";

function Slider({ slides = [], settings = {} }) {
  // Memoize computed settings to avoid recreation
  const computedSettings = useMemo(
    () => ({ ...settings, loop: slides.length > 1 }),
    [settings, slides.length]
  );

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
                loading={i < 3 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={i < 2 ? "high" : undefined}
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

export default React.memo(Slider);
