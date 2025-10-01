'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';

const SidebarFilters = () => {
  // const [activeCategory, setActiveCategory] = useState('Clothing');
  const activeCategory = 'Clothing'; // Hardcoded for this example, can be dynamic based on props or state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Clothing: true,
    Watches: false,
    Sunglasses: false,
    Accessories: false,
    Brands: false,
    Discount: false,
    Type: false,
    Occasion: false,
    Colors: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="w-full border border-gray-300">
      {/* Categories */}
      <div className="border-b border-gray-300 p-4">
        <h2 className="font-semibold mb-2">CATEGORIES</h2>
        {['Shoes', 'Clothing', 'Watches', 'Sunglasses', 'Accessories'].map((cat) => (
          <div key={cat} className="mb-3">
            <div
              className="flex items-center justify-between cursor-pointer font-medium text-sm"
              onClick={() => toggleSection(cat)}
            >
              <span className={cat === activeCategory ? 'text-yellow-500 font-semibold' : 'text-gray-700'}>
                {cat}
              </span>
              {openSections[cat] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {/* Subcategories (only for Clothing in this example) */}
            {cat === 'Clothing' && openSections[cat] && (
              <ul className="ml-2 mt-3 text-gray-600 text-sm space-y-3">
                {[
                  { name: 'Blazers', count: 82 },
                  { name: 'Men Suits', count: 110 },
                  { name: 'Blouses', count: 103 },
                  { name: 'Coat Pant', count: 72 },
                  { name: 'T-Shirts', count: 36 },
                  { name: 'Men Shirts', count: 122 },
                ].map((item) => (
                  <li key={item.name} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>{item.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="border-b border-gray-300 p-4">
        <h2 className="font-semibold mb-2">PRICING</h2>
        <div className="px-1">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>$100</span>
            <span>$750</span>
          </div>
          <input type="range" min={0} max={1000} className="w-full accent-green-600" />
        </div>
      </div>

      {/* Size */}
      <div className="border-b border-gray-300 p-4">
        <h2 className="font-semibold mb-2">SIZE</h2>
        <div className="flex flex-wrap gap-2">
          {['26', '28', '30', '32', '34', '36', '38', '40', '42'].map((size) => (
            <button
              key={size}
              className="border border-gray-400 rounded px-2 py-1 text-sm text-gray-800 hover:bg-gray-100"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* More Filters */}
      {['BRANDS', 'DISCOUNT', 'TYPE', 'OCCATION', 'COLORS'].map((section) => (
        <div key={section} className="px-4 py-3 border-b border-gray-400">
          <div
            className="flex items-center justify-between cursor-pointer font-semibold text-sm"
            onClick={() => toggleSection(section)}
          >
            <span>{section}</span>
            {openSections[section] ? <Minus size={16} /> : <Plus size={16} />}
          </div>
        </div>
      ))}
    </aside>
  );
};

export default SidebarFilters;
