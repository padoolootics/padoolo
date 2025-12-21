// Simplified types for core data structures
export type Image = {
  id: number;
  src: string;
  name: string;
  alt: string;
};

export type Attribute = {
  id: number;
  name: string;
  option: string; // The selected value/term for this attribute
};

export type ProductAttribute = {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean; // True if this attribute is used for variations
  options: string[]; // List of available options/terms
};

export type PriceDetails = {
  regular_price: string;
  sale_price: string;
  price: string;
};

// --- Variation Type ---
export type ProductVariation = {
  id: number;
  attributes: Attribute[];
  price: string;
  name?: string;
  regular_price: string;
  sale_price: string;
  image: Image;
  stock_status: 'instock' | 'outofstock';
  stock_quantity: number | null;
};

type MetaItem = {
  id: number;
  key: string;
  value: string;
};

// --- Core Product Type ---
export type Product = PriceDetails & {
  id: number;
  name: string;
  slug: string;
  type: 'simple' | 'variable' | 'grouped' | 'external';
  description: string;
  sku: string;
  brands: string[];
  categories: string[];
  tags: string[];
  short_description: string;
  images: Image[];
  stock_quantity: number;
  attributes: ProductAttribute[];
  stock_status: 'instock' | 'outofstock';
  purchasable: boolean;
  variations: number[]; // IDs of variations (only for variable products)
  parent_id: number; // Only for grouped/variation products
  meta_data: MetaItem[];
};

// Utility type for handling variation selection state
export type VariationOptions = Record<string, string>; // { "Color": "Blue", "Size": "M" }