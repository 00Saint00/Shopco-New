// utils/discountUtils.js
export function getDailyDiscountedItems(products, count = 10) {
  const today = new Date().toISOString().split("T")[0]; // e.g. "2025-09-20"
  const seed = today.split("-").join(""); // e.g. "20250920"
  let rng = mulberry32(parseInt(seed));

  const shuffled = [...products].sort(() => rng() - 0.5);
  return shuffled.slice(0, count);
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function applyDailyDiscounts(products, count = 10, discountRate = 0.3) {
  const discountedItems = getDailyDiscountedItems(products, count);
  const discountedIds = new Set(discountedItems.map((p) => p._id));

  return products.map((p) => {
    if (discountedIds.has(p._id)) {
      const discountedPrice =
        p.discountedPrice ?? Math.round(p.price * (1 - discountRate));
      const discountPercent = Math.round(
        ((p.price - discountedPrice) / p.price) * 100
      );

      return {
        ...p,
        isDiscounted: true,
        discountedPrice,
        discountPercent,
      };
    }

    return {
      ...p,
      isDiscounted: false,
      discountedPrice: p.price,
      discountPercent: 0,
    };
  });

  // return products.map((p) => {
  //   if (discountedIds.has(p._id)) {
  //     const discountedPrice = Math.round(p.price * (1 - discountRate));
  //     const discountPercent = Math.round(((p.price - discountedPrice) / p.price) * 100);

  //     return {
  //       ...p,
  //       isDiscounted: true,
  //       discountedPrice,
  //       discountPercent,
  //     };
  //   }

  //   return {
  //     ...p,
  //     isDiscounted: false,
  //     discountedPrice: p.price, // fallback to same as price
  //     discountPercent: 0,
  //   };
  // });
}
