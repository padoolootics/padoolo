'use client';

import { useState, useRef } from 'react';
import { EllipsisVertical } from "lucide-react";

interface CardProps {
  bgColor: string;
  amount: string;
  cardNumber: string;
  brandLogo: string;
  brandName: string;
  holder: string;
}

export default function CardItem({
  bgColor,
  amount,
  cardNumber,
  brandLogo,
  brandName,
  holder,
}: CardProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`relative p-4 rounded-lg text-white w-auto md:w-[260px] md:mb-0 mb-4 ${bgColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm">$ {amount} USD</p>
          <p className="text-xs mt-2 text-white/70">CARD NUMBER</p>
          <p className="text-sm tracking-widest">{cardNumber}</p>
        </div>
        <div className="relative">
          <button onClick={() => setOpen(!open)}>
            <EllipsisVertical className="w-5 h-5 text-white cursor-pointer" />
          </button>
          {open && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-6 bg-white text-black shadow-lg rounded-md w-32 z-10"
            >
              <button className="w-full text-sm text-left px-4 py-2 hover:bg-gray-100 rounded-sm cursor-pointer">Edit Card</button>
              <button className="w-full text-sm text-left px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer">Delete Card</button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <img src={brandLogo} alt={brandName} className="h-6" />
        <p className="text-sm">{holder}</p>
      </div>
    </div>
  );
}
