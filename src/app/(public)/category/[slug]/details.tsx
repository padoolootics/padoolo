"use client";

import { useState } from "react";
import Image from "next/image";
import ProductCard from "./product-card";

export default function Details({ products }: { products: any }) {
  const [productsList, setProductsList] = useState(products);

  return (
    <>
      <div className="container m-auto py-12">
        {/* <h1 className="text-2xl font-semibold mb-4">Category Products</h1> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {productsList.map((product: any, i: any) => (
            <div key={i} className="">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
