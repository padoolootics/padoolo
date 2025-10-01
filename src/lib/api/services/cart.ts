import axiosClient from '../clients/axiosClient';
import { CartItem } from '../types';

export const cartApi = {
  syncCart: (cart: CartItem[]) =>
    axiosClient.post<CartItem[]>('/wc/store/v1/cart', { items: cart }),
};