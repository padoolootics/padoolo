// export interface Product {
//   id: number;
//   name: string;
//   slug: string;
//   price: number;
//   image: string;
//   category: string;
//   discountPercent?: number;
//   rating?: number;
//   quantity?: number;
// }

export interface Product {
  id: number;
  name: string;
  slug: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  type: string;
  category: string;
  discount?: string;
  discountPercent?: number;
  rating?: number;
  quantity?: number;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: number;
  regular_price: number;
  sale_price: number | null;
  date_on_sale_from: string | null;
  date_on_sale_to: string | null;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  sold_individually: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: { id: number; name: string; slug: string }[];
  brands: any[];
  tags: any[];
  image: {
    src: string;
    id: number; 
  };
  variantName: string;
  variationId?: number;
  images: {
    id: number;
    date_created: string;
    date_modified: string;
    src: string;
    name: string;
    alt: string;
  }[];
  attributes: any[];
  default_attributes: any[];
  variations: any[];
  grouped_products: any[];
  menu_order: number;
  price_html: string;
  related_ids: number[];
  meta_data: { id: number; key: string; value: string }[];
  stock_status: string;
  has_options: boolean;
  post_password: string;
  global_unique_id: string;
}


export interface Attribute {
  id: number;
  name: string;
  slug: string;
  options: string[];
};

export interface Variation {
  id: number;
  price: string;
  image: string;
  attributes: { name: string; option: string }[];
};

export interface ProductVariation {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: string;
  type: string;
  regular_price: string;
  sale_price: string;
  sku: string;
  categories: { name: string }[];
  tags: { name: string }[];
  images: { src: string; alt: string }[];
  attributes: Attribute[];
  variations?: number[];
};

export interface VariationProduct {
  id: number;
  type: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  description: string;
  permalink: string;
  sku: string;
  global_unique_id: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  on_sale: boolean;
  status: string;
  purchasable: boolean;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[]; // Empty array in the response, can be typed more specifically if downloads are used
  download_limit: number;
  download_expiry: number;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: string;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  weight: string;
  images: {
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    src: string;
    name: string;
    alt: string;
  }[];
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_class: string;
  shipping_class_id: number;
  image: {
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    src: string;
    name: string;
    alt: string;
  };
  attributes: {
    id: number;
    name: string;
    slug: string;
    option: string;
  }[];
  menu_order: number;
  meta_data: any[]; // Empty array in the response, can be typed more specifically if meta data is used
  name: string;
  parent_id: number;
  _links: {
    self: { href: string; targetHints: { allow: string[] } }[];
    collection: { href: string }[];
    up: { href: string }[];
  };
}


export interface ProductImage {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  sizes: string;
  name: string;
  alt: string;
}

export interface ProductPrices {
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_range: { min: string; max: string } | null;
}

export interface AddToCart {
  text: string;
  description: string;
}

// export interface Product {
//   id: number;
//   name: string;
//   slug: string;
//   variation: string;
//   permalink: string;
//   sku: string;
//   summary: string;
//   short_description: string;
//   description: string;
//   on_sale: boolean;
//   prices: ProductPrices;
//   average_rating: string;
//   review_count: number;
//   images: ProductImage[];
//   has_options: boolean;
//   is_purchasable: boolean;
//   is_in_stock: boolean;
//   low_stock_remaining: number | null;
//   add_to_cart: AddToCart;
// }

export type ProductList = Product[];
