type WishlistItem = {
  id: number;
  name: string;
  price: number;
};

export const getLocalWishlist = () => {
  const wishlist = localStorage.getItem("wishlist");
  return wishlist ? JSON.parse(wishlist) : [];
};

export const saveLocalWishlist = (wishlist: WishlistItem[]) => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

export const clearLocalWishlist = () => {
  localStorage.removeItem("wishlist");
};
