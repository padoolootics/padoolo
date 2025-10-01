'use client';

import { useWishlistContext } from "@/lib/Contexts/WishlistContextMain";
import Link from "next/link";
import React from "react";

const Wishlist = () => {
   const { wishlist } = useWishlistContext();
  return (
    <Link href="/wishlist" prefetch={true} className="">
    <button className="group w-10 h-10 sm:w-12 sm:h-12 cursor-pointer hover:bg-slate-100 rounded-full inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative">
        {/* <div className="w-3.5 h-3.5 flex items-center bg-gray-800 justify-center bg-primary-500 absolute top-1.5 right-1.5 rounded-full text-[10px] leading-none text-white font-medium">
              <span className="mt-[1px]">3</span>
            </div> */}
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
          stroke={wishlist.length > 0 ? "#ef4444" : "currentColor"}
            fill={wishlist.length > 0 ? "#ef4444" : "none"}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
    </Link>
  );
};

export default Wishlist;