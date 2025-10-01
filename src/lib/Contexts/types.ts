export interface User {
  id?: string;
  name: string;
  email: string;
  profilePicture?: string;
  location?: string | null;
  status: "authenticated" | "unauthenticated" | "loading";
  token?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

export interface Variation {
  attribute: string;
  value: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  variation: Variation[];
}

export interface WishlistItem {
  id: string;
  //   name: string;
  //   price: number;
  //   image?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  clearWishlist: () => void;
  syncWishlistWithServer: () => void;
}
