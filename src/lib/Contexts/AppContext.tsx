'use client'

import React from "react";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
// import { WishlistProvider } from './WishlistContext';
import { WishlistProvider } from "./WishlistContextMain";
import { SessionProvider } from "next-auth/react";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </SessionProvider>  
  );
};
