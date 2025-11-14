import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../UI/Spiner";
import Error from "../UI/Error";
import Card from "../UI/Card";
import { applyDailyDiscounts } from "../Utils/discountUtils";


// Memoize slugify function outside component
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const OnSale = () => {
  const [allProducts,setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

const discountedProduts = allProducts.filter((product) => product.isDiscounted === true)

  return (
    <div className="px-[16px] lg:px-[100px] pt-[80px] pb-[50%] md:pb-[25%] lg:pb-[168px]">
      <div>
        <h2>Items on Sale</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[80px]">
        {discountedProduts.map((product) => ( 
          <Link
          key={product._id}
          to={`/products/${product._id}/${slugify(product.title)}`}
          >
          <Card {...product}/>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OnSale;
