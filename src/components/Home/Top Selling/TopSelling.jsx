import React, { Suspense } from "react";
import Card from "../../UI/Card";
import { Button } from "@headlessui/react";
import "swiper/css"; // global CSS imported in main.jsx but keep here as safe-guard if needed
import "swiper/css/autoplay";
import { Link } from "react-router-dom";
import Spinner from "../../UI/Spiner";

const TopSellingSwiper = React.lazy(() => import("./TopSellingSwiper"));

function Topselling({ topSold, reviews }) {
  // Compute top 4 products by rating
  // const topSelling = useMemo(() => {
  //   if (!topSold || topSold.length === 0) return [];
  //   return [...topSold].sort((a, b) => b.rating - a.rating).slice(0, 8);
  // }, [topSold]);

  // const topSelling =
  //   topSold && topSold.length > 0
  //     ? [...topSold].sort((a, b) => b.rating - a.rating).slice(0, 8)
  //     : [];

  // Simple slugify function
  // const slugify = (text) =>
  //   text
  //     .toLowerCase()
  //     .replace(/\s+/g, "-")
  //     .replace(/[^\w-]+/g, "");

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-8">
          <Spinner />
        </div>
      }
    >
      <TopSellingSwiper topSold={topSold} reviews={reviews} />
    </Suspense>
  );
}

export default React.memo(Topselling);
