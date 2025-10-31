import React from "react";

function dressStyle() {
  return (
    <div className="bg-[#F0F0F0] py-[40px] lg:py-[65px] px-[24px] lg:px-[65px] text-center rounded-[40px]">
      <h2 className="text-[32px] leading-[36px] lg:text-[48px] font-bold font-poppins pb-[64px]">
        Browse By Dress Styles
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="bg-white bg-no-repeat pt-[16px] lg:pt-[25px] pb-[140px] px-[24px] lg:px-[36px] rounded-[10px] lg:w-1/3 w-full lg:h-[284px] bg-casual-mobile lg:bg-casual-desktop bg-right">
            <p className="text-start font-bold text-[24px] lg:text-[36px] ">
              Casual
            </p>
          </div>
          <div className="bg-white pt-[16px] lg:pt-[25px] pb-[140px] px-[24px] lg:px-[36px] rounded-[10px] lg:w-2/3 w-full bg-no-repeat lg:h-[284px] lg:bg-formal-desktop bg-right bg-formal-mobile">
            <p className="text-start font-bold text-[24px] lg:text-[36px] ">
              Formal
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="bg-white pt-[16px] lg:pt-[25px] pb-[140px] px-[24px] lg:px-[36px] rounded-[10px] lg:w-2/3 w-full bg-no-repeat lg:h-[284px] bg-party-mobile lg:bg-party-desktop bg-right">
            <p className="text-start font-bold text-[24px] lg:text-[36px] ">
              Party
            </p>
          </div>
          <div className="bg-white pt-[16px] lg:pt-[25px] pb-[140px] px-[24px] lg:px-[36px] bg-no-repeat rounded-[10px] lg:w-1/3 w-full lg:h-[284px] bg-gym-mobile lg:bg-gym-desktop bg-right">
            <p className="text-start font-bold text-[24px] lg:text-[36px]">
              Gym
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dressStyle;
