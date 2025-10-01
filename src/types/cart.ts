export interface VariationAttribute {
  attribute: string;
  value: string;
}

export interface CartItemVariation {
  id: number;
  quantity: number;
  variation?: VariationAttribute[];
}

export interface QuantityLimits {
  minimum: number;
  maximum: number;
  multiple_of: number;
  editable: boolean;
}

export interface CartItemImage {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  sizes: string;
  name: string;
  alt: string;
}

export interface RawPrices {
  precision: number;
  price: string;
  regular_price: string;
  sale_price: string;
}

export interface CartItemPrices {
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
  raw_prices: RawPrices;
}

export interface CartItemTotals {
  line_subtotal: string;
  line_subtotal_tax: string;
  line_total: string;
  line_total_tax: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
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
  backorders_allowed: boolean;
  show_backorder_badge: boolean;
  sold_individually: boolean;
  permalink: string;
  images: CartItemImage[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variation: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item_data: any[];
  prices: CartItemPrices;
  totals: CartItemTotals;
  catalog_visibility: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extensions: Record<string, any>;
}

export interface CouponTotals {
  total_discount: string;
  total_discount_tax: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface Coupon {
  code: string;
  discount_type: string;
  totals: CouponTotals;
}

export interface CartTotals {
  total_items: string;
  total_items_tax: string;
  total_fees: string;
  total_fees_tax: string;
  total_discount: string;
  total_discount_tax: string;
  total_shipping: string;
  total_shipping_tax: string;
  total_price: string;
  total_tax: string;
  tax_lines: { name: string; price: string; rate: string }[];
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface Address {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface ShippingRateMetaData {
  key: string;
  value: string;
}

export interface ShippingRate {
  rate_id: string;
  name: string;
  description: string;
  delivery_time: string;
  price: string;
  taxes: string;
  instance_id: number;
  method_id: string;
  meta_data: ShippingRateMetaData[];
  selected: boolean;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface ShippingRateItem {
  key: string;
  name: string;
  quantity: number;
}

export interface ShippingRatePackage {
  package_id: number;
  name: string;
  destination: Omit<
    Address,
    "first_name" | "last_name" | "company" | "phone" | "email"
  >;
  items: ShippingRateItem[];
  shipping_rates: ShippingRate[];
}

export interface Cart {
  items: CartItem[];
  coupons: Coupon[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fees: any[];
  totals: CartTotals;
  shipping_address: Address;
  billing_address: Address;
  needs_payment: boolean;
  needs_shipping: boolean;
  payment_requirements: string[];
  has_calculated_shipping: boolean;
  shipping_rates: ShippingRatePackage[];
  items_count: number;
  items_weight: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cross_sells: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any[];
  payment_methods: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extensions: Record<string, any>;
}
