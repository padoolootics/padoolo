import { useAuth } from '../Contexts/AuthContext';
import { useCartContext } from '../Contexts/CartContext';
import { useWishlistContext } from '../Contexts/WishlistContextMain';

export const useEcommerce = () => {
  const auth = useAuth();
  const cart = useCartContext();
  const wishlist = useWishlistContext();

  return {
    ...auth,
    ...cart,
    ...wishlist,
    // Convenience method to clear all user data
    clearAll: () => {
      auth.logout();
      cart.clearCart();
      wishlist.clearWishlist();
    },
  };
};