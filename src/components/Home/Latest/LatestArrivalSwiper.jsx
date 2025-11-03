import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Card from "../../UI/Card";
import { Button } from "@headlessui/react";
import { Link } from "react-router-dom";

// Memoize slugify function outside component to avoid recreation
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

function LatestArrivalSwiper({ product, reviews }) {
  return (
    <div className="latest-arrivals py-20 text-center">
      <h1 className="text-[60px] font-bold font-poppins">New Arrivals</h1>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        autoplay={{ delay: 2000, disableOnInteraction: true }}
        speed={600}
        loop={product && product.length > 1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
          1280: { slidesPerView: 4, spaceBetween: 40 },
        }}
      >
        {product.map((prod, index) => (
          <SwiperSlide key={`latest-${prod._id || index}`}>
            <Link to={`/products/${prod._id}/${slugify(prod.title)}`}>
              <Card {...prod} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-8">
        <Link to="/shop/latest-product">
          <Button className="bg-white border border-black border-opacity-10 text-black px-20 py-4 rounded-full font-normal hover:bg-black hover:text-white transition duration-300">
            View All
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default React.memo(LatestArrivalSwiper);
