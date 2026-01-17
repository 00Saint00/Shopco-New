import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShippingAddress from "./ShippingAddress";
import { useDispatch } from "react-redux";
import { createOrder } from "../../services/orderService";
import { clearCart } from "../../store/slices/cartSlice";
import toast from 'react-hot-toast';
import Payment from "./Payment";

const Checkout = () => {
  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.auth.user);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);


     // Prepare shipping address object
     const shippingAddress = {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address|| "",
      city: user?.city || "",
      state: user?.state || "",
      zip: user?.zip || "",
      country: user?.country || "",
    };


  const handlePlaceOrder = async (paymentId) => {
    if (cart.length === 0) {
      // alert("Your cart is empty!");
      toast.error("Your cart is empty!");
      return;
    }

    // Check if user has address (handle empty strings too)
    // const hasAddress = user?.address && user.address.trim() !== "";
    // const hasCity = user?.city && user.city.trim() !== "";
    // const hasState = user?.state && user.state.trim() !== "";

    // if (!hasAddress || !hasCity || !hasState) {
    //   alert(
    //     "Please complete your shipping address first! Click 'Edit Address' to add your address details."
    //   );
    //   return;
    // }

    setIsPlacingOrder(true);
    setOrderError(null);

 
    // Create order
    const result = await createOrder({
      items: cart,
      total: total,
      shippingAddress: shippingAddress,
    });

    if (result.success) {
      // Clear cart
      dispatch(clearCart());

      // Show success message
      // alert(`Order placed successfully! Order #: ${result.orderNumber}`);

      toast.success(`Order placed successfully! Order #: ${result.orderNumber}`);
      
      // Redirect to home or orders page
      navigate("/");
    } else {
      setOrderError(result.error || "Failed to place order");
      // alert("Failed to place order. Please try again.");
      toast.error("Failed to place order. Please try again.");
    }

    setIsPlacingOrder(false);
  };

  return (
    <div className="px-[16px] lg:px-[100px] pt-[80px] pb-[195px] lg:pb-[168px]">
      <h2 className="text-[32px] lg:text-[40px] font-bold font-poppins uppercase pb-[24px]">
        Checkout
      </h2>

      <div className="lg:flex gap-8 lg:justify-between items-start">
        {/* Order Summary Section */}
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h3 className="text-[20px] lg:text-[24px] font-bold font-poppins mb-6">
            Order Summary
          </h3>
          <div className="border border-black border-opacity-10 rounded-[20px] py-[20px] px-[24px]">
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={item._id + item.size}
                  className={`flex items-center gap-[16px] pb-4 ${
                    index !== cart.length - 1
                      ? "border-b border-black border-opacity-10"
                      : ""
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-[80px] lg:w-[100px] h-[80px] lg:h-[100px] object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-[16px] lg:text-[18px] mb-1">
                      {item.title}
                    </p>
                    <p className="text-[12px] lg:text-[14px] text-gray-500 mb-2">
                      Size: {item.size} • Quantity: {item.quantity}
                    </p>
                    <p className="text-[18px] lg:text-[20px] text-black font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-black border-opacity-10">
                <div className="flex justify-between items-center">
                  <p className="text-[18px] lg:text-[20px] font-semibold">
                    Total:
                  </p>
                  <p className="text-[24px] lg:text-[28px] font-bold">
                    ${total.toFixed(2)}
                  </p>
                </div>
              </div>
              {/* place order */}
              <div className="pt-6 mt-4">
                {/* <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || cart.length === 0}
                  className="w-full bg-black text-white py-[15px] rounded-[62px] font-semibold hover:bg-gray-600 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? "Placing Order..." : "Place Order"}
                </button> */}
                <Payment
  total={total}
  items={cart}
  shippingAddress={shippingAddress}
  onSuccess={handlePlaceOrder}
  onError={setOrderError}
/>
                {orderError && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {orderError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address Section */}
        <div className="lg:w-1/2">
          <h3 className="text-[20px] lg:text-[24px] font-bold font-poppins mb-6">
            Shipping Address
          </h3>

          <div>
            <ShippingAddress />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
