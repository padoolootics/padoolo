// lib/localCart.ts

export type LocalCartItem = {
  id: number;
  quantity: number;
  variationId?: number;
  name: string;
  price: number;
};

const STORAGE_KEY = 'guest_cart';

export const getLocalCart = (): LocalCartItem[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveLocalCart = (cart: LocalCartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }
};

export const clearLocalCart = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};
