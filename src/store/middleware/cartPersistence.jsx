// Middleware function that saves cart to localStorage
export const cartPersistenceMiddleware = (store) => (next) => (action) => {
  // First, let the action execute (this updates Redux state)
  const result = next(action);

  // List of cart action types to watch for
  const cartActions = [
    "cart/addToCart",
    "cart/removeFromCart",
    "cart/clearCart",
  ];

  // Check if this is a cart action
  if (cartActions.includes(action.type)) {
    // Get the updated cart from Redux state
    const state = store.getState();
    const cart = state.cart.cart;

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Return the result (standard middleware pattern)
  return result;
};
