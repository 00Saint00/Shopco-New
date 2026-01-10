import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import { cartPersistenceMiddleware } from "./middleware/cartPersistence";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartPersistenceMiddleware),
});

export default store;
