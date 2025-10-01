'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getCartFromLocalStorage, saveCartToLocalStorage, clearCartFromLocalStorage } from '../hooks/cartUtils';
import axios from 'axios';

interface VariationAttributes {
  [key: string]: string;
}

interface CartItem {
  id: number;  // Product ID
  name: string;
  price: number;
  regular_price: number;
  sale_price: number;
  variations: {
    [variation_id: number]: {
      variation_id: number;
      quantity: number;
      variation_attributes?: VariationAttributes;
    };
  };
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (product_id: number, variation_id: number, quantity: number, variation_attributes?: VariationAttributes) => void;
  removeFromCart: (product_id: number, variation_id?: number) => void;
  updateCart: (product_id: number, variation_id: number, quantity: number) => void;
  clearCart: () => void;
  syncCartWithAPI: () => void;  // To sync local cart to API
}

// Define the type for the children prop
interface CartProviderProps {
  children: ReactNode;
}

export const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = getCartFromLocalStorage();
    setCart(storedCart);
  }, []);

  // Add product variation to cart
  const addToCart = (product_id: number, variation_id: number, quantity: number, variation_attributes?: VariationAttributes) => {
    const productIndex = cart.findIndex((item) => item.id === product_id);
    if (productIndex === -1) {
      // Product doesn't exist in cart, add new product
      const newProduct: CartItem = {
        id: product_id,
        name: 'Product Name',
        price: 29.99,
        regular_price: 35.99,
        sale_price: 29.99,
        variations: {
          [variation_id]: {
            variation_id,
            quantity,
            variation_attributes,
          },
        },
      };
      setCart([...cart, newProduct]);
      saveCartToLocalStorage([...cart, newProduct]);
    } else {
      // Product exists, check if the variation already exists
      const variationIndex = cart[productIndex].variations[variation_id];
      if (variationIndex) {
        // Update existing variation
        const updatedCart = [...cart];
        updatedCart[productIndex].variations[variation_id].quantity += quantity;
        setCart(updatedCart);
        saveCartToLocalStorage(updatedCart);
      } else {
        // Add new variation for existing product
        const updatedCart = [...cart];
        updatedCart[productIndex].variations[variation_id] = {
          variation_id,
          quantity,
          variation_attributes,
        };
        setCart(updatedCart);
        saveCartToLocalStorage(updatedCart);
      }
    }
  };

  const removeFromCart = (product_id: number, variation_id?: number) => {
    const updatedCart = cart
      .map((product) => {
        if (product.id === product_id) {
          if (variation_id) {
            // Remove specific variation from the product
            delete product.variations[variation_id];
          } else {
            // Remove the entire product if no variation_id is provided
            return null;
          }
        }
        return product;
      })
      .filter((product) => product !== null);
    
    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);
  };

  const updateCart = (product_id: number, variation_id: number, quantity: number) => {
    const updatedCart = cart.map((product) => {
      if (product.id === product_id && product.variations[variation_id]) {
        product.variations[variation_id].quantity = quantity;
      }
      return product;
    });
    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    clearCartFromLocalStorage();
  };

  // Sync local cart with API when user logs in
  const syncCartWithAPI = async () => {
    const localCart = getCartFromLocalStorage();

    const userLoggedIn = true; // Assume this flag is set based on authentication status

    if (userLoggedIn && localCart.length > 0) {
      try {
        const apiUrl = '/api/cart/sync'; // This should be the endpoint to sync cart on your WordPress backend
        const response = await axios.post(apiUrl, { cart: localCart });

        if (response.status === 200) {
          // Clear local cart after successful sync
          clearCartFromLocalStorage();
          // Optionally, update frontend cart state with data from API
          setCart(response.data.cart);
        }
      } catch (error) {
        console.error('Error syncing cart with API', error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCart, clearCart, syncCartWithAPI }}>
      {children}
    </CartContext.Provider>
  );
};
