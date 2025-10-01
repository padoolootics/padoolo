"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { clearLocalWishlist, getLocalWishlist, saveLocalWishlist } from "../hooks/wishUtils";
import toast from "react-hot-toast";

type WishlistItem = {
  id: number;
  name: string;
  price: number;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  loading: boolean;
  addToWishlist: (productId: number, name?: string, price?: number) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with real auth check

  const fetchWooWishlist = async () => {
    const res = await fetch("/wp-json/wc/store/wishlist", {
      credentials: "include",
    });
    const data = await res.json();
    return data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.prices.price,
    }));
  };

  const getWishlist = async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        const wooWishlist = await fetchWooWishlist();
        setWishlist(
          wooWishlist.map((i: any) => ({
            id: i.id,
            name: i.name || `Product #${i.id}`,
            price: i.price || 0,
          }))
        );
      } else {
        const localWishlist = getLocalWishlist();
        setWishlist(
          localWishlist.map((i: any) => ({
            id: i.id,
            name: i.name || `Product #${i.id}`,
            price: i.price || 0,
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: number, name?: string, price?: number) => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        // Add item to WooCommerce wishlist
        await fetch("/wp-json/wc/store/wishlist/add-item", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: productId }),
        });
        setWishlist(await fetchWooWishlist());
        toast("Item added to wishlist");
      } else {
        // Add item to local wishlist
        const localWishlist = getLocalWishlist();
        const existing = localWishlist.find((i: any) => i.id === productId);

        if (!existing) {
          const updatedWishlist = [
            ...localWishlist,
            {
              id: productId,
              name,
              price,
            },
          ];

          saveLocalWishlist(updatedWishlist);
          setWishlist(updatedWishlist);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (productId: number) => {
  setLoading(true);

  try {
    // Check if the product exists in the wishlist
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);

    // If the user is logged in, you can remove from the backend (if necessary)
    if (isLoggedIn) {
      // API call to remove the item from the server if necessary
    //   await fetch(`/wp-json/wc/store/wishlist/remove-item/${productId}`, {
    //     method: "POST",
    //     credentials: "include",
    //   });
    }

    // Update the local state for the wishlist
    setWishlist(updatedWishlist);

    // Optionally, save the updated wishlist to local storage for guest users
    if (!isLoggedIn) {
      saveLocalWishlist(updatedWishlist);
    }

  } catch (error) {
    console.error("Error removing from wishlist:", error);
  } finally {
    setLoading(false);
  }
};


  const clearWishlist = async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        // Clear the wishlist on WooCommerce for logged-in users
        await fetch("/wp-json/wc/store/wishlist/clear", {
          method: "POST",
          credentials: "include",
        });
        setWishlist([]);
      } else {
        clearLocalWishlist();
        setWishlist([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWishlist();
  }, [isLoggedIn]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlistContext must be used inside WishlistProvider");
  return context;
};