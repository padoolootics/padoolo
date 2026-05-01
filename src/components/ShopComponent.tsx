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
  const [totalProducts, setTotalProducts] = useState<number>(0);

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
        setTotalProducts(data.total || 0);
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
          {error && <div>Error loading products</div>}

          <div>
            <div className="flex items-center justify-between mb-6">
              <p className=" text-gray-800 mb-0 font-medium">
                {loading 
                  ? "Loading products..." 
                  : `Showing ${products.length} of ${totalProducts} Products`
                }
              </p>
              <SortDropdown
                onSortChange={handleSortChange}
                currentSort={sortOption}
              />
            </div>
            {products.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-20">
                No products found matching your criteria.
              </div>
            )}
            <ul className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${loading ? "opacity-50" : "opacity-100"} transition-opacity duration-300`}>
              { products.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-6 py-2 cursor-pointer bg-white border border-gray-300 text-gray-700 rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <div className="flex space-x-2">
                  {(() => {
                    const pages: (number | string)[] = [];
                    const showRange = 2; // Number of pages to show at start/end

                    if (totalPages <= 8) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      // Always show first 3
                      pages.push(1, 2, 3);

                      if (currentPage > 5 && currentPage < totalPages - 4) {
                        pages.push("...");
                        pages.push(currentPage);
                        pages.push("...");
                      } else if (currentPage <= 5) {
                        if (currentPage > 3) pages.push(4, 5);
                        pages.push("...");
                      } else {
                        pages.push("...");
                        if (currentPage < totalPages - 2) pages.push(totalPages - 4, totalPages - 3);
                      }

                      // Always show last 3
                      pages.push(totalPages - 2, totalPages - 1, totalPages);
                    }

                    // Remove duplicates and sort
                    const uniquePages = Array.from(new Set(pages)).sort((a, b) => {
                      if (a === "..." || b === "...") return 0;
                      return (a as number) - (b as number);
                    });

                    // Re-insert ellipses properly if they were lost/shuffled
                    const finalPages: (number | string)[] = [];
                    for(let i=0; i<uniquePages.length; i++) {
                       finalPages.push(uniquePages[i]);
                       if (typeof uniquePages[i] === 'number' && typeof uniquePages[i+1] === 'number' && (uniquePages[i+1] as number) - (uniquePages[i] as number) > 1) {
                         finalPages.push("...");
                       }
                    }

                    return finalPages.filter((v, i, a) => v !== "..." || a[i-1] !== "...").map((page, index) => (
                      typeof page === "number" ? (
                        <button
                          key={index}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-md transition-all ${
                            page === currentPage
                              ? "bg-amber-500 text-white shadow-md"
                              : "bg-white border border-gray-200 text-gray-600 hover:border-amber-500 hover:text-amber-500"
                          }`}
                        >
                          {page}
                        </button>
                      ) : (
                        <span key={index} className="w-10 h-10 flex items-center justify-center text-gray-400">
                          {page}
                        </span>
                      )
                    ));
                  })()}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-6 py-2 cursor-pointer bg-white border border-gray-300 text-gray-700 rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
