import React, { useMemo } from "react";

const Card = React.memo(function Card({
  _id,
  image,
  title,
  discountedPrice,
  price,
  rating,
  isDiscounted, // 👈 now coming from Home
  priority = false,
}) {
  const stars = useMemo(
    () =>
      [...Array(5)].map((_, i) => (
        <span
          key={`card-star-${i}`}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
        >
          &#9733;
        </span>
      )),
    [rating]
  );

  return (
    <div className="card flex flex-col p-4 transition rounded-[20px]">
      <div className="bg-[#F0EEED] h-[200px] lg:h-[298px] w-full lg:w-[295px] flex justify-center items-center rounded-[20px] overflow-hidden">
        <img
          src={image}
          loading={priority ? "eager" : "lazy"}
          alt={title}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          className="w-full h-full object-cover object-top rounded-[20px]"
        />
      </div>
      <div className="text-start w-full">
        <h2 className="text-[20px] font-bold mt-[16px]">{title}</h2>
        <div className="flex gap-[13px]">
          <div>{stars}</div>
          <div className="text-[14px] font-normal"> {rating}/5</div>
        </div>

        {/* 👇 If discounted, show both old and new prices */}
        {isDiscounted ? (
          <div className="flex items-center gap-2 mt-[8px]">
            <p className="text-[24px] font-bold">${discountedPrice}</p>
            <p className="line-through text-black text-opacity-10 text-[24px] font-bold">
              ${price}
            </p>
          </div>
        ) : (
          <p className="text-[24px] font-bold text-black mt-[8px]">${price}</p>
        )}
      </div>
    </div>
  );
});

export default Card;
