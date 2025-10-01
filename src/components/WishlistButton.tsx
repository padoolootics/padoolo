"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/Contexts/AuthContext";
import { useWishlistContext } from "@/lib/Contexts/WishlistContextMain";
import toast from "react-hot-toast";

export interface WishlistButtonProps {
  className?: string;
  liked?: boolean;
  product_id?: number;
  onClick?: (liked: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  className = "",
  liked = false,
  product_id = 0,
  onClick = () => {},
}) => {
  const [isLiked, setIsLiked] = useState(liked);
  const { user } = useAuth(); // Use auth context to get user info
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistContext();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    // If the user is not authenticated (i.e. no user object), we handle the logic accordingly.
    if (isLiked) {
      // Remove from wishlist
      try {
        if (!user) {
          // Handle non-authenticated (guest) users
          removeFromWishlist(product_id);
          toast("Removed from wishlist");
        } else {
          // Authenticated user: You can make an API call here if needed
          removeFromWishlist(product_id);  // Assuming the operation happens locally
          toast("Removed from wishlist");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error removing from wishlist");
      }
    } else {
      // Add to wishlist
      try {
        if (!user) {
          // Handle non-authenticated (guest) users
          addToWishlist(product_id);
          toast("Added to wishlist");
        } else {
          // Authenticated user: You can make an API call here if needed
          addToWishlist(product_id); // Assuming the operation happens locally
          toast("Added to wishlist");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error adding to wishlist");
      }
    }

    // Toggle the liked state
    setIsLiked(!isLiked);
    onClick(!isLiked); // Notify parent component (if needed)
    setLoading(false);
  };

  // Check if the product is in the wishlist when component mounts or wishlist updates
  useEffect(() => {
    const isProductInWishlist = wishlist.some((item) => item.id === product_id);
    setIsLiked(isProductInWishlist);
  }, [wishlist, product_id]);

  return (
    <button
      className={`w-9 h-9 flex items-center justify-center rounded-full text-neutral-700 nc-shadow-lg ${className} ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading && (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            opacity="0.2"
          />
          <path
            d="M12 2A10 10 0 0 1 22 12"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 12 12"
              to="360 12 12"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      )}
      {!loading && (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20" fill="none">
          <path
            d="M19.84 2.61012C19.3292 2.09912 18.7228 1.69376 18.0554 1.4172C17.3879 1.14064 16.6725 0.998291 15.95 0.998291C15.2275 0.998291 14.5121 1.14064 13.8446 1.4172C13.1772 1.69376 12.5708 2.09912 12.06 2.61012L11 3.67012L9.94 2.61012C8.9083 1.57842 7.50903 0.998826 6.05 0.998826C4.59096 0.998826 3.19169 1.57842 2.16 2.61012C1.1283 3.64181 0.548706 5.04108 0.548706 6.50012C0.548706 7.95915 1.1283 9.35842 2.16 10.3901L3.22 11.4501L11 19.2301L18.78 11.4501L19.84 10.3901C20.351 9.87936 20.7563 9.27293 21.0329 8.60547C21.3095 7.93801 21.4518 7.2226 21.4518 6.50012C21.4518 5.77763 21.3095 5.06222 21.0329 4.39476C20.7563 3.7273 20.351 3.12087 19.84 2.61012Z"
            stroke={isLiked ? "#ef4444" : "#001F3E"}
            fill={isLiked ? "#ef4444" : "none"}
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};

export default WishlistButton;