"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { WishlistContextType, WishlistItem } from "./types";
import { syncWishlist } from "../api/services/wishlist";

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlistIds(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const syncWishlistWithServer = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const localWishlist: string[] = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (localWishlist.length > 0) {
      try {
        const response = await syncWishlist(localWishlist, token);
        console.log("Sync response:", response, localWishlist);
        if (response) {
          const serverWishlist = await response.data;
          console.log('Wishlist synced successfully:', response.data);
          setWishlistIds(serverWishlist.merged_wishlist);
        }
      } catch (error) {
        console.error("Wishlist sync error:", error);
      }
    }
  };

  const addToWishlist = (item: WishlistItem) => {
    setWishlistIds((prev) => {
      if (!prev.includes(item.id)) {
        const updatedWishlist = [...prev, item.id]; // Add item ID to the wishlist
        return updatedWishlist;
      }
      return prev;
    });
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlistIds((prev) => {
      const updatedWishlist = prev.filter((id) => id !== itemId); // Remove item ID from wishlist
      return updatedWishlist;
    });
  };

  const clearWishlist = () => setWishlistIds([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist: wishlistIds, // Provide only the IDs here
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        syncWishlistWithServer, // Provide the sync function
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
