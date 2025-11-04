import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../UI/Spiner";
import Error from "../UI/Error";
import Card from "../UI/Card";
import { Link } from "react-router-dom";
import { applyDailyDiscounts } from "../Utils/discountUtils";
import { Menu } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

// Memoize slugify function outside component
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const Shop = () => {
  const { sortBy } = useParams(); // captures optional sort
  const [allProducts, setAllProducts] = useState([]); // store original fetched products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch products once on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://fakestoreapiserver.reactbd.org/api/products"
        );
        // Memoize discount calculation - only run once on fetch
        const data = applyDailyDiscounts(res.data.data, 10);
        setAllProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Memoize sorted products - only recalculate when sortBy or allProducts changes
  const products = useMemo(() => {
    if (!allProducts.length) return [];

    let sorted = [...allProducts];
    if (sortBy === "top-selling") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "a-z") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "least-popular") {
      sorted.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === "latest-product") {
      sorted = sorted.reverse();
    }

    return sorted;
  }, [sortBy, allProducts]);

  if (loading) return <Spinner />;
  if (error)
    return <Error message={error} onRetry={() => window.location.reload()} />;

  const sortLabelMap = {
    "most-popular": "Most Popular",
    "a-z": "A-Z",
    "least-popular": "Least Popular",
    "latest-product": "Latest Product",
  };

  return (
    <div className="px-[16px] lg:px-[100px] pt-[80px] pb-[168px]">
      <div className="flex lg:justify-between mb-6">
        <h2 className="text-[24px] lg:text-[32px] font-bold mb-[16px]">Shop</h2>

        {/* Sorting buttons */}
        <div className="flex items-center gap-[20px]">
          <span className="text-[16px] text-black text-opacity-60 ">
            Sort by:
          </span>
          <div className="relative">
            <Menu>
              {({ open }) => (
                <>
                  <Menu.Button className="flex items-center gap-2 outline-none focus:outline-none">
                    <span className="text-[16px] text-black font-bold">
                      {sortLabelMap[sortBy] || "Default"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                        open ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </Menu.Button>

                  <Menu.Items className="outline-none focus:outline-none w-48 origin-top-right absolute right-0 mt-2 bg-white border rounded-md shadow-lg p-3 items-center">
                    {Object.entries(sortLabelMap).map(([key, label]) => (
                      <Menu.Item key={key}>
                        {({ active }) => (
                          <button
                            className={`w-full text-left px-4 py-2 rounded-md ${
                              active ? "bg-blue-100" : ""
                            }`}
                            onClick={() => navigate(`/shop/${key}`)}
                          >
                            {label}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </>
              )}
            </Menu>
          </div>
          {/* <Menu>
            {({ open }) => (
              <>
                <Menu.Button className="flex items-center gap-2 utline-none focus:outline-none">
                  <span className="text-[16px] text-black font-bold">
                    Default
                  </span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                      open ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </Menu.Button>
                <Menu.Items
                  anchor="bottom"
                  className="outline-none focus:outline-none w-48 origin-top-right absolute right-0 mt-2 bg-white border rounded-md shadow-lg p-3 items-center"
                >
                  <div className="">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`w-full text-left px-4 py-2 rounded-md ${
                            active ? "bg-blue-100" : ""
                          }`}
                          onClick={() => navigate("/shop/most-popular")}
                        >
                          Most Popular
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`w-full text-left px-4 py-2 rounded-md ${
                            active ? "bg-blue-100" : ""
                          }`}
                          onClick={() => navigate("/shop/a-z")}
                        >
                          A-Z
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`w-full text-left px-4 py-2 rounded-md ${
                            active ? "bg-blue-100" : ""
                          }`}
                          onClick={() => navigate("/shop/least-popular")}
                        >
                          Least Popular
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`w-full text-left px-4 py-2 rounded-md ${
                            active ? "bg-blue-100" : ""
                          }`}
                          onClick={() => navigate("/shop/latest-product")}
                        >
                          Latest Product
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </>
            )}
          </Menu> */}
        </div>
        {/* <div className="flex gap-4 mb-6">
          <button onClick={() => navigate("/shop/top-selling")}>
            Top Selling
          </button>
          <button onClick={() => navigate("/shop/a-z")}>A-Z</button>
          <button onClick={() => navigate("/shop/least-popular")}>
            Least Popular
          </button>
        </div> */}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[80px]">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}/${slugify(product.title)}`}
          >
            <Card {...product} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shop;
