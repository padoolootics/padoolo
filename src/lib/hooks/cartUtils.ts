export const getCartFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }
  return [];
};

export const saveCartToLocalStorage = (cart: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

export const clearCartFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cart');
  }
};