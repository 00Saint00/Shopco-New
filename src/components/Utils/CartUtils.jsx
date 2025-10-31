export const addToCart = (product, selectedSize, quantity) => {
  if (!selectedSize) {
    alert("Please select a size before adding to cart.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(
    (item) => item._id === product._id && item.size === selectedSize
  );

  if (existingItem) {
    // Already exists → update quantity
    existingItem.quantity += quantity;
  } else {
    // Add new product
    cart.push({
      _id: product._id,
      title: product.title,
      image: product.image,
      price: product.isDiscounted ? product.discountedPrice : product.price,
      originalPrice: product.price,
      quantity,
      size: selectedSize,
      category: product.category,
    });

    alert("Item added to cart!");
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  console.log("Cart contents after adding:", cart);

  window.dispatchEvent(new Event("storageUpdate"));
};

export const removeFromCart = (productId, size) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(
    (item) => item._id === productId && item.size === size
  );

  if (!existingItem) return; // nothing to remove

  existingItem.quantity -= 1;

  // 🔥 Remove item completely if quantity <= 0
  if (existingItem.quantity <= 0) {
    cart = cart.filter(
      (item) => !(item._id === productId && item.size === size)
    );
  }

  // ✅ Save updated cart
  localStorage.setItem("cart", JSON.stringify(cart));

  // ✅ Trigger UI update
  window.dispatchEvent(new Event("storageUpdate"));
};
