import React, { useState, useEffect } from "react";
import { Button } from "@headlessui/react";
// import { addToCart, removeFromCart } from "../Utils/CartUtils";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart,clearCart, addToCart } from "../../store/slices/cartSlice";

// import trash

const Cart = () => {
  // const [cart, setCart] = useState([]);
const dispatch = useDispatch();
const cart = useSelector((state) => state.cart.cart);

  // Fetch cart from localStorage when component mounts
  // const loadCart = () => {
  //   const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  //   setCart(storedCart);
  // };

  // useEffect(() => {
  //   loadCart();
  // }, []);

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handle quantity changes
  const handleIncrease = (item) => {
    // addToCart(item, item.size, 1); // add 1 more of same product
    // loadCart();
    dispatch(addToCart({
      ...item,
      quantity: 1, // add 1 more
    }));
  };

  const handleDecrease = (item) => {
    // 
    dispatch(removeFromCart({
      ...item,
      quantity: -1,
    }))
  };

  return (
    <div className="px-[16px] lg:px-[100px] pt-[80px] pb-[168px]">
      <h2 className="text-[32px] lg:text-[40px] font-bold font-poppins uppercase pb-[24px]">
        Your Cart
      </h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="border border-black border-opacity-10 rounded-[20px] py-[20px] px-[24px]">
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item._id + item.size}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex gap-[16px] w-full">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-[99px] lg:w-[124px] h-[99px] lg:h-[124px] object-cover rounded"
                  />
                  <div className="flex flex-col justify-between w-full">
                    <div>
                      <p className="font-bold text-[16px] lg:text-[20px]">
                        {item.title}
                      </p>
                      <p className="text-[12px] lg:text-[14px] text-gray-500">
                        Size: {item.size}
                      </p>
                    </div>

                    <div className="flex justify-between items-center w-full">
                      <p className="text-[20px] lg:text-[24px] text-black font-bold">
                        ${item.price.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-[5px] lg:gap-4 border border-black border-opacity-10 rounded-full py-[8px] px-[12px] lg:px-[20px] bg-[#F0F0F0] mt-2">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center text-[14px] lg:text-xl hover:bg-black hover:text-white transition"
                        >
                          -
                        </button>

                        <span className="text-[14px] lg:text-xl font-medium text-center w-[30px] text-black">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => handleIncrease(item)}
                          className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center text-[14px] lg:text-xl hover:bg-black hover:text-white transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-6 mt-4">
              <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
