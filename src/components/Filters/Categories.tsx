"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

interface Category {
  id: number;
  name: string;
  count: number;
  slug: string;
  children: Category[];
}

interface CategoriesFilterProps {
  onCategorySelect: (id: number) => void;
  selectedCategoryId: number;
}

// The component to display a single category and its children
const CategoryItem = ({
  category,
  onCategorySelect,
  selectedCategoryId,
}: {
  category: Category;
  onCategorySelect: (id: number) => void;
  selectedCategoryId: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle category name click (sets category ID and does not toggle children)
  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the parent from being selected when clicking on category name
    onCategorySelect(category.id); // Set the category ID when clicking on the name
  };

  // Handle arrow click (toggles child visibility)
  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the parent from being selected when clicking on the arrow
    setIsOpen((prev) => !prev); // Toggle the child visibility when clicking on the arrow
  };

  const isSelected = selectedCategoryId === category.id;

  return (
    <li className="mt-2">
      <button
        onClick={handleCategoryClick}
        className={`flex items-center justify-between py-1 cursor-pointer w-full text-left text-sm transition-colors duration-200
          ${
            isSelected
              ? "text-amber-500 font-semibold"
              : "text-gray-700 hover:text-amber-500"
          }`}
      >
        {/* <span>
          {category.name} ({category.count})
        </span> */}

        <span>
          {
            new DOMParser().parseFromString(category.name, "text/html").body
              .textContent
          }{" "}
          ({category.count})
        </span>

        {/* Arrow icon toggles only when clicked */}
        {category.children.length > 0 && (
          <span className="ml-2 cursor-pointer" onClick={handleArrowClick}>
            {isOpen ? (
              <ChevronDown size={16} className="text-gray-500" />
            ) : (
              <ChevronRight size={16} className="text-gray-500" />
            )}
          </span>
        )}
      </button>

      {/* Recursively render child categories if the parent is open */}
      {isOpen && category.children && category.children.length > 0 && (
        <ul className="pl-6 mt-2 space-y-2">
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              onCategorySelect={onCategorySelect}
              selectedCategoryId={selectedCategoryId}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const CategoriesFilter: React.FC<CategoriesFilterProps> = ({
  onCategorySelect,
  selectedCategoryId,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center ">
        <ArrowPathIcon className="h-6 w-6 text-gray-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-500">Error: {error}</div>;
  }

  return (
    <div className="py-0">
      <h3 className="text-base font-semibold text-gray-800 mb-4">CATEGORIES</h3>
      <hr className="my-4 border-gray-200" />
      <ul className="space-y-1">
        <li className="mt-2">
          <button
            onClick={() => onCategorySelect(0)}
            className={`w-full text-left cursor-pointer text-sm transition-colors duration-200
              ${
                selectedCategoryId === 0
                  ? "text-amber-500 font-bold"
                  : "text-gray-700 hover:text-amber-500"
              }`}
          >
            All Categories
          </button>
        </li>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            onCategorySelect={onCategorySelect}
            selectedCategoryId={selectedCategoryId}
          />
        ))}
      </ul>
    </div>
  );
};

export default CategoriesFilter;
