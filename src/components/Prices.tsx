import React, { FC } from "react";

export interface PricesProps {
  className?: string;
  price?: number;
  contentClass?: string;
}

const Prices: FC<PricesProps> = ({
  className = "",
  price = 33,
  contentClass = "py-1 px-2 md:py-1.5 md:px-2.5 text-base font-medium",
}) => {
  return (
    <div className={`${className}`}>
      <div
        className={`flex items-center border-2 border-yellow-600 rounded-lg ${contentClass}`}
      >
        <span className="text-yellow-800 !leading-none">€{String(price)}</span>
      </div>
    </div>
  );
};

export default Prices;
