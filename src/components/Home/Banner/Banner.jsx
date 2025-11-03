import { Button } from "@headlessui/react";
import banner800 from "../../../assets/logo/banner-800.webp";
import banner1200 from "../../../assets/logo/banner-1200.webp";
import banner1600 from "../../../assets/logo/banner-1600.webp";

function Banner() {
  return (
    <div className="w-full hero-banner relative overflow-hidden">
      {/* Responsive WebP LCP */}
      <picture>
        <source
          type="image/webp"
          srcSet={`${banner800} 800w, ${banner1200} 1200w, ${banner1600} 1600w`}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1600px"
        />
        <img
          src={banner1600}
          alt="Shop banner"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none -z-10"
          loading="eager"
          fetchPriority="high"
        />
      </picture>

      <div className="relative z-10">
        <div className="py-[60px] lg:py-[113px] px-[16px] lg:px-[100px]">
          <h1 className="text-[28px] lg:text-[64px] font-poppins font-bold leading-tight lg:leading-[64px] max-w-full lg:max-w-[577px] text-center lg:text-left mx-auto lg:mx-0">
            FIND CLOTHES THAT MATCH YOUR STYLE
          </h1>

          <p className="text-[16px] max-w-full lg:max-w-[577px] text-[#7c7b7b] py-[24px] lg:py-[32px] text-center lg:text-left mx-auto lg:mx-0">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>

          <div className="flex justify-center lg:justify-start">
            <Button className="bg-black text-white px-[40px] lg:px-[67.5px] py-[15px] rounded-full font-semibold hover:bg-gray-600 transition duration-300">
              Shop Now
            </Button>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start lg:flex-row gap-[24px] lg:gap-[30px] pt-[40px] lg:pt-[50px] items-center lg:items-start">
            <div className="text-center lg:text-left">
              <p className="text-[32px] lg:text-[40px] font-bold">200+</p>
              <p className="text-[16px] text-black text-opacity-60">
                International Brands
              </p>
            </div>

            <div className=" lg:border-t-0 lg:border-x lg:border-black lg:border-opacity-10 px-0 lg:px-[32px] text-center">
              <p className="text-[32px] lg:text-[40px] font-bold">2,000+</p>
              <p className="text-[16px] text-black text-opacity-60">
                High Quality Products
              </p>
            </div>

            <div className="text-center lg:text-left">
              <p className="text-[32px] lg:text-[40px] font-bold">30,000+</p>
              <p className="text-[16px] text-black text-opacity-60">
                Happy Customers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
