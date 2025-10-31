import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Card from "../../UI/Card";
import { Button } from "@headlessui/react";
import { Link } from "react-router-dom";

function TopSellingSwiper({ topSold, reviews }) {
  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  return (
    <div className="latest-arrivals py-20 text-center">
      <h1 className="text-[60px] font-bold font-poppins uppercase">
        Top Selling
      </h1>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          reverseDirection: true,
        }}
        speed={800}
        loop={topSold && topSold.length > 1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
          1280: { slidesPerView: 4, spaceBetween: 40 },
        }}
      >
        {topSold.map((product, index) => (
          <SwiperSlide key={`top-${product._id || index}`}>
            <Link
              to={`/products/${product._id}/${slugify(product.title)}`}
              state={{ reviews }}
            >
              <Card {...product} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-9">
        <Link to="/shop/top-selling">
          <Button className="bg-white border border-black border-opacity-10 px-20 py-4 rounded-full font-normal hover:bg-black hover:text-white transition duration-300">
            View all
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default TopSellingSwiper;
