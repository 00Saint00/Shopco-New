import React from 'react'
import { useStripe, useElements,CardElement } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';


const PaymentForm = ({items, total, shippingAddress, onSuccess, onError}) => {
const stripe = useStripe();
const elements = useElements();
const [error, setError] = useState(null);
const [isProcessing, setIsProcessing] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    if(!stripe || !elements) {
        return;
    }
    const cardElement = elements.getElement(CardElement);
    const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: 'card', card: cardElement});

        if(error){
            setError(error.message);      
            setIsProcessing(false);
            return;
        }
}
  return (
    <form onSubmit={handleSubmit}>
        <CardElement />
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        <button type="submit" disabled={isProcessing} className="w-full bg-black text-white py-[15px] rounded-[62px] font-semibold hover:bg-gray-600 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
            {isProcessing ? "Processing..." : "Place Order"}
        </button>
    </form>
  )
}
export default PaymentForm
