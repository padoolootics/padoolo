import { useAuth } from '../Contexts/AuthContext';
// import { useCart } from '../Contexts/CartContext';
import { useWishlist } from '../Contexts/WishlistContext';

export const useEcommerce = () => {
  const auth = useAuth();
  // const cart = useCart();
  const wishlist = useWishlist();

  return {
    ...auth,
    // ...cart,
    ...wishlist,
    // Convenience method to clear all user data
    clearAll: () => {
      auth.logout();
      // cart.clearCart();
      wishlist.clearWishlist();
    },
  };
};