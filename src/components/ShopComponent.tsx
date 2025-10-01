"use client";

import React, { useState, useEffect } from "react";
import CategoriesFilter from "./Filters/Categories";
import PriceFilter from "./Filters/Price";
import SortDropdown from "./Filters/Sorting";
import ProductCard from "@/app/(public)/category/[slug]/product-card";

interface ShopComponentProps {
  catId?: number;
}

const ShopComponent: React.FC<ShopComponentProps> = ({ catId }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    catId || 0
  );
  const [priceRange, setPriceRange] = useState({ min: 0, max: 30000 });
  const [sortOption, setSortOption] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // A function to handle the selection, which updates the state.
  const handleCategorySelect = (id: number) => {
    setSelectedCategoryId(id);
    setCurrentPage(1); // Reset to page 1 when category is changed
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    setCurrentPage(1); // Reset to page 1 when price filter is changed
  };

  const handleSortChange = (sortValue: string) => {
    setSortOption(sortValue);
    setCurrentPage(1); // Reset to page 1 when sorting is changed
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (selectedCategoryId) {
          params.set("categoryId", selectedCategoryId.toString());
        }
        params.set("minPrice", priceRange.min.toString());
        params.set("maxPrice", priceRange.max.toString());
        params.set("sort", sortOption);
        params.set("page", currentPage.toString());
        params.set("per_page", "12");

        const url = `/api/products?${params.toString()}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (e: any) {
        setError(e.message);
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryId, priceRange, sortOption, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container m-auto py-12">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 bg-white border border-gray-200 p-6 sticky top-4 self-start">
          <CategoriesFilter
            onCategorySelect={handleCategorySelect}
            selectedCategoryId={selectedCategoryId}
          />
          <PriceFilter
            onPriceChange={handlePriceChange}
            minRange={0}
            maxRange={30000}
            currentMin={priceRange.min}
            currentMax={priceRange.max}
          />
        </div>

        <div className="w-full md:w-3/4">
          {/* {loading && <div>Loading...</div>} */}
          {error && <div>Error loading products</div>}

          <div>
            <div className="flex items-center justify-between mb-6">
              <p className=" text-gray-800 mb-0">
                Showing ({products.length}) Products
              </p>
              <SortDropdown
                onSortChange={handleSortChange}
                currentSort={sortOption}
              />
            </div>
            {products.length === 0 && !loading && (
              <div className="text-center text-gray-500">
                No products found matching your criteria.
              </div>
            )}
            <ul className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${loading ? "opacity-50" : "opacity-100"}`}>
              { products.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 cursor-pointer bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex space-x-2">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 cursor-pointer rounded-md ${
                        page === currentPage
                          ? "bg-amber-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 cursor-pointer bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopComponent;
