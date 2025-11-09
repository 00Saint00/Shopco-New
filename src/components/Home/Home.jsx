import React, {
  useState,
  useEffect,
  useMemo,
  startTransition,
  Suspense,
  useRef,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import axios from "axios";
import { Autoplay } from "swiper/modules";

// Direct imports — Vite will handle code splitting automatically
import Banner from "./Banner/Banner";
import Spinner from "../UI/Spiner";
const DressStyles = React.lazy(() => import("./Dress Style/DressStyle"));
const Testimonials = React.lazy(() => import("./Testimonials/Testimonial"));

// --- Commented out imports that are not currently working ---
// import Spinner from "../Ui/Spinner";
// import Error from "../Ui/Error.js";
// import { applyDailyDiscounts } from "../utils/discountUtils";
import LatestArrival from "./Latest/LatestArrival";
import Topselling from "./Top Selling/TopSelling";
import Slider from "../UI/Slider";
import Error from "../UI/Error";

function Home() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topSellingReady, setTopSellingReady] = useState(false);
  const [latestReady, setLatestReady] = useState(false);
  const latestRef = useRef(null);
  const topSellingRef = useRef(null);

  // --- Swiper settings ---
  const settings = {
    modules: [Autoplay],
    autoplay: { delay: 0, disableOnInteraction: false },
    speed: 2000,
    loop: true,
    allowTouchMove: false,
    slidesPerView: 3,
    breakpoints: {
      320: { slidesPerView: 1, centeredSlides: true, spaceBetween: 10 },
      640: { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 2, spaceBetween: 60 },
      1280: { slidesPerView: 3, spaceBetween: 40 },
    },
  };

  // --- Fetch Products ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          "https://fakestoreapiserver.reactbd.org/api/products"
        );
        const allProducts = data.data;

        // --- Commented out because applyDailyDiscounts is missing ---
        // const discountedItems = applyDailyDiscounts(allProducts, 10);
        // const taggedProducts = allProducts.map((p) => ({
        //   ...p,
        //   isDiscounted: discountedItems.some((d) => d._id === p._id),
        // }));

        startTransition(() => {
          setProducts(allProducts); // fallback to raw products
          setLoading(false);
        });
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- Derived Data ---
  // Old way (doing it in 2 steps - not needed):
  // const latestProducts = useMemo(() => products.slice(-8), [products]);
  // const latestProductsWithPriority = useMemo(
  //   () =>
  //     latestProducts.map((product, index) => ({
  //       ...product,
  //       priority: index < 4,
  //     })),
  //   [latestProducts]
  // );

  // New way (simpler - do it all in one step):
  // Get last 8 products and add priority flag in one step
  const latestProductsWithPriority = useMemo(
    () =>
      products.slice(-8).map((product, index) => ({
        ...product,
        priority: index < 4,
      })),
    [products]
  );

  // Old way (doing it in 2 steps - not needed):
  // const topSellingProducts = useMemo(
  //   () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 8),
  //   [products]
  // );
  // const topSellingProductsWithPriority = useMemo(
  //   () =>
  //     topSellingProducts.map((product, index) => ({
  //       ...product,
  //       priority: index < 4,
  //     })),
  //   [topSellingProducts]
  // );

  // New way (simpler - do it all in one step):
  // Get top 8 products by rating and add priority flag in one step
  const topSellingProductsWithPriority = useMemo(
    () =>
      [...products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8)
        .map((product, index) => ({
          ...product,
          priority: index < 4,
        })),
    [products]
  );

  const uniqueBrands = useMemo(() => {
    return [...new Set(products.map((p) => p.brand))].map((brand) => ({
      brand,
    }));
  }, [products]);

  // --- Fetch Reviews + Users ---
  useEffect(() => {
    // Only fetch reviews if products are loaded (avoid unnecessary calls)
    if (products.length === 0) return;

    const fetchReviews = axios.get(
      "https://fakestoreapiserver.reactbd.org/api/reviews"
    );
    const fetchUsers = axios.get(
      "https://fakestoreapiserver.reactbd.org/api/users"
    );

    Promise.all([fetchReviews, fetchUsers])
      .then(([reviewsResponse, usersResponse]) => {
        // Use Map for O(1) lookup instead of O(n) find
        const userMap = new Map(
          usersResponse.data.data.map((user) => [user._id, user])
        );
        const reviews = reviewsResponse.data.data.map((review) => ({
          ...review,
          user: userMap.get(review.userId),
        }));
        setReviews(reviews);
      })
      .catch((error) => {
        // Don't set loading to false here as it's already handled in products fetch
        console.error("Failed to fetch reviews:", error);
      });
  }, [products.length]);

  useEffect(() => {
    if (!loading && products.length > 0) {
      const timer = setTimeout(() => setTopSellingReady(true), 700);
      const latestTimeout = setTimeout(() => setLatestReady(true), 1000);
      return () => {
        clearTimeout(timer);
        clearTimeout(latestTimeout);
      };
    }
  }, [loading, products]);

  // Animate LatestArrival container when it becomes ready
  useGSAP(
    () => {
      if (latestReady && latestRef.current) {
        const el = latestRef.current;
        // animate from slightly down + invisible to visible
        gsap.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, xPercent: 0, duration: 1.5, ease: "power1.inOut" }
        );
      }
    },
    { dependencies: [latestReady] }
  );

  // Animate TopSelling container when it becomes ready
  useGSAP(
    () => {
      if (topSellingReady && topSellingRef.current) {
        const el = topSellingRef.current;
        // animate from slightly down + invisible to visible
        gsap.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, xPercent: 0, duration: 1.5, ease: "power1.inOut" }
        );
      }
    },
    { dependencies: [topSellingReady] }
  );

  // --- Commented out Spinner/Error until imported ---
  if (loading) return <Spinner />;
  if (error) return <Error />;

  return (
    <div>
      <Banner />

      <div className="bg-black py-[32px] lg:py-[44px] text-center">
        <Slider slides={uniqueBrands} settings={settings} />
      </div>

      <section className="px-[16px] lg:px-[100px]">
        {!latestReady ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div
            ref={latestRef}
            className="latest-animate"
            style={{ opacity: 0 }}
          >
            <LatestArrival
              product={latestProductsWithPriority}
              reviews={reviews}
            />
          </div>
        )}
        {!topSellingReady ? (
          <div className="flex justify-center items-center py-16">
            <Spinner />
          </div>
        ) : (
          <div
            ref={topSellingRef}
            className="topselling-animate"
            style={{ opacity: 0 }}
          >
            <Topselling
              topSold={topSellingProductsWithPriority}
              reviews={reviews}
            />
          </div>
        )}

        <div className="py-[50px] lg:py-[100px]">
          <Suspense fallback={<Spinner />}>
            <DressStyles />
          </Suspense>
        </div>

        <div className="py-[50px] pt-[50px] lg:pt-[80px] pb-[90%] md:pb-[35%]  lg:pb-[170px]">
          <Suspense fallback={<Spinner />}>
            <Testimonials reviews={reviews} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

export default Home;
