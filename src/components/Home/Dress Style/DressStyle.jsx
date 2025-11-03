import React from "react";
import casualMobile from "../../../assets/items/casual-600.webp";
import casualDesktop from "../../../assets/items/casual-1200.webp";
import formalMobile from "../../../assets/items/formal-600.webp";
import formalDesktop from "../../../assets/items/formal-1200.webp";
import partyMobile from "../../../assets/items/party-600.webp";
import partyDesktop from "../../../assets/items/party-1200.webp";
import gymMobile from "../../../assets/items/gym-600.webp";
import gymDesktop from "../../../assets/items/gym-1200.webp";

function dressStyle() {
  return (
    <div className="bg-[#F0F0F0] py-[40px] lg:py-[65px] px-[24px] lg:px-[65px] text-center rounded-[40px]">
      <h2 className="text-[32px] leading-[36px] lg:text-[48px] font-bold font-poppins pb-[64px]">
        Browse By Dress Styles
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div
            className="bg-white bg-no-repeat pt-[16px] lg:pt-[25px] pb-[140px] px-[24px] lg:px-[36px] rounded-[10px] lg:w-1/3 w-full lg:h-[284px] bg-right bg-cover [background-image:var(--casual-bg)] lg:[background-image:var(--casual-bg-lg)]"
            style={{
              "--casual-bg": `url(${casualMobile})`,
              "--casual-bg-lg": `url(${casualDesktop})`,
            }}
          >
            <p className="text-start font-bold text-[24px] lg:text-[36px] ">
              Casual
            </p>
          </div>
          <div
            className="bg-white pt-[16px] lg:pt-[25px] pb-[140px] px-[24px] lg:px-[36px] rounded-[10px] lg:w-2/3 w-full bg-no-repeat lg:h-[284px] bg-right bg-cover [background-image:var(--formal-bg)] lg:[background-image:var(--formal-bg-lg)]"
            style={{
              "--formal-bg": `url(${formalMobile})`,
              "--formal-bg-lg": `url(${formalDesktop})`,
            }}
          >
            <p className="text-start font-bold text-[24px] lg:text-[36px] ">
              Formal
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div
            className="bg-white pt-[16px] lg:pt-[25px] pb-[140px] px-[24px] lg:px-[36px] rounded-[10px] lg:w-2/3 w-full bg-no-repeat lg:h-[284px] bg-right bg-cover [background-image:var(--party-bg)] lg:[background-image:var(--party-bg-lg)]"
            style={{
              "--party-bg": `url(${partyMobile})`,
              "--party-bg-lg": `url(${partyDesktop})`,
            }}
          >
            <p className="text-start font-bold text-[24px] lg:text-[36px] ">
              Party
            </p>
          </div>
          <div
            className="bg-white pt-[16px] lg:pt-[25px] pb-[140px] px-[24px] lg:px-[36px] bg-no-repeat rounded-[10px] lg:w-1/3 w-full lg:h-[284px] bg-right bg-cover [background-image:var(--gym-bg)] lg:[background-image:var(--gym-bg-lg)]"
            style={{
              "--gym-bg": `url(${gymMobile})`,
              "--gym-bg-lg": `url(${gymDesktop})`,
            }}
          >
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
