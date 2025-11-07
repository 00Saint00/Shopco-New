import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { _id, size, quantity } = action.payload;

      // Check if this product (with same id and size) already exists in cart
      const existingItem = state.cart.find(
        (item) => item._id === _id && item.size === size
      );

      if (existingItem) {
        // Update quantity if it already exists
        existingItem.quantity += quantity;
      } else {
        // Add new product
        state.cart.push({
          ...action.payload,
          quantity: quantity || 1, // fallback if no quantity is passed
        });
      }
    },
    removeFromCart: (state, action) => {
        const { size,productId } = action.payload;

        const existingItem = state.cart.find((item) => item._id=== productId && item.size === size);

        if(!existingItem) return;

        existingItem.quantity -= 1;

        if(existingItem.quantity <= 0){
            state.cart =state.cart.filter((item) => !(item._id === productId && item.size === size))
        }
    },
    clearCart: (state) => {
        state.cart = [];
      },
  },
});

export const { addToCart , removeFromCart,clearCart} = cartSlice.actions;
export default cartSlice.reducer;
