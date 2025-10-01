"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  clearLocalCart,
  getLocalCart,
  saveLocalCart,
} from "../hooks/localCart";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import CartServices from "../api/services/CartServices";
import { setAuthToken } from "../api/services/httpServices";

type CartItem = {
  key?: string;
  id: number;
  variationId?: number;
  quantity: number;
  name: string;
  price: number;
  subtotal?: string;
};

type CartContextType = {
  cart: CartItem[];
  loading: boolean;
  getCart: () => Promise<void>;
  addToCart: (
    productId: number,
    quantity: number,
    name: string,
    price: number,
    variationId?: number
  ) => void;
  updateCartItem: (
    productId: number,
    quantity: number,
    variationId?: number
  ) => Promise<void>;
  removeFromCart: (productId: number, variationId?: number) => void;
  clearCart: () => void;
  syncLocalCartToWoo: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
    if (isAuthenticated) {
      setAuthToken(localStorage.getItem("token"));
    }
  }, [isAuthenticated]);

  // const fetchWooCart = async () => {
  //   setAuthToken(localStorage.getItem("token"));
  //       const wooCart = await CartServices.getCart();
  //       if (Array.isArray(wooCart)) {
  //         const wooCartMapped: CartItem[] = wooCart.map((item: any) => ({
  //           key: item.cart_item_key,
  //           id: item.product_id,
  //           variationId: item.variation_id || null,
  //           quantity: item.quantity,
  //           name: item.product_name,
  //           price: item.price,
  //           subtotal: String(item.price * item.quantity),
  //         }));
  //         setCart(wooCartMapped);
  //       }
  // };

  const getCart = async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        setAuthToken(localStorage.getItem("token"));
        const wooCart = await CartServices.getCart();
        if (Array.isArray(wooCart)) {
          const wooCartMapped: CartItem[] = wooCart.map((item: any) => ({
            key: item.cart_item_key,
            id: item.product_id,
            variationId: item.variation_id || null,
            quantity: item.quantity,
            name: item.product_name,
            price: item.price,
            subtotal: String(item.price * item.quantity),
          }));
          setCart(wooCartMapped);
          setLoading(false);
        } else {
          // console.error("Unexpected response format from getCart:", wooCart);
          setCart([]);
          setLoading(false);
        }
      } else {
        const localCart = getLocalCart();

        setCart(
          localCart.map((i) => ({
            id: i.id,
            variationId: i.variationId,
            name: i.name || `Product #${i.id}`,
            price: i.price || 0,
            quantity: i.quantity,
          }))
        );
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    productId: number,
    quantity: number,
    name: string,
    price: number,
    variationId?: number
  ) => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        // Check if variationId is passed and if it's a variation of the product
        const requestBody = variationId
          ? { id: productId, quantity: quantity, variation_id: variationId }
          : { id: productId, quantity: quantity };

        const res = await CartServices.addToCart(requestBody);

        if (res) {
          const wooCart = await CartServices.getCart();
          if (Array.isArray(wooCart)) {
            const wooCartMapped: CartItem[] = wooCart.map((item: any) => ({
              key: item.cart_item_key,
              id: item.product_id,
              variationId: item.variation_id || null,
              quantity: item.quantity,
              name: item.product_name,
              price: item.price,
              subtotal: String(item.price * item.quantity),
            }));
            setCart(wooCartMapped);
            // toast("Item added to cart");
          } else {
            // console.error("Unexpected response format from getCart:", wooCart);
            setCart([]);
          }
        } else {
          toast.error("Failed to add item to cart");
        }
      } else {
        // Local storage handling
        const localCart = getLocalCart();
        // Check if item with the same productId and variationId already exists
        const existing = localCart.find(
          (i) =>
            i.id === productId &&
            (variationId ? i.variationId === variationId : true)
        );

        let updatedCart;
        if (existing) {
          // If it exists, update the quantity for that specific variation
          updatedCart = localCart.map((i) =>
            i.id === productId &&
            (variationId ? i.variationId === variationId : true)
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        } else {
          // If it doesn't exist, add the new item (with or without variation)
          updatedCart = [
            ...localCart,
            {
              id: productId,
              variationId,
              quantity,
              name: name || `Product #${productId}`,
              price: price || 0,
            },
          ];
        }

        // Save the updated cart to local storage
        saveLocalCart(updatedCart);

        // Update local cart state
        setCart(
          updatedCart.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            variationId: i.variationId,
            name: i.name,
            price: i.price,
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (
    productId: number,
    quantity: number,
    variationId?: number
  ) => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        const requestBody = variationId
          ? {
              product_id: productId,
              variation_id: variationId,
              quantity: quantity,
            }
          : { product_id: productId, quantity: quantity };

        // Make API request to update item in the cart
        const res = await CartServices.updateCart(requestBody);

        if (res) {
          const wooCart = await CartServices.getCart();
          if (Array.isArray(wooCart)) {
            const wooCartMapped: CartItem[] = wooCart.map((item: any) => ({
              key: item.cart_item_key,
              id: item.product_id,
              variationId: item.variation_id || null,
              quantity: item.quantity,
              name: item.product_name,
              price: item.price,
              subtotal: String(item.price * item.quantity),
            }));
            setCart(wooCartMapped);
            toast("Cart updated");
          } else {
            // console.error("Unexpected response format from getCart:", wooCart);
            setCart([]);
          }
        } else {
          toast.error("Failed to update cart");
        }
      } else {
        // For non-logged-in users, update the local cart

        const localCart = getLocalCart();

        const updatedCart = localCart.map((item) =>
          item.id === productId &&
          (variationId ? item.variationId === variationId : true)
            ? { ...item, quantity }
            : item
        );

        saveLocalCart(updatedCart);

        setCart(
          updatedCart.map((item) => ({
            id: item.id,
            variationId: item.variationId,
            name: item.name || `Product #${item.id}`,
            price: item.price || 0,
            quantity: item.quantity,
          }))
        );
        toast("Cart updated");
      }
    } finally {
      setLoading(false);
    }
  };


  const removeFromCart = async (productId: number, variationId?: number) => {
    setLoading(true);

    try {
      if (isLoggedIn) {
        const requestBody = variationId
          ? {
              product_id: productId,
              variation_id: variationId,
            }
          : { product_id: productId };

        const res = await CartServices.removeCart(requestBody);

        if (res) {
          const wooCart = await CartServices.getCart();
          if (Array.isArray(wooCart)) {
            const wooCartMapped: CartItem[] = wooCart.map((item: any) => ({
              key: item.cart_item_key,
              id: item.product_id,
              variationId: item.variation_id || null,
              quantity: item.quantity,
              name: item.product_name,
              price: item.price,
              subtotal: String(item.price * item.quantity),
            }));
            setCart(wooCartMapped);
            toast("Cart product removed");
          } else {
            // console.error("Unexpected response format from getCart:", wooCart);
            setCart([]);
          }
        } else {
          toast.error("Failed to remove cart product.");
        }
      } else {
        const localCart = getLocalCart();
console.log('localCart', localCart)
        const updated = localCart.filter((i) => {
          if (variationId !== undefined) {
            return i.id !== productId || i.variationId !== variationId;
          } else {
            return i.id !== productId || (i.variationId && i.variationId !== 0);
          }
        });

        

        if (updated.length !== localCart.length) {
          saveLocalCart(updated);
        }

        setCart(
          updated.map((i) => ({
            id: i.id,
            variationId: i.variationId,
            name: i.name || `Product #${i.id}`,
            price: i.price || 0,
            quantity: i.quantity,
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        const res = await CartServices.clearCart();

        if (res) {
          setCart([]);
          toast("Cart cleared");
        } else {
          toast.error("Failed to clear cart");
        }
      } else {
        clearLocalCart();
        setCart([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const syncLocalCartToWoo = async () => {
    const guestCart = getLocalCart();
    console.log("Guest Cart context start:", guestCart);

    const res = await CartServices.syncLocalCart({
      merge: true,
      items: guestCart.map((item) => ({
        product_id: item.id,
        name: item.name || `Product #${item.id}`,
        price: item.price || 0,
        quantity: item.quantity,
        variation_id: item.variationId,
      })),
    });

    if (res) {
      const wooCart = await CartServices.getCart();
      if (Array.isArray(wooCart)) {
        const wooCartMapped: CartItem[] = wooCart.map((item: any) => ({
          key: item.cart_item_key,
          id: item.product_id,
          variationId: item.variation_id || null,
          quantity: item.quantity,
          name: item.product_name,
          price: item.price,
          subtotal: String(item.price * item.quantity),
        }));
        setCart(wooCartMapped);
        toast("Cart items updated.");
      } else {
        // console.error("Unexpected response format from getCart:", wooCart);
        setCart([]);
      }
    }

    clearLocalCart();
    // setCart(await fetchWooCart());
  };

  useEffect(() => {
    getCart();
  }, [isLoggedIn]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        getCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        syncLocalCartToWoo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCartContext must be used inside CartProvider");
  return context;
};
