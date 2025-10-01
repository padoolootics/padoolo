// src/components/Category/Sidebar.tsx
interface SidebarProps {
    activeCategory: string;
  }
  
  export default function Sidebar({ activeCategory }: SidebarProps) {
    const categories = ['Clothing', 'Shoes', 'Watches', 'Accessories'];
  
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">CATEGORIES</h3>
          <ul className="space-y-1 text-sm">
            {categories.map(cat => (
              <li
                key={cat}
                className={`cursor-pointer ${
                  cat.toLowerCase() === activeCategory.toLowerCase()
                    ? 'text-yellow-600 font-bold'
                    : 'text-gray-600'
                }`}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>
  
        {/* Pricing slider mock */}
        <div>
          <h3 className="font-semibold mb-2">PRICING</h3>
          <input type="range" min={0} max={1000} className="w-full" />
        </div>
  
        {/* Sizes */}
        <div>
          <h3 className="font-semibold mb-2">SIZE</h3>
          <div className="flex flex-wrap gap-2">
            {['28', '30', '32', '34', '36', '40', '42'].map(size => (
              <div
                key={size}
                className="border border-gray-300 px-2 py-1 rounded text-sm cursor-pointer"
              >
                {size}
              </div>
            ))}
          </div>
        </div>
  
        {/* Add more filters here... */}
      </div>
    );
  }
  