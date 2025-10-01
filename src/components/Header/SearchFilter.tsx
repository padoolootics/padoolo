"use client";

import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"; // Assuming you're using HeroIcons
import axios from "axios";
import { Product } from "@/types/products";
import ProductServices from "@/lib/api/services/ProductServices";
import Loader from "../Loader";
import Link from "next/link";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";

const SearchFilter: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Product[]>([]); // Replace with proper type if you know the structure
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Cache for search results to avoid redundant API calls
  const [cache, setCache] = useState<Map<string, Product[]>>(new Map());

  // Debounce search API call
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchText.length >= 3) {
        fetchProducts(searchText);
      } else {
        setResults([]); // Clear results when search text is too short
        setShowDropdown(false); // Hide dropdown
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer); // Cleanup on input change
  }, [searchText]);

  const fetchProducts = async (query: string) => {
    setLoading(true);
    setShowDropdown(true); // Show dropdown when starting the search
    try {
      // Check cache first
      if (cache.has(query)) {
        setResults(cache.get(query)!); // Use cached results if available
        setLoading(false);
        return;
      }

      const response = await ProductServices.searchProducts(query);
      console.log("API Response search:", response); // Log the response for debugging

      setResults(response);
      setCache(new Map(cache.set(query, response))); // Cache the result
    } catch (error) {
      console.error("Error fetching products:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-64">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search products"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full rounded-md border border-gray-300 pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {/* Magnifying glass icon */}
      <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />

      {/* Dropdown for search results */}
      {showDropdown && (
        <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <ArrowPathIcon className="h-6 w-6 mx-auto text-yellow-800 animate-spin" />
            </div>
          ) : results.length > 0 ? (
            results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                prefetch={true}
              >
                <div
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    // setSearchText(product.name);
                    setShowDropdown(false);
                  }}
                >
                  {product.name}
                </div>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
