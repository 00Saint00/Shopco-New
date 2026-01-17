import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from 'react-hot-toast';

const Payment = ({ items, total, shippingAddress, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);


  const cardStyle = {
    style: {
      base: {
        color: "#000",                 // Text color
        fontSize: "20px",              // Font size
        fontFamily: "Poppins, sans-serif", // Font family
        fontWeight: "500",
        "::placeholder": {
          color: "#999",               // Placeholder color
        },
        padding: "13px",               // Doesn’t always work; see note below
      },
      invalid: {
        color: "#ff4d4f",             // Red for errors
        iconColor: "#ff4d4f",
      },
    },
    hidePostalCode: true,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    if (!stripe || !elements) {
      return;
    }

    // Check shipping address
    const hasAddress =
      shippingAddress?.address && shippingAddress.address.trim() !== "";
    const hasCity = shippingAddress?.city && shippingAddress.city.trim() !== "";
    const hasState =
      shippingAddress?.state && shippingAddress.state.trim() !== "";

    if (!hasAddress || !hasCity || !hasState) {
      // setError("Please complete your shipping address first!");
      toast.error("Please complete your shipping address first!");
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
    
    if (error) {
      // setError(error.message);
      toast.error(error.message);
        if (onError) onError(error.message);
      setIsProcessing(false);
      return;
    }

// Payment success!
if (onSuccess) {
  await onSuccess(paymentMethod.id);
}
setIsProcessing(false);


  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="my-5">
      <CardElement options={cardStyle} />

      </div>
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-black text-white py-[15px] rounded-[62px] font-semibold hover:bg-gray-600 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
      {isProcessing ? "Processing Payment..." : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
};

export default Payment;
