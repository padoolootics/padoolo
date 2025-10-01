// import { User } from './../Contexts/types';
export interface CurrencyDetails {
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
  //   user: { id: string; name: string; email: string, status: 'authenticated' | 'unauthenticated' | 'loading' };
  user_display_name: string;
  user_email: string;
  user_nicename: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    name: string;
    email: string;
    username: string;
    role: string;
  };
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
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
  price: string;
  regular_price: string;
  sale_price: string;
  price_range: { min: string; max: string } | null;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  variation: string;
  permalink: string;
  sku: string;
  summary: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: ProductPrices;
  average_rating: string;
  review_count: number;
  images: ProductImage[];
  has_options: boolean;
  is_purchasable: boolean;
  is_in_stock: boolean;
  low_stock_remaining: number | null;
}

export type ProductList = Product[];

export interface WPUser {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  username: string;
  roles: string[];
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    24: string;
    48: string;
    96: string;
  };
  meta: unknown[];
  acf: unknown[];
  yoast_head: string | null;
  yoast_head_json: unknown | null;
  is_super_admin: boolean;
  woocommerce_meta: Record<string, string>;
  billing: {
    address_1: string;
    address_2: string;
    city: string;
    postcode: string;
    country: string;
    state: string;
    email: string;
    phone: string;
  };
  shipping: {
    address_1: string;
    address_2: string;
    city: string;
    postcode: string;
    country: string;
    state: string;
  };
  order_stats: {
    pending: number;
    processing: number;
    on_hold: number;
    delivered: number;
    refunded: number;
    failed: number;
    completed: number;
    cancelled: number;
    checkoutdraft: number;
    total_spent: number;
    total_orders: number;
    total_items: number;
  };
}

export interface QuantityLimits {
  minimum: number;
  maximum: number;
  multiple_of: number;
  editable: boolean;
}

export interface VariationAttribute {
  attribute: string;
  value: string;
}

export interface CartItem {
  key: string;
  id: number;
  quantity: number;
  quantity_limits: QuantityLimits;
  name: string;
  short_description: string;
  description: string;
  sku: string;
  low_stock_remaining: number | null;
  images: ProductImage[];
  variation: VariationAttribute[];
  prices: { price: string; regular_price: string; sale_price: string };
}

export interface Cart {
  items: CartItem[];
  totals: { total_price: string; total_tax: string };
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface ApiError {
  code: string;
  message: string;
  data?: { status: number };
}


// order stats interface

export interface Order {
    id: number;
    parent_id: number;
    status: string;
    currency: string;
    version: string;
    prices_include_tax: boolean;
    date_created: string;
    date_modified: string;
    discount_total: string;
    discount_tax: string;
    shipping_total: string;
    shipping_tax: string;
    cart_tax: string;
    total: string;
    total_tax: string;
    customer_id: number;
    order_key: string;
    billing: Address;
    shipping: Address;
    payment_method: string;
    payment_method_title: string;
    transaction_id: string;
    customer_ip_address: string;
    customer_user_agent: string;
    created_via: string;
    customer_note: string;
    date_completed: string;
    date_paid: string;
    cart_hash: string;
    number: string;
    meta_data: MetaData[];
    line_items: LineItem[];
    tax_lines: any[];
    shipping_lines: ShippingLine[];
    fee_lines: any[];
    coupon_lines: any[];
    refunds: any[];
    payment_url: string;
    is_editable: boolean;
    needs_payment: boolean;
    needs_processing: boolean;
    date_created_gmt: string;
    date_modified_gmt: string;
    date_completed_gmt: string;
    date_paid_gmt: string;
    currency_symbol: string;
    _links: Links;
}

interface Address {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
}

interface LineItem {
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: string;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    taxes: any[];
    meta_data: MetaData[];
    sku: string;
    price: number;
    image: Image;
    parent_name: string | null;
}

interface MetaData {
    id: number;
    key: string;
    value: string | string[];
    display_key?: string;
    display_value?: string;
}

interface Image {
    id: string;
    src: string;
}

interface ShippingLine {
    id: number;
    method_title: string;
    method_id: string;
    instance_id: string;
    total: string;
    total_tax: string;
    taxes: any[];
    tax_status: string;
    meta_data: any[];
}

interface Links {
    self: Link[];
    collection: Link[];
    email_templates: Link[];
    customer: Link[];
}

interface Link {
    href: string;
    targetHints?: {
        allow: string[];
    };
}
