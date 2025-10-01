"use client";

import { ShoppingCart, X } from "lucide-react";

const wishlistItems = [
  {
    id: 1,
    name: "Emporio Armani Analog Blue Dial Men's Watch-AR11362 Stainless Steel, Multicolor Strap",
    oldPrice: "$1299",
    price: "$999",
    stockStatus: "IN STOCK",
    image: "/watches/1.png", // Replace with your actual image path
  },
  {
    id: 2,
    name: "Emporio Armani Analog Blue Dial Men's Watch-AR11362 Stainless Steel, Multicolor Strap",
    oldPrice: "$1299",
    price: "$999",
    stockStatus: "IN STOCK",
    image: "/watches/1.png",
  },
  {
    id: 3,
    name: "Emporio Armani Analog Blue Dial Men's Watch-AR11362 Stainless Steel, Multicolor Strap",
    oldPrice: "$1299",
    price: "$999",
    stockStatus: "IN STOCK",
    image: "/watches/1.png",
  },
];

export default function Wishlist() {
  return (
    <div className="w-full mx-auto p-6 bg-white">
      <h2 className="text-xl font-semibold mb-2">Wishlist</h2>

      <div className="bg-white border border-gray-300 rounded-md shadow-sm">
        {/* Header Row */}
        <div className="px-6 py-3 border-b border-gray-300 bg-gray-50 rounded-md text-sm font-semibold grid grid-cols-12 items-center">
          <div className="col-span-6">PRODUCTS</div>
          <div className="col-span-2">PRICE</div>
          <div className="col-span-2">STOCK STATUS</div>
          <div className="col-span-2 text-right">ACTIONS</div>
        </div>

        {/* Rows */}
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="px-6 py-4 grid grid-cols-12 items-center text-sm"
          >
            {/* Product Info */}
            <div className="col-span-6 flex gap-4 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 object-contain"
              />
              <p className="text-gray-800 ">{item.name}</p>
            </div>

            {/* Price */}
            <div className="col-span-2">
              <span className="line-through text-gray-400 mr-1">{item.oldPrice}</span>
              <span className="text-black font-normal">{item.price}</span>
            </div>

            {/* Stock */}
            <div className="col-span-2 text-green-600 font-normal">
              {item.stockStatus}
            </div>

            {/* Actions */}
            <div className="col-span-2 flex items-center justify-end gap-3">
              <button className="bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold px-3 py-3 flex items-center gap-2 cursor-pointer">
                ADD TO CARD
                <ShoppingCart className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-red-500 cursor-pointer rounded-full border border-gray-300 p-1">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
