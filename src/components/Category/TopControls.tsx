"use client";

import {
  ChevronDown,
  Grid2X2,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

type TopControlsProps = {
  onToggleSidebar: () => void;
  sortOptions: string[];
  currentSort: string;
  onSortChange: (sort: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
};

export default function TopControls({
  onToggleSidebar,
  sortOptions,
  currentSort,
  onSortChange,
  viewMode,
  onViewModeChange,
}: TopControlsProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b border-gray-400 px-4 py-3 text-sm">
      {/* Breadcrumbs */}
      <div className="text-gray-600">
        <span className="text-black font-medium">Home</span>
        <span className="mx-2">/</span>
        <span className="text-black font-medium">Shop</span>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Clothing</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Filter toggle */}
        <button
          onClick={onToggleSidebar}
          className="flex items-center gap-1 text-sm text-gray-800"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>

        {/* Sorting */}
        <div className="relative">
          <button
            className="flex items-center gap-1 px-3 py-1 text-sm"
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            {currentSort}
            <ChevronDown className="w-4 h-4" />
          </button>

          {isSortOpen && (
            <ul className="absolute right-0 z-10 mt-2 w-40 bg-white text-sm">
              {sortOptions.map((option) => (
                <li
                  key={option}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    currentSort === option ? "font-medium" : ""
                  }`}
                  onClick={() => {
                    onSortChange(option);
                    setIsSortOpen(false);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* View mode */}
        <div className="flex gap-1">
          <button
            className={`border border-gray-300 p-1.5 rounded-md cursor-pointer ${
              viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            onClick={() => onViewModeChange("grid")}
          >
            <Grid2X2 className="w-4 h-4" />
          </button>
          <button
            className={`border border-gray-300 p-1.5 rounded-md cursor-pointer ${
              viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            onClick={() => onViewModeChange("list")}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
