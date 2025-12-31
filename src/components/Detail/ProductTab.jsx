import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Faq from "./Faq";

const ProductTab = ({ review, products }) => {
  console.log(review);

  const starRating = function (rating) {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-[22px] ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        &#9733;
      </span>
    ));
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return `Posted on ${date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`;
  };

  const categories = [
    {
      name: "Product Details",
      posts: [
        {
          id: 1,
          title: "Does drinking coffee make you smarter?",
          date: "5h ago",
          commentCount: 5,
          shareCount: 2,
        },
        {
          id: 2,
          title: "So you've bought coffee... now what?",
          date: "2h ago",
          commentCount: 3,
          shareCount: 2,
        },
      ],
    },
    {
      name: "Ratings and Reviews",
      posts: [
        {
          id: 1,
          title: "Is tech making coffee better or worse?",
          date: "Jan 7",
          commentCount: 29,
          shareCount: 16,
        },
        {
          id: 2,
          title: "The most innovative things happening in coffee",
          date: "Mar 19",
          commentCount: 24,
          shareCount: 12,
        },
      ],
    },
    {
      name: "FAQs",
      posts: [
        {
          id: 1,
          title: "Ask Me Anything: 10 answers to your questions about coffee",
          date: "2d ago",
          commentCount: 9,
          shareCount: 5,
        },
        {
          id: 2,
          title: "The worst advice we've ever heard about coffee",
          date: "4d ago",
          commentCount: 1,
          shareCount: 2,
        },
      ],
    },
  ];

  return (
    <div className="py-[60px]">
      <div className="w-full">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="flex justify-between border-b border-gray-300 bg-transparent p-0 h-auto w-full">
            {categories.map(({ name }, index) => {
              const value =
                index === 0 ? "details" : index === 1 ? "reviews" : "faqs";
              return (
                <TabsTrigger
                  key={name}
                  value={value}
                  className="rounded-t-md px-0 lg:px-[129px] py-[20px] lg:py-[24px] text-[16px] lg:text-[20px] font-medium text-black border-b-2 border-transparent data-[state=active]:border-black bg-transparent hover:bg-transparent data-[state=active]:bg-transparent"
                >
                  {name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="details" className="mt-0">
            <div className="grid grid-cols-1 divide-y divide-gray-300">
              <div className="grid grid-cols-2 py-2">
                <p className="text-[20px] font-bold">Brand:</p>
                <p className="text-[20px] font-bold ">{products.brand}</p>
              </div>

              <div className="grid grid-cols-2 py-2">
                <p className="text-[20px] font-bold">Type:</p>
                <p className="text-[20px] font-bold">{products.type}</p>
              </div>

              <div className="grid grid-cols-2 py-2">
                <p className="text-[20px] font-bold">Category:</p>
                <p className="text-[20px] font-bold">{products.category}</p>
              </div>

              <div className="grid grid-cols-2 py-2">
                <p className="text-[20px] font-bold">Availability:</p>
                <p className="text-[20px] font-bold">
                  {products.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Ratings & Reviews Tab */}
          <TabsContent value="reviews" className="mt-3">
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
              {review.map((reviews) => (
                <li
                  key={reviews._id}
                  className="relative rounded-md py-3 text-sm/6 transition hover:bg-white/5"
                >
                  <div className="">
                    <div className="border border-black border-opacity-10 rounded-[20px] p-[24px] lg:py-[28px] lg:px-[32px]">
                      <div>{starRating(reviews.rating)}</div>
                      <span className="font-bold lg:text-[20px] lg:leading-[22px]">
                        {reviews.user && reviews.user.name}
                      </span>
                      <p className="text-[18px] lg:leading-[22px] text-black text-opacity-60 py-[12px]">
                        {reviews.comment}
                      </p>
                      <p className="text-[18px] lg:leading-[22px] text-black text-opacity-60 py-[12px]">
                        {formatDate(reviews.createdAt)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="mt-3">
            <Faq />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductTab;
